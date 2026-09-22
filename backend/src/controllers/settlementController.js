const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const settlementService = require('../services/settlementService');
const Job = require('../models/Job');

// @route GET /api/settlements/job/:jobId
const getJobSettlement = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) throw new ApiError(404, 'Job not found');
  if (req.user.role === 'customer' && String(job.customer) !== String(req.user._id)) {
    throw new ApiError(403, 'Not authorized');
  }
  const settlement = await settlementService.getSettlementForJob(req.params.jobId);
  if (!settlement) throw new ApiError(404, 'Settlement not generated yet');
  res.status(200).json({ success: true, data: settlement });
});

// @route GET /api/settlements/mine  (worker payouts)
const getMyPayouts = asyncHandler(async (req, res) => {
  const payouts = await settlementService.getMyPayouts(req.user._id);
  res.status(200).json({ success: true, data: payouts });
});

module.exports = { getJobSettlement, getMyPayouts };