import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

export const adminRouter = Router();

adminRouter.use(auth, allowRoles("admin"));

adminRouter.get("/users", async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.phone, u.status, r.name AS role, u.created_at
     FROM users u JOIN roles r ON r.id = u.role_id
     ORDER BY u.created_at DESC`
  );
  res.json(rows);
});

adminRouter.patch("/users/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body; // active/inactive/banned
  if (!["active","inactive","banned"].includes(status)) return res.status(400).json({ error: "Invalid status" });

  const [r] = await pool.query("UPDATE users SET status=? WHERE id=?", [status, id]);
  if (r.affectedRows === 0) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

adminRouter.get("/reviews", async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.rating, r.comment, r.status, r.created_at,
            u1.full_name AS from_name, u2.full_name AS to_name
     FROM reviews r
     JOIN users u1 ON u1.id = r.from_user_id
     JOIN users u2 ON u2.id = r.to_user_id
     ORDER BY r.created_at DESC`
  );
  res.json(rows);
});

adminRouter.patch("/reviews/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body; // visible/hidden/flagged
  if (!["visible","hidden","flagged"].includes(status)) return res.status(400).json({ error: "Invalid status" });

  const [r] = await pool.query("UPDATE reviews SET status=? WHERE id=?", [status, id]);
  if (r.affectedRows === 0) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});