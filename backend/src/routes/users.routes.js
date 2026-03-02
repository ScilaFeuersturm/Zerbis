import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

export const usersRouter = Router();

/**
 * Current user + profile depending on role
 */
usersRouter.get("/me", auth, allowRoles("admin", "client", "provider"), async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [uRows] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.status, r.name AS role
       FROM users u JOIN roles r ON r.id = u.role_id
       WHERE u.id = ? LIMIT 1`,
      [userId]
    );
    const user = uRows[0];
    if (!user) return res.status(404).json({ error: "Not found" });

    let profile = null;

    if (user.role === "client") {
      const [p] = await pool.query(
        "SELECT bio, city, avatar_url FROM client_profiles WHERE user_id = ? LIMIT 1",
        [userId]
      );
      profile = p[0] || null;
    } else if (user.role === "provider") {
      const [p] = await pool.query(
        "SELECT headline, bio, city, avatar_url, is_verified, avg_rating FROM provider_profiles WHERE user_id = ? LIMIT 1",
        [userId]
      );
      profile = p[0] || null;
    }

    res.json({ ...user, profile });
  } catch (e) {
    next(e);
  }
});

/**
 * Update current user's basic fields + profile fields
 * (simple, extend as needed)
 */
usersRouter.patch("/me", auth, allowRoles("client", "provider"), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, bio, city, headline, avatarUrl } = req.body || {};

    if (fullName || phone) {
      await pool.query(
        "UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone) WHERE id = ?",
        [fullName ?? null, phone ?? null, userId]
      );
    }

    if (req.user.role === "client") {
      await pool.query(
        `UPDATE client_profiles
         SET bio = COALESCE(?, bio),
             city = COALESCE(?, city),
             avatar_url = COALESCE(?, avatar_url)
         WHERE user_id = ?`,
        [bio ?? null, city ?? null, avatarUrl ?? null, userId]
      );
    }

    if (req.user.role === "provider") {
      await pool.query(
        `UPDATE provider_profiles
         SET headline = COALESCE(?, headline),
             bio = COALESCE(?, bio),
             city = COALESCE(?, city),
             avatar_url = COALESCE(?, avatar_url)
         WHERE user_id = ?`,
        [headline ?? null, bio ?? null, city ?? null, avatarUrl ?? null, userId]
      );
    }

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
