const RateCard = require('../models/RateCard');
const WorkerProfile = require('../models/WorkerProfile');

const DEFAULT_RATE_PER_HOUR = 200; // fallback if cooperative hasn't set a rate card for this task type

async function getRateForTask(task, cooperativeId) {
  if (cooperativeId) {
    const rc = await RateCard.findOne({ cooperative: cooperativeId, taskType: task.type });
    if (rc) return rc.ratePerHour;
  }
  return DEFAULT_RATE_PER_HOUR;
}

async function computeTaskCost(task) {
  let cooperativeId = null;
  if (task.assignedWorker) {
    const profile = await WorkerProfile.findOne({ user: task.assignedWorker });
    cooperativeId = profile?.cooperative || null;
  }
  const ratePerHour = await getRateForTask(task, cooperativeId);
  const hours = (task.estimatedDurationMinutes || 60) / 60;
  const cost = Math.round(ratePerHour * hours);
  return { cost, ratePerHour, cooperativeId };
}

module.exports = { computeTaskCost, DEFAULT_RATE_PER_HOUR };