import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { config } from "../config.js";

export const authRouter = Router();

// helper role->id
async function getRoleIdByName(name) {
  const [rows] = await pool.query("SELECT id FROM roles WHERE name = ?", [name]);
  return rows[0]?.id;
}

authRouter.post("/register", async (req, res) => {
  const { role, fullName, email, phone, password, city, bio, headline } = req.body;

  if (!["client", "provider"].includes(role)) {
    return res.status(400).json({ error: "Role must be client or provider" });
  }
  if (!email || !password || !fullName) return res.status(400).json({ error: "Missing fields" });

  const roleId = await getRoleIdByName(role);
  const passwordHash = await bcrypt.hash(password, 10);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [r] = await conn.query(
      "INSERT INTO users(role_id, full_name, email, phone, password_hash) VALUES (?,?,?,?,?)",
      [roleId, fullName, email, phone || null, passwordHash]
    );
    const userId = r.insertId;

    if (role === "client") {
      await conn.query(
        "INSERT INTO client_profiles(user_id, bio, city) VALUES (?,?,?)",
        [userId, bio || null, city || null]
      );
    } else {
      await conn.query(
        "INSERT INTO provider_profiles(user_id, headline, bio, city) VALUES (?,?,?,?)",
        [userId, headline || null, bio || null, city || null]
      );
    }

    await conn.commit();
    res.status(201).json({ ok: true });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: "Register failed" });
  } finally {
    conn.release();
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query(
    `SELECT u.id, u.password_hash, u.status, r.name AS role
     FROM users u JOIN roles r ON r.id = u.role_id
     WHERE u.email = ? LIMIT 1`,
    [email]
  );

  const user = rows[0];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  if (user.status !== "active") return res.status(403).json({ error: "User not active" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: "7d" });
  res.json({ token, role: user.role });
});