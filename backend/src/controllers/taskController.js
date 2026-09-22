const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const taskService = require('../services/taskService');
const { reopenAndReassignTask } = require('../services/selfHealingService');
const Job = require('../models/Job');

const listTasksForJob = asyncHandler(async (req, res) => {
  if (req.user.role === 'customer') {
    const job = await Job.findOne({ _id: req.params.jobId, customer: req.user._id });
    if (!job) throw new ApiError(404, 'Job not found');
  }
  const tasks = await taskService.getTasksByJob(req.params.jobId);
  res.status(200).json({ success: true, data: tasks });
});

const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getMyTasks(req.user._id);
  res.status(200).json({ success: true, data: tasks });
});

const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  res.status(200).json({ success: true, data: task });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new ApiError(400, 'status is required');
  const task = await taskService.updateTaskStatus(req.params.id, req.user, status);
  res.status(200).json({ success: true, data: task });
});

const manualAssign = asyncHandler(async (req, res) => {
  const { workerUserId } = req.body;
  if (!workerUserId) throw new ApiError(400, 'workerUserId is required');
  const task = await taskService.manualAssignWorker(req.params.id, workerUserId);
  res.status(200).json({ success: true, data: task });
});

// @route POST /api/tasks/:id/report-failure  (worker self-reports they can't complete a task)
const reportFailure = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const task = await taskService.getTaskById(req.params.id);

  if (String(task.assignedWorker?._id) !== String(req.user._id)) {
    throw new ApiError(403, 'You are not assigned to this task');
  }

  const result = await reopenAndReassignTask(task._id, {
    failedWorkerId: req.user._id,
    reason: reason || 'Worker reported unable to complete',
  });
  res.status(200).json({ success: true, data: result });
});

module.exports = { listTasksForJob, getMyTasks, getTask, updateStatus, manualAssign, reportFailure };