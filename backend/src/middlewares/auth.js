const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch (err) {
    throw new ApiError(401, 'Not authorized, invalid or expired token');
  }

  const user = await User.findById(decoded.id).select('-passwordHash');
  if (!user) throw new ApiError(401, 'User no longer exists');
  if (!user.isActive) throw new ApiError(403, 'Account is deactivated');

  req.user = user;
  next();
});

module.exports = { protect };