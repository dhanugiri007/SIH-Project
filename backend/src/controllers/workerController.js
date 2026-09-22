const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const WorkerProfile = require('../models/WorkerProfile');

// @route GET /api/workers/me/profile
const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Worker profile not found');
  res.status(200).json({ success: true, data: profile });
});

// @route PATCH /api/workers/me/profile
const updateMyProfile = asyncHandler(async (req, res) => {
  const { skills, capacity, location, availability } = req.body;

  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Worker profile not found');

  if (skills) profile.skills = skills;
  if (capacity) profile.capacity = capacity;
  if (location?.coordinates) profile.location = { type: 'Point', coordinates: location.coordinates };
  if (availability) profile.availability = { ...profile.availability.toObject(), ...availability };

  await profile.save();

  res.status(200).json({ success: true, data: profile });
});

// @route POST /api/workers/me/certifications
const addCertification = asyncHandler(async (req, res) => {
  const { name, issuingBody, fileUrl, expiresAt } = req.body;
  if (!name) throw new ApiError(400, 'Certification name is required');

  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Worker profile not found');

  profile.certifications.push({ name, issuingBody, fileUrl, expiresAt, verified: false });
  await profile.save();

  res.status(201).json({ success: true, data: profile });
});

module.exports = { getMyProfile, updateMyProfile, addCertification };