const express = require('express');
const authRoutes = require('./routes/auth.routes');
const tableRoutes = require('./routes/tables.routes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRoutes);
app.use('/tables', tableRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor.';

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ error: message });
});

module.exports = app;
