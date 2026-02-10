const hasPermission = (permissions, requiredPermission) => {
  if (!Array.isArray(permissions)) {
    return false;
  }

  return (
    permissions.includes('*') ||
    permissions.includes(requiredPermission) ||
    permissions.includes(requiredPermission.replace(/:[^:]+$/, ':*'))
  );
};

const requirePermission = (operation) => (req, res, next) => {
  const table = req.params.table;
  const requiredPermission = `${table}:${operation}`;

  if (hasPermission(req.auth?.permissions, requiredPermission)) {
    return next();
  }

  return res.status(403).json({
    error: 'No tienes permisos para esta acción.',
    requiredPermission
  });
};

module.exports = {
  requirePermission
};
