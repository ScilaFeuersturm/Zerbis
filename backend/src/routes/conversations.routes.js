import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

export const conversationsRouter = Router();

/**
 * Unread count — conversaciones donde el último mensaje no fue enviado por mí
 */
conversationsRouter.get("/unread-count", auth, allowRoles("client", "provider"), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [[{ count }]] = await pool.query(
      `SELECT COUNT(*) AS count
       FROM conversations c
       JOIN contact_requests cr ON cr.id = c.contact_request_id
       JOIN messages m ON m.id = (
         SELECT id FROM messages
         WHERE conversation_id = c.id AND is_deleted = 0
         ORDER BY created_at DESC LIMIT 1
       )
       WHERE (cr.client_id = ? OR cr.provider_id = ?)
         AND m.sender_id != ?`,
      [userId, userId, userId]
    );
    res.json({ count: Number(count) });
  } catch (e) {
    next(e);
  }
});

/**
 * List conversations for current user (client/provider)
 */
conversationsRouter.get("/", auth, allowRoles("client", "provider"), async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT c.id AS conversation_id, cr.id AS request_id, cr.status,
              cr.client_id, cr.provider_id,
              u1.full_name AS client_name, u2.full_name AS provider_name
       FROM conversations c
       JOIN contact_requests cr ON cr.id = c.contact_request_id
       JOIN users u1 ON u1.id = cr.client_id
       JOIN users u2 ON u2.id = cr.provider_id
       WHERE cr.client_id = ? OR cr.provider_id = ?
       ORDER BY COALESCE(cr.updated_at, cr.created_at) DESC`,
      [userId, userId]
    );

    res.json(rows);
  } catch (e) {
    next(e);
  }
});

/**
 * Get messages for a conversation (participants only)
 */
conversationsRouter.get("/:conversationId/messages", auth, allowRoles("client", "provider"), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversationId = Number(req.params.conversationId);

    const [access] = await pool.query(
      `SELECT cr.client_id, cr.provider_id
       FROM conversations c
       JOIN contact_requests cr ON cr.id = c.contact_request_id
       WHERE c.id = ? LIMIT 1`,
      [conversationId]
    );

    const rel = access[0];
    if (!rel) return res.status(404).json({ error: "Not found" });
    if (![rel.client_id, rel.provider_id].includes(userId)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const [msgs] = await pool.query(
      `SELECT id, sender_id, content, created_at
       FROM messages
       WHERE conversation_id = ? AND is_deleted = 0
       ORDER BY created_at ASC`,
      [conversationId]
    );

    res.json(msgs);
  } catch (e) {
    next(e);
  }
});

/**
 * Send message
 */
conversationsRouter.post("/:conversationId/messages", auth, allowRoles("client", "provider"), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversationId = Number(req.params.conversationId);
    const content = String(req.body?.content || "").trim();
    if (!content) return res.status(400).json({ error: "Empty message" });

    const [access] = await pool.query(
      `SELECT cr.client_id, cr.provider_id, cr.status
       FROM conversations c
       JOIN contact_requests cr ON cr.id = c.contact_request_id
       WHERE c.id = ? LIMIT 1`,
      [conversationId]
    );

    const rel = access[0];
    if (!rel) return res.status(404).json({ error: "Not found" });
    if (![rel.client_id, rel.provider_id].includes(userId)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (rel.status === "rejected") return res.status(403).json({ error: "Conversation closed" });

    await pool.query(
      "INSERT INTO messages(conversation_id, sender_id, content) VALUES (?,?,?)",
      [conversationId, userId, content]
    );

    res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
});
