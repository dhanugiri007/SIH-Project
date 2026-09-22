const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const taskService = require('../services/taskService');
const Job = require('../models/Job');

// @route GET /api/tasks/job/:jobId
const listTasksForJob = asyncHandler(async (req, res) => {
  // Ownership check kept lightweight here; customer can only view their own job's tasks
  if (req.user.role === 'customer') {
    const job = await Job.findOne({ _id: req.params.jobId, customer: req.user._id });
    if (!job) throw new ApiError(404, 'Job not found');
  }
  const tasks = await taskService.getTasksByJob(req.params.jobId);
  res.status(200).json({ success: true, data: tasks });
});

// @route GET /api/tasks/:id
const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  res.status(200).json({ success: true, data: task });
});

// @route PATCH /api/tasks/:id/status
// body: { status }
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new ApiError(400, 'status is required');

  const task = await taskService.updateTaskStatus(req.params.id, req.user, status);
  res.status(200).json({ success: true, data: task });
});

// @route PATCH /api/tasks/:id/assign  (cooperativeAdmin only, temporary pre-dispatch-engine)
// body: { workerUserId }
const manualAssign = asyncHandler(async (req, res) => {
  const { workerUserId } = req.body;
  if (!workerUserId) throw new ApiError(400, 'workerUserId is required');

  const task = await taskService.manualAssignWorker(req.params.id, workerUserId);
  res.status(200).json({ success: true, data: task });
});

module.exports = { listTasksForJob, getTask, updateStatus, manualAssign };