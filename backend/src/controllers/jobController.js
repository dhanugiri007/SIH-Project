const asyncHandler = require('../utils/asyncHandler');
const jobService = require('../services/jobService');

// @route POST /api/jobs
// body: { rawRequestText, inputMode: 'text' | 'voice' }
const createJob = asyncHandler(async (req, res) => {
  const { rawRequestText, inputMode } = req.body;
  const job = await jobService.createJobFromRequest(req.user._id, rawRequestText, inputMode);
  res.status(201).json({ success: true, data: job });
});

// @route GET /api/jobs
const listJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.listJobsForCustomer(req.user._id);
  res.status(200).json({ success: true, data: jobs });
});

// @route GET /api/jobs/:id
const getJob = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id, req.user._id);
  res.status(200).json({ success: true, data: job });
});

module.exports = { createJob, listJobs, getJob };