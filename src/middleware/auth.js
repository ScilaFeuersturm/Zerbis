const jwt = require('jsonwebtoken');
const { auth } = require('../config/env');

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token no enviado.' });
  }

  try {
    req.auth = jwt.verify(token, auth.jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o vencido.' });
  }
};

module.exports = authMiddleware;
