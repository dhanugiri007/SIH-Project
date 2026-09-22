const asyncHandler = require('../utils/asyncHandler');
const jobService = require('../services/jobService');
const { getTimelineForJob } = require('../services/timelineService');

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

// @route GET /api/jobs/:id/timeline
const getTimeline = asyncHandler(async (req, res) => {
  await jobService.getJobById(req.params.id, req.user._id); // ownership check
  const timeline = await getTimelineForJob(req.params.id);
  res.status(200).json({ success: true, data: timeline });
});

module.exports = { createJob, listJobs, getJob, getTimeline };