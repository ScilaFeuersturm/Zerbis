import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

export const categoriesRouter = Router();

// Listado de todas las categorías (cualquier usuario autenticado)
categoriesRouter.get("/", auth, async (_req, res) => {
  const [rows] = await pool.query("SELECT id, name FROM categories ORDER BY name ASC");
  res.json(rows);
});
