const dotenv = require('dotenv');

dotenv.config();

const parseList = (value) =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

module.exports = {
  port: Number(process.env.PORT || 3000),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'zerbis'
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h'
  },
  tablesAllowed: parseList(process.env.TABLES_ALLOWED),
  userSchema: {
    table: process.env.USERS_TABLE || 'users',
    idColumn: process.env.USER_ID_COLUMN || 'id',
    userColumn: process.env.USER_NAME_COLUMN || 'user',
    passwordColumn: process.env.USER_PASSWORD_COLUMN || 'password',
    statusColumn: process.env.USER_STATUS_COLUMN || 'active',
    permissionsColumn: process.env.USER_PERMISSIONS_COLUMN || 'permissions'
  }
};
