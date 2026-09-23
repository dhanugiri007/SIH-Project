const Settlement = require('../models/Settlement');
const Task = require('../models/Task');
const Job = require('../models/Job');
const Cooperative = require('../models/Cooperative');
const { computeTaskCost } = require('./pricingService');
const { createNotification } = require('./notificationService');
const logger = require('../utils/logger');

const DEFAULT_COMMISSION_RATE = 10;

async function generateSettlementForJob(jobId) {
  const existing = await Settlement.findOne({ job: jobId });
  if (existing) return existing;

  const job = await Job.findById(jobId);
  if (!job) throw new Error('Job not found');

  const tasks = await Task.find({ job: jobId, status: { $in: ['completed', 'verified'] } }).populate('assignedWorker', 'name');

  const lineItems = [];
  let subtotal = 0;
  let totalCommission = 0;

  for (const task of tasks) {
    const { cost, ratePerHour, cooperativeId } = await computeTaskCost(task);
    let commissionRate = DEFAULT_COMMISSION_RATE;
    if (cooperativeId) {
      const coop = await Cooperative.findById(cooperativeId);
      if (coop) commissionRate = coop.commissionRate;
    }
    const commissionAmount = Math.round((cost * commissionRate) / 100);
    const workerPayout = cost - commissionAmount;

    lineItems.push({
      task: task._id, title: task.title, worker: task.assignedWorker?._id,
      workerName: task.assignedWorker?.name || 'Unassigned',
      durationMinutes: task.estimatedDurationMinutes, ratePerHour,
      taskCost: cost, commissionAmount, workerPayout,
    });

    subtotal += cost;
    totalCommission += commissionAmount;
  }

  const settlement = await Settlement.create({
    job: jobId, customer: job.customer, lineItems, subtotal, totalCommission, totalAmount: subtotal, status: 'generated',
  });

  await createNotification(job.customer, 'settlement_ready', {
    title: 'Your bill is ready',
    message: `Itemised settlement for "${job.title}" is now available.`,
    job: jobId,
  });

  const payoutByWorker = {};
  for (const item of lineItems) {
    if (!item.worker) continue;
    payoutByWorker[item.worker] = (payoutByWorker[item.worker] || 0) + item.workerPayout;
  }
  for (const workerId of Object.keys(payoutByWorker)) {
    await createNotification(workerId, 'payout_ready', {
      title: 'Payout ready',
      message: `You earned ₹${payoutByWorker[workerId]} from "${job.title}".`,
      job: jobId,
    });
  }

  logger.info(`Settlement generated for job ${jobId}: total ₹${subtotal}`);
  return settlement;
}

async function getSettlementForJob(jobId) {
  return Settlement.findOne({ job: jobId });
}

async function getMyPayouts(workerId) {
  const settlements = await Settlement.find({ 'lineItems.worker': workerId }).populate('job', 'title');
  return settlements.map((s) => ({ job: s.job, items: s.lineItems.filter((li) => String(li.worker) === String(workerId)) }));
}

module.exports = { generateSettlementForJob, getSettlementForJob, getMyPayouts };