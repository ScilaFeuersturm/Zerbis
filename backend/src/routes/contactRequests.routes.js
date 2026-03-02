import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

export const contactRequestsRouter = Router();

// Cliente crea pedido (esto habilita mensajería)
contactRequestsRouter.post("/", auth, allowRoles("client"), async (req, res) => {
  const { providerId, message } = req.body;
  const clientId = req.user.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [r] = await conn.query(
      "INSERT INTO contact_requests(client_id, provider_id, message) VALUES (?,?,?)",
      [clientId, Number(providerId), message || null]
    );

    const requestId = r.insertId;
    await conn.query("INSERT INTO conversations(contact_request_id) VALUES (?)", [requestId]);

    await conn.commit();
    res.status(201).json({ id: requestId });
  } catch {
    await conn.rollback();
    res.status(500).json({ error: "Failed to create request" });
  } finally {
    conn.release();
  }
});

// Prestador ve pedidos recibidos
contactRequestsRouter.get("/incoming", auth, allowRoles("provider"), async (req, res) => {
  const providerId = req.user.id;
  const [rows] = await pool.query(
    `SELECT cr.*, u.full_name AS client_name
     FROM contact_requests cr
     JOIN users u ON u.id = cr.client_id
     WHERE cr.provider_id = ?
     ORDER BY cr.created_at DESC`,
    [providerId]
  );
  res.json(rows);
});

// Cliente ve sus pedidos enviados
contactRequestsRouter.get("/outgoing", auth, allowRoles("client"), async (req, res) => {
  const clientId = req.user.id;
  const [rows] = await pool.query(
    `SELECT cr.*, u.full_name AS provider_name
     FROM contact_requests cr
     JOIN users u ON u.id = cr.provider_id
     WHERE cr.client_id = ?
     ORDER BY cr.created_at DESC`,
    [clientId]
  );
  res.json(rows);
});

// Prestador acepta/rechaza (habilita el “match” en la app)
contactRequestsRouter.patch("/:id/status", auth, allowRoles("provider"), async (req, res) => {
  const requestId = Number(req.params.id);
  const { status } = req.body; // accepted/rejected/closed
  if (!["accepted","rejected","closed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  // solo el prestador dueño del pedido
  const [r] = await pool.query(
    "UPDATE contact_requests SET status=? WHERE id=? AND provider_id=?",
    [status, requestId, req.user.id]
  );
  if (r.affectedRows === 0) return res.status(404).json({ error: "Not found" });

  res.json({ ok: true });
});