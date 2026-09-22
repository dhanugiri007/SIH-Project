const WorkCell = require('../models/WorkCell');
const Task = require('../models/Task');
const logger = require('../utils/logger');
const { emitToWorkCell } = require('./socketService');

// Called right after dispatch assigns workers to a job's tasks. Creates the WorkCell
// (temporary crew) on first assignment, or folds in any newly-assigned tasks later.
async function syncWorkCellForJob(jobId) {
  const assignedTasks = await Task.find({
    job: jobId,
    assignedWorker: { $ne: null },
    status: { $in: ['assigned', 'in_progress', 'completed', 'verified'] },
  }).select('_id assignedWorker status');

  if (assignedTasks.length === 0) return null;

  let workCell = await WorkCell.findOne({ job: jobId });
  if (!workCell) {
    workCell = new WorkCell({ job: jobId, members: [], status: 'forming' });
  }

  const existingTaskIds = new Set(workCell.members.map((m) => String(m.task)));

  for (const task of assignedTasks) {
    if (!existingTaskIds.has(String(task._id))) {
      workCell.members.push({ worker: task.assignedWorker, task: task._id, status: 'active' });
    }
  }

  workCell.status = 'active';
  await workCell.save();

  emitToWorkCell(workCell._id, 'workcell:updated', { workCellId: workCell._id, jobId });
  logger.info(`WorkCell synced for job ${jobId}: ${workCell.members.length} member(s)`);
  return workCell;
}

async function getWorkCellByJob(jobId) {
  return WorkCell.findOne({ job: jobId })
    .populate('members.worker', 'name phone')
    .populate('members.task', 'title type status estimatedDurationMinutes');
}

// Used by Flow 6 self-healing: when a task is reopened and reassigned to someone else,
// the old member is marked 'replaced' rather than deleted, preserving history.
async function markMemberReplaced(jobId, taskId) {
  const workCell = await WorkCell.findOne({ job: jobId });
  if (!workCell) return;
  const member = workCell.members.find((m) => String(m.task) === String(taskId) && m.status === 'active');
  if (member) {
    member.status = 'replaced';
    member.leftAt = new Date();
    await workCell.save();
  }
}

async function recalcWorkCellCompletion(jobId) {
  const workCell = await WorkCell.findOne({ job: jobId }).populate('members.task', 'status');
  if (!workCell) return;

  const allDone = workCell.members.every(
    (m) => ['completed', 'verified'].includes(m.task?.status) || m.status === 'replaced'
  );

  if (allDone && workCell.status !== 'completed') {
    workCell.status = 'completed';
    await workCell.save();
    emitToWorkCell(workCell._id, 'workcell:completed', { workCellId: workCell._id, jobId });
  }
}

// Broadcasts a task-level change to everyone in the job's WorkCell room and checks
// whether the crew's work is now fully done.
async function notifyTaskUpdate(jobId, taskId, status) {
  const workCell = await WorkCell.findOne({ job: jobId });
  if (!workCell) return;
  emitToWorkCell(workCell._id, 'task:updated', { taskId, status });
  await recalcWorkCellCompletion(jobId);
}

module.exports = {
  syncWorkCellForJob,
  getWorkCellByJob,
  markMemberReplaced,
  recalcWorkCellCompletion,
  notifyTaskUpdate,
};