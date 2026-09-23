const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const WorkerProfile = require('../models/WorkerProfile');

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Worker profile not found');
  res.status(200).json({ success: true, data: profile });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const { skills, capacity, location, availability } = req.body;

  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Worker profile not found');

  if (skills) profile.skills = skills;
  if (capacity) profile.capacity = capacity;
  if (location?.coordinates) profile.location = { type: 'Point', coordinates: location.coordinates };
  if (availability) {
    profile.availability = {
      isOnline: availability.isOnline ?? profile.availability.isOnline,
      windows: availability.windows ?? profile.availability.windows,
    };
  }

  await profile.save();
  res.status(200).json({ success: true, data: profile });
});

const addCertification = asyncHandler(async (req, res) => {
  const { name, issuingBody, fileUrl, expiresAt } = req.body;
  if (!name) throw new ApiError(400, 'Certification name is required');

  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Worker profile not found');

  profile.certifications.push({ name, issuingBody, fileUrl, expiresAt, verified: false });
  await profile.save();

  res.status(201).json({ success: true, data: profile });
});

// @route PATCH /api/workers/me/location  — lightweight, frequent-call-friendly location ping
const pingLocation = asyncHandler(async (req, res) => {
  const { lat, lng } = req.body;
  if (lat == null || lng == null) throw new ApiError(400, 'lat and lng are required');

  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { location: { type: 'Point', coordinates: [lng, lat] } },
    { new: true }
  );
  if (!profile) throw new ApiError(404, 'Worker profile not found');

  res.status(200).json({ success: true, data: { coordinates: profile.location.coordinates } });
});

module.exports = { getMyProfile, updateMyProfile, addCertification, pingLocation };