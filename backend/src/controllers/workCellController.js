const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const workCellService = require('../services/workCellService');
const Job = require('../models/Job');

// @route GET /api/workcells/job/:jobId
const getWorkCellForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');

  if (req.user.role === 'customer' && String(job.customer) !== String(req.user._id)) {
    throw new ApiError(403, 'Not authorized to view this workcell');
  }

  const workCell = await workCellService.getWorkCellByJob(jobId);
  if (!workCell) throw new ApiError(404, 'WorkCell not found for this job');

  if (req.user.role === 'worker') {
    const isMember = workCell.members.some((m) => String(m.worker._id) === String(req.user._id));
    if (!isMember) throw new ApiError(403, 'Not a member of this workcell');
  }

  res.status(200).json({ success: true, data: workCell });
});

module.exports = { getWorkCellForJob };