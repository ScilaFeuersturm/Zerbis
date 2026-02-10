const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { userSchema } = require('../config/env');

const isSafeIdentifier = (identifier) => /^[a-zA-Z0-9_]+$/.test(identifier);

for (const value of Object.values(userSchema)) {
  if (!isSafeIdentifier(value)) {
    throw new Error(`Identificador inseguro en userSchema: ${value}`);
  }
}

const parsePermissions = (permissionsValue) => {
  if (!permissionsValue) {
    return [];
  }

  if (Array.isArray(permissionsValue)) {
    return permissionsValue;
  }

  if (typeof permissionsValue === 'string') {
    try {
      const parsed = JSON.parse(permissionsValue);
      return Array.isArray(parsed) ? parsed : permissionsValue.split(',').map((p) => p.trim()).filter(Boolean);
    } catch (error) {
      return permissionsValue.split(',').map((p) => p.trim()).filter(Boolean);
    }
  }

  return [];
};

const validatePassword = async (plainPassword, storedPassword) => {
  if (!storedPassword) {
    return false;
  }

  const looksHashed = /^\$2[aby]\$.{56}$/.test(storedPassword);

  if (!looksHashed) {
    return plainPassword === storedPassword;
  }

  return bcrypt.compare(plainPassword, storedPassword);
};

const findByCredentials = async (user, password) => {
  const sql = `
    SELECT *
    FROM \`${userSchema.table}\`
    WHERE \`${userSchema.userColumn}\` = ?
    LIMIT 1
  `;

  const [rows] = await pool.query(sql, [user]);

  if (!rows.length) {
    return null;
  }

  const userRow = rows[0];
  const isPasswordValid = await validatePassword(password, userRow[userSchema.passwordColumn]);

  if (!isPasswordValid) {
    return null;
  }

  if (userSchema.statusColumn in userRow && !userRow[userSchema.statusColumn]) {
    return null;
  }

  return {
    id: userRow[userSchema.idColumn],
    user: userRow[userSchema.userColumn],
    permissions: parsePermissions(userRow[userSchema.permissionsColumn]),
    profile: Object.fromEntries(
      Object.entries(userRow).filter(([key]) => key !== userSchema.passwordColumn)
    )
  };
};

module.exports = {
  findByCredentials
};
