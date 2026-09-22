const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const { assertValidTransition, assertRoleCanPerform } = require('../utils/taskStateMachine');
const { recalcJobStatus } = require('./jobStatusService');
const { notifyTaskUpdate } = require('./workCellService');
const { logEvent } = require('./timelineService');

async function getTasksByJob(jobId) {
  return Task.find({ job: jobId }).populate('dependsOn', 'title tempId status').populate('assignedWorker', 'name phone');
}

async function getTaskById(taskId) {
  const task = await Task.findById(taskId)
    .populate('dependsOn', 'title tempId status')
    .populate('assignedWorker', 'name phone')
    .populate('job');
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
}

async function getMyTasks(workerId) {
  return Task.find({ assignedWorker: workerId, status: { $ne: 'cancelled' } })
    .populate({ path: 'job', select: 'title serviceAddress customer', populate: { path: 'customer', select: 'name phone' } })
    .populate('dependsOn', 'title status')
    .sort({ createdAt: -1 });
}

async function assertDependenciesSatisfied(task) {
  if (!task.dependsOn || task.dependsOn.length === 0) return;
  const deps = await Task.find({ _id: { $in: task.dependsOn } }).select('title status');
  const unresolved = deps.filter((d) => !['completed', 'verified'].includes(d.status));
  if (unresolved.length > 0) {
    throw new ApiError(400, `Task is blocked by incomplete dependencies: ${unresolved.map((d) => d.title).join(', ')}`);
  }
}

function assertActorOwnsTask(task, actorUser) {
  if (actorUser.role === 'worker') {
    if (!task.assignedWorker || String(task.assignedWorker._id || task.assignedWorker) !== String(actorUser._id)) {
      throw new ApiError(403, 'You are not assigned to this task');
    }
  }
  if (actorUser.role === 'customer') {
    if (String(task.job.customer) !== String(actorUser._id)) {
      throw new ApiError(403, 'This task does not belong to your job');
    }
  }
}

async function updateTaskStatus(taskId, actorUser, nextStatus) {
  const task = await getTaskById(taskId);
  const fromStatus = task.status;

  assertRoleCanPerform(actorUser.role, nextStatus);
  assertActorOwnsTask(task, actorUser);
  assertValidTransition(fromStatus, nextStatus);

  if (nextStatus === 'in_progress' && fromStatus !== 'paused') {
    await assertDependenciesSatisfied(task);
  }

  task.status = nextStatus;
  if (nextStatus === 'cancelled') task.assignedWorker = null;
  await task.save();

  await recalcJobStatus(task.job._id);
  await notifyTaskUpdate(task.job._id, task._id, nextStatus);
  await logEvent({ jobId: task.job._id, taskId: task._id, actorId: actorUser._id, event: 'status_changed', fromStatus, toStatus: nextStatus });

  return getTaskById(task._id);
}

async function manualAssignWorker(taskId, workerUserId) {
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, 'Task not found');
  if (task.status !== 'pending') throw new ApiError(400, 'Only pending tasks can be assigned');

  task.assignedWorker = workerUserId;
  task.status = 'assigned';
  await task.save();

  await recalcJobStatus(task.job);

  return getTaskById(task._id);
}

module.exports = { getTasksByJob, getTaskById, getMyTasks, updateTaskStatus, manualAssignWorker };