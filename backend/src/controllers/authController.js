const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const Cooperative = require('../models/Cooperative');
const { generateToken, hashPassword } = require('../services/authService');

// @route POST /api/auth/register
// role: 'customer' | 'worker' | 'cooperativeAdmin'
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, cooperativeId, skills } = req.body;

  if (!name || !email || !phone || !password || !role) {
    throw new ApiError(400, 'name, email, phone, password and role are required');
  }

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const passwordHash = await hashPassword(password);

  let cooperativeRef = null;

  if (role === 'worker') {
    if (!cooperativeId) throw new ApiError(400, 'cooperativeId is required for worker signup');
    const coop = await Cooperative.findById(cooperativeId);
    if (!coop) throw new ApiError(404, 'Cooperative not found');
    cooperativeRef = coop._id;
  }

  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    role,
    cooperative: cooperativeRef,
  });

  if (role === 'worker') {
    await WorkerProfile.create({
      user: user._id,
      cooperative: cooperativeRef,
      skills: Array.isArray(skills) ? skills : [],
    });
  }

  const token = generateToken(user._id, user.role);

  res.status(201).json({ success: true, data: { user, token } });
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'email and password are required');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  if (!user.isActive) throw new ApiError(403, 'Account is deactivated');

  const token = generateToken(user._id, user.role);

  res.status(200).json({ success: true, data: { user, token } });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});

module.exports = { register, login, getMe };