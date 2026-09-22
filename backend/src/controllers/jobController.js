const asyncHandler = require('../utils/asyncHandler');
const jobService = require('../services/jobService');

// @route POST /api/jobs
// body: { rawRequestText, inputMode, serviceAddress, serviceLocation: { coordinates: [lng, lat] } }
const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJobFromRequest(req.user._id, req.body);
  res.status(201).json({ success: true, data: job });
});

const listJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.listJobsForCustomer(req.user._id);
  res.status(200).json({ success: true, data: jobs });
});

const getJob = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id, req.user._id);
  res.status(200).json({ success: true, data: job });
});

module.exports = { createJob, listJobs, getJob };