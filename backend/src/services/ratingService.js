const Rating = require('../models/Rating');
const WorkerProfile = require('../models/WorkerProfile');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const { createNotification } = require('./notificationService');

async function submitRating({ taskId, customerId, stars, comment }) {
  const task = await Task.findById(taskId).populate('job');
  if (!task) throw new ApiError(404, 'Task not found');
  if (String(task.job.customer) !== String(customerId)) throw new ApiError(403, 'Not authorized to rate this task');
  if (!['completed', 'verified'].includes(task.status)) throw new ApiError(400, 'Task must be completed before rating');
  if (!task.assignedWorker) throw new ApiError(400, 'This task has no assigned worker to rate');

  const existing = await Rating.findOne({ task: taskId });
  if (existing) throw new ApiError(409, 'This task has already been rated');

  if (stars < 1 || stars > 5) throw new ApiError(400, 'Stars must be between 1 and 5');

  const rating = await Rating.create({
    task: taskId, job: task.job._id, worker: task.assignedWorker, customer: customerId, stars, comment: comment || '',
  });

  // Recompute rolling average on the worker's profile
  const profile = await WorkerProfile.findOne({ user: task.assignedWorker });
  if (profile) {
    const newCount = profile.ratingCount + 1;
    const newAvg = (profile.ratingAvg * profile.ratingCount + stars) / newCount;
    profile.ratingAvg = Math.round(newAvg * 100) / 100;
    profile.ratingCount = newCount;
    await profile.save();
  }

  await createNotification(task.assignedWorker, 'rating_received', {
    title: 'New rating received',
    message: `You received a ${stars}-star rating for "${task.title}"`,
    job: task.job._id, task: task._id,
  });

  return rating;
}

async function getRatingForTask(taskId) {
  return Rating.findOne({ task: taskId });
}

async function getRatingsForWorker(workerId) {
  return Rating.find({ worker: workerId }).populate('customer', 'name').populate('task', 'title').sort({ createdAt: -1 });
}

module.exports = { submitRating, getRatingForTask, getRatingsForWorker };