const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('../config/env');
const userService = require('../services/user.service');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { user, password } = req.body;

    if (!user || !password) {
      return res.status(400).json({ error: 'Debes enviar user y password.' });
    }

    const userData = await userService.findByCredentials(user, password);

    if (!userData) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      {
        sub: userData.id,
        user: userData.user,
        permissions: userData.permissions
      },
      auth.jwtSecret,
      { expiresIn: auth.jwtExpiresIn }
    );

    return res.json({
      token,
      user: userData.profile,
      permissions: userData.permissions
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
