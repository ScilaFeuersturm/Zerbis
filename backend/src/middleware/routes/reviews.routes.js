import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

export const reviewsRouter = Router();

// Crear reseña: solo si existe contact_request accepted entre ambos
reviewsRouter.post("/", auth, allowRoles("client","provider"), async (req, res) => {
  const fromUserId = req.user.id;
  const { toUserId, contactRequestId, rating, comment } = req.body;

  const [rel] = await pool.query(
    `SELECT client_id, provider_id, status
     FROM contact_requests
     WHERE id = ? LIMIT 1`,
    [Number(contactRequestId)]
  );
  if (!rel[0] || rel[0].status !== "accepted") return res.status(400).json({ error: "No accepted relationship" });

  const okPair =
    (rel[0].client_id === fromUserId && rel[0].provider_id === Number(toUserId)) ||
    (rel[0].provider_id === fromUserId && rel[0].client_id === Number(toUserId));
  if (!okPair) return res.status(403).json({ error: "Forbidden" });

  await pool.query(
    "INSERT INTO reviews(from_user_id, to_user_id, contact_request_id, rating, comment) VALUES (?,?,?,?,?)",
    [fromUserId, Number(toUserId), Number(contactRequestId), Number(rating), comment || null]
  );

  res.status(201).json({ ok: true });
});

// Listar reseñas visibles de un usuario
reviewsRouter.get("/to/:userId", auth, allowRoles("client","provider","admin"), async (req, res) => {
  const toUserId = Number(req.params.userId);
  const [rows] = await pool.query(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.full_name AS from_name
     FROM reviews r
     JOIN users u ON u.id = r.from_user_id
     WHERE r.to_user_id = ? AND r.status = 'visible'
     ORDER BY r.created_at DESC`,
    [toUserId]
  );
  res.json(rows);
});