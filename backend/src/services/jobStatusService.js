const Job = require('../models/Job');
const Task = require('../models/Task');
const logger = require('../utils/logger');

async function recalcJobStatus(jobId) {
  const job = await Job.findById(jobId);
  if (!job) return;
  if (['processing', 'failed'].includes(job.status)) return;

  const tasks = await Task.find({ job: jobId }).select('status');
  if (tasks.length === 0) return;

  const statuses = tasks.map((t) => t.status);
  const allTerminalDone = statuses.every((s) => ['completed', 'verified'].includes(s));
  const allCancelled = statuses.every((s) => s === 'cancelled');
  const anyActive = statuses.some((s) => ['in_progress', 'paused'].includes(s));
  const anyAssignedOrOffered = statuses.some((s) => ['assigned', 'offered'].includes(s));

  let nextStatus = job.status;
  if (allCancelled) nextStatus = 'cancelled';
  else if (allTerminalDone) nextStatus = 'completed';
  else if (anyActive) nextStatus = 'in_progress';
  else if (anyAssignedOrOffered) nextStatus = 'dispatched';
  else nextStatus = 'ready';

  if (nextStatus !== job.status) {
    job.status = nextStatus;
    await job.save();
    logger.info(`Job ${jobId} status -> ${nextStatus}`);

    if (nextStatus === 'completed') {
      // Lazy require avoids a circular import between jobStatusService and settlementService
      const { generateSettlementForJob } = require('./settlementService');
      generateSettlementForJob(jobId).catch((err) => logger.error(`Settlement generation failed for job ${jobId}: ${err.message}`));
    }
  }
}

module.exports = { recalcJobStatus };