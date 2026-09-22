const Task = require('../models/Task');
const { markMemberReplaced } = require('./workCellService');
const { dispatchTasksForJob } = require('./dispatchEngineService');
const { emitToWorkCell } = require('./socketService');
const logger = require('../utils/logger');

// Core self-healing routine: reopens ONE task (not the whole job), marks the
// old WorkCell membership as 'replaced' (history preserved), and re-runs the
// dispatch engine scoped to just that task, excluding the worker who failed.
async function reopenAndReassignTask(taskId, { failedWorkerId, reason }) {
  const task = await Task.findById(taskId);
  if (!task) throw new Error('Task not found');

  if (['completed', 'verified', 'cancelled'].includes(task.status)) {
    logger.warn(`Cannot reopen task ${taskId} — already in terminal status ${task.status}`);
    return null;
  }

  const jobId = task.job;
  const previousWorker = task.assignedWorker || failedWorkerId;

  await markMemberReplaced(jobId, taskId);

  task.status = 'pending';
  task.assignedWorker = null;
  task.dispatchExplanation = {
    skillMatchScore: 0, proximityKm: null, proximityScore: 0, fairnessScore: 0,
    ratingScore: 0, totalScore: 0, eligibleWorkerCount: 0,
    reason: `Reopened for reassignment: ${reason}`,
  };
  await task.save();

  emitToWorkCell(jobId, 'task:reopened', { taskId, reason });

  const excludeWorkerIds = previousWorker ? [String(previousWorker)] : [];
  const result = await dispatchTasksForJob(jobId, { taskIds: [taskId], excludeWorkerIds });

  logger.info(`Self-healing: task ${taskId} reopened (${reason}); reassigned=${result.dispatched.length > 0}`);
  return result;
}

module.exports = { reopenAndReassignTask };