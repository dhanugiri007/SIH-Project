const Task = require('../models/Task');
const { reopenAndReassignTask } = require('./selfHealingService');
const logger = require('../utils/logger');

const CHECK_INTERVAL_MS = 60 * 1000; // scan every 1 min
const MISSED_CHECKIN_MINUTES = 30; // worker must move to in_progress within 30 min of assignment

async function scanForMissedCheckins() {
  const cutoff = new Date(Date.now() - MISSED_CHECKIN_MINUTES * 60 * 1000);
  const staleTasks = await Task.find({ status: 'assigned', updatedAt: { $lte: cutoff } });

  for (const task of staleTasks) {
    try {
      await reopenAndReassignTask(task._id, {
        failedWorkerId: task.assignedWorker,
        reason: `Worker did not start within ${MISSED_CHECKIN_MINUTES} minutes`,
      });
    } catch (err) {
      logger.error(`Missed check-in handling failed for task ${task._id}: ${err.message}`);
    }
  }
}

function startFailureDetectionScheduler() {
  setInterval(() => {
    scanForMissedCheckins().catch((err) => logger.error(`Scheduler error: ${err.message}`));
  }, CHECK_INTERVAL_MS);
  logger.info('Failure detection scheduler started');
}

module.exports = { startFailureDetectionScheduler };