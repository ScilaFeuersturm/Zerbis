const pool = require('../config/db');
const { tablesAllowed } = require('../config/env');

const allowedTables = new Set(tablesAllowed);

const isSafeIdentifier = (identifier) => /^[a-zA-Z0-9_]+$/.test(identifier);

const ensureTableAllowed = (tableName) => {
  if (!isSafeIdentifier(tableName)) {
    const error = new Error('Nombre de tabla inválido.');
    error.statusCode = 400;
    throw error;
  }

  if (!allowedTables.has(tableName)) {
    const error = new Error(`La tabla '${tableName}' no está habilitada.`);
    error.statusCode = 403;
    throw error;
  }
};

const listRows = async (tableName, query) => {
  ensureTableAllowed(tableName);

  const page = Math.max(Number(query.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize || 20), 1), 100);

  const filters = Object.entries(query)
    .filter(([key]) => !['page', 'pageSize'].includes(key))
    .filter(([key]) => isSafeIdentifier(key));

  const whereParts = filters.map(([column]) => `\`${column}\` = ?`);
  const whereValues = filters.map(([, value]) => value);

  const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';
  const offset = (page - 1) * pageSize;

  const sql = `SELECT * FROM \`${tableName}\` ${whereClause} LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(sql, [...whereValues, pageSize, offset]);

  return { page, pageSize, rows };
};

const getById = async (tableName, id) => {
  ensureTableAllowed(tableName);

  const sql = `SELECT * FROM \`${tableName}\` WHERE id = ? LIMIT 1`;
  const [rows] = await pool.query(sql, [id]);
  return rows[0] || null;
};

const createRow = async (tableName, data) => {
  ensureTableAllowed(tableName);

  const columns = Object.keys(data).filter(isSafeIdentifier);

  if (!columns.length) {
    const error = new Error('No se enviaron columnas válidas para crear el registro.');
    error.statusCode = 400;
    throw error;
  }

  const values = columns.map((column) => data[column]);
  const placeholders = columns.map(() => '?').join(', ');
  const sql = `INSERT INTO \`${tableName}\` (${columns.map((column) => `\`${column}\``).join(', ')}) VALUES (${placeholders})`;

  const [result] = await pool.query(sql, values);
  return { id: result.insertId, ...Object.fromEntries(columns.map((c, i) => [c, values[i]])) };
};

const updateRow = async (tableName, id, data) => {
  ensureTableAllowed(tableName);

  const columns = Object.keys(data).filter(isSafeIdentifier);

  if (!columns.length) {
    const error = new Error('No se enviaron columnas válidas para actualizar el registro.');
    error.statusCode = 400;
    throw error;
  }

  const setClause = columns.map((column) => `\`${column}\` = ?`).join(', ');
  const values = columns.map((column) => data[column]);

  const sql = `UPDATE \`${tableName}\` SET ${setClause} WHERE id = ?`;
  const [result] = await pool.query(sql, [...values, id]);

  return { affectedRows: result.affectedRows };
};

const deleteRow = async (tableName, id) => {
  ensureTableAllowed(tableName);

  const sql = `DELETE FROM \`${tableName}\` WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);

  return { affectedRows: result.affectedRows };
};

module.exports = {
  ensureTableAllowed,
  listRows,
  getById,
  createRow,
  updateRow,
  deleteRow
};
