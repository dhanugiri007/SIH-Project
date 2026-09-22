const ApiError = require('../utils/ApiError');


const roleGuard = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, `Access denied for role: ${req.user?.role || 'unknown'}`);
  }
  next();
};

module.exports = roleGuard;