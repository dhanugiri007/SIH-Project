const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Cooperative = require('../models/Cooperative');
const User = require('../models/User');
const { generateToken, hashPassword } = require('../services/authService');

// @route POST /api/cooperatives/register
// Creates a Cooperative + its first cooperativeAdmin user in one step
const registerCooperative = asyncHandler(async (req, res) => {
  const { coopName, registrationNumber, address, adminName, adminEmail, adminPhone, adminPassword } = req.body;

  if (!coopName || !registrationNumber || !adminName || !adminEmail || !adminPassword) {
    throw new ApiError(400, 'Missing required cooperative/admin fields');
  }

  const existingCoop = await Cooperative.findOne({ registrationNumber });
  if (existingCoop) throw new ApiError(409, 'Cooperative already registered');

  const existingUser = await User.findOne({ email: adminEmail });
  if (existingUser) throw new ApiError(409, 'Admin email already registered');

  const coop = await Cooperative.create({ name: coopName, registrationNumber, address });

  const passwordHash = await hashPassword(adminPassword);
  const admin = await User.create({
    name: adminName,
    email: adminEmail,
    phone: adminPhone,
    passwordHash,
    role: 'cooperativeAdmin',
    cooperative: coop._id,
  });

  coop.admin = admin._id;
  await coop.save();

  const token = generateToken(admin._id, admin.role);

  res.status(201).json({ success: true, data: { cooperative: coop, user: admin, token } });
});

// @route GET /api/cooperatives  (public list, so workers can pick one at signup)
const listCooperatives = asyncHandler(async (req, res) => {
  const coops = await Cooperative.find({ isActive: true }).select('name address registrationNumber');
  res.status(200).json({ success: true, data: coops });
});

module.exports = { registerCooperative, listCooperatives };