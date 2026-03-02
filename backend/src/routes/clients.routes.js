import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

export const clientsRouter = Router();

/**
 * Provider can only see a client's profile if there's an accepted relationship (contact_request accepted),
 * Admin can see any.
 */
clientsRouter.get("/:id", auth, allowRoles("admin", "provider"), async (req, res, next) => {
  try {
    const clientId = Number(req.params.id);

    if (req.user.role === "provider") {
      const providerId = req.user.id;
      const [rel] = await pool.query(
        `SELECT 1
         FROM contact_requests
         WHERE provider_id = ? AND client_id = ? AND status = 'accepted'
         LIMIT 1`,
        [providerId, clientId]
      );
      if (!rel[0]) return res.status(403).json({ error: "Forbidden" });
    }

    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, cp.bio, cp.city, cp.avatar_url
       FROM users u
       JOIN roles r ON r.id = u.role_id AND r.name = 'client'
       LEFT JOIN client_profiles cp ON cp.user_id = u.id
       WHERE u.id = ? AND u.status = 'active'
       LIMIT 1`,
      [clientId]
    );

    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});
