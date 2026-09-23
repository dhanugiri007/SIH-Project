const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const cooperativeAdminService = require('../services/cooperativeAdminService');

function requireCooperative(req) {
  if (!req.user.cooperative) throw new ApiError(400, 'Your account is not linked to a cooperative');
  return req.user.cooperative;
}

const listWorkers = asyncHandler(async (req, res) => {
  const coopId = requireCooperative(req);
  const workers = await cooperativeAdminService.listWorkers(coopId);
  res.status(200).json({ success: true, data: workers });
});

const getWorker = asyncHandler(async (req, res) => {
  const coopId = requireCooperative(req);
  const worker = await cooperativeAdminService.getWorkerDetail(coopId, req.params.workerUserId);
  res.status(200).json({ success: true, data: worker });
});

const updateCapacity = asyncHandler(async (req, res) => {
  const coopId = requireCooperative(req);
  const { capacity } = req.body;
  if (typeof capacity !== 'number' || capacity < 0) throw new ApiError(400, 'Valid capacity is required');
  const worker = await cooperativeAdminService.updateWorkerCapacity(coopId, req.params.workerUserId, capacity);
  res.status(200).json({ success: true, data: worker });
});

const toggleActive = asyncHandler(async (req, res) => {
  const coopId = requireCooperative(req);
  const { isActive } = req.body;
  const worker = await cooperativeAdminService.toggleWorkerActive(coopId, req.params.workerUserId, Boolean(isActive));
  res.status(200).json({ success: true, data: worker });
});

const verifyCertification = asyncHandler(async (req, res) => {
  const coopId = requireCooperative(req);
  const { certIndex } = req.body;
  if (typeof certIndex !== 'number') throw new ApiError(400, 'certIndex is required');
  const worker = await cooperativeAdminService.verifyCertification(coopId, req.params.workerUserId, certIndex);
  res.status(200).json({ success: true, data: worker });
});

const listJobs = asyncHandler(async (req, res) => {
  const coopId = requireCooperative(req);
  const jobs = await cooperativeAdminService.listJobsForCooperative(coopId);
  res.status(200).json({ success: true, data: jobs });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const coopId = requireCooperative(req);
  const analytics = await cooperativeAdminService.getAnalytics(coopId);
  res.status(200).json({ success: true, data: analytics });
});

module.exports = { listWorkers, getWorker, updateCapacity, toggleActive, verifyCertification, listJobs, getAnalytics };