import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

export const providersRouter = Router();

// Buscar prestadores (cliente y prestador)
providersRouter.get("/", auth, allowRoles("client","provider","admin"), async (req, res) => {
  const { q, city, categoryId, category } = req.query;

  // listado base + filtrado por servicios/categoría
  const params = [];
  let where = "WHERE u.status = 'active'";

  if (q) { where += " AND (u.full_name LIKE ? OR p.headline LIKE ?)"; params.push(`%${q}%`, `%${q}%`); }
  if (city) { where += " AND p.city = ?"; params.push(city); }
  if (categoryId) {
    where += ` AND EXISTS (
      SELECT 1 FROM provider_categories pc2
      WHERE pc2.provider_id = u.id AND pc2.category_id = ?
    )`;
    params.push(Number(categoryId));
  }
  if (category) {
    where += ` AND EXISTS (
      SELECT 1 FROM provider_categories pc2
      JOIN categories c2 ON c2.id = pc2.category_id
      WHERE pc2.provider_id = u.id AND c2.name = ?
    )`;
    params.push(category);
  }

  const sql = `
    SELECT
      u.id, u.full_name, p.headline, p.bio, p.city, p.avatar_url, p.avg_rating,
      MIN(s.price_from)                                                       AS price_from,
      (SELECT s2.price_unit FROM provider_services s2
       WHERE s2.provider_id = u.id AND s2.is_active = 1
       ORDER BY s2.price_from ASC LIMIT 1)                                   AS price_unit,
      GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ', ')           AS categories
    FROM users u
    JOIN roles r            ON r.id = u.role_id AND r.name = 'provider'
    JOIN provider_profiles p ON p.user_id = u.id
    LEFT JOIN provider_categories pc ON pc.provider_id = u.id
    LEFT JOIN categories c           ON c.id = pc.category_id
    LEFT JOIN provider_services s    ON s.provider_id = u.id AND s.is_active = 1
    ${where}
    GROUP BY u.id, u.full_name, p.headline, p.bio, p.city, p.avatar_url, p.avg_rating
    ORDER BY p.avg_rating DESC, u.id DESC
    LIMIT 100
  `;

  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// Perfil prestador (cliente puede verlo, prestador también, admin también)
providersRouter.get("/:id", auth, allowRoles("client","provider","admin"), async (req, res) => {
  const providerId = Number(req.params.id);

  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.phone, p.headline, p.bio, p.city, p.avatar_url, p.avg_rating
     FROM users u
     JOIN roles r ON r.id = u.role_id AND r.name = 'provider'
     JOIN provider_profiles p ON p.user_id = u.id
     WHERE u.id = ? AND u.status = 'active'`,
    [providerId]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });

  const [services] = await pool.query(
    `SELECT s.id, s.title, s.description, s.price_from, s.price_unit, c.id AS category_id, c.name AS category
     FROM provider_services s JOIN categories c ON c.id = s.category_id
     WHERE s.provider_id = ? AND s.is_active = 1`,
    [providerId]
  );

  res.json({ ...rows[0], services });
});