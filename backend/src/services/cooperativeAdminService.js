const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');
const Job = require('../models/Job');
const Task = require('../models/Task');
const OpportunityLedger = require('../models/OpportunityLedger');
const Settlement = require('../models/Settlement');
const ApiError = require('../utils/ApiError');

async function listWorkers(cooperativeId) {
  return WorkerProfile.find({ cooperative: cooperativeId })
    .populate('user', 'name email phone isActive createdAt')
    .sort({ createdAt: -1 });
}

async function getWorkerDetail(cooperativeId, workerUserId) {
  const profile = await WorkerProfile.findOne({ cooperative: cooperativeId, user: workerUserId }).populate(
    'user',
    'name email phone isActive createdAt'
  );
  if (!profile) throw new ApiError(404, 'Worker not found in this cooperative');
  return profile;
}

async function updateWorkerCapacity(cooperativeId, workerUserId, capacity) {
  const profile = await WorkerProfile.findOne({ cooperative: cooperativeId, user: workerUserId });
  if (!profile) throw new ApiError(404, 'Worker not found in this cooperative');
  profile.capacity = capacity;
  await profile.save();
  return profile;
}

async function toggleWorkerActive(cooperativeId, workerUserId, isActive) {
  const profile = await WorkerProfile.findOne({ cooperative: cooperativeId, user: workerUserId });
  if (!profile) throw new ApiError(404, 'Worker not found in this cooperative');
  await User.findByIdAndUpdate(workerUserId, { isActive });
  return profile;
}

async function verifyCertification(cooperativeId, workerUserId, certIndex) {
  const profile = await WorkerProfile.findOne({ cooperative: cooperativeId, user: workerUserId });
  if (!profile) throw new ApiError(404, 'Worker not found in this cooperative');
  if (!profile.certifications[certIndex]) throw new ApiError(404, 'Certification not found');
  profile.certifications[certIndex].verified = true;
  await profile.save();
  return profile;
}

// Jobs whose tasks touch at least one worker in this cooperative
async function listJobsForCooperative(cooperativeId) {
  const workerUserIds = (await WorkerProfile.find({ cooperative: cooperativeId }).select('user')).map((w) => w.user);
  const taskJobIds = await Task.find({ assignedWorker: { $in: workerUserIds } }).distinct('job');
  return Job.find({ _id: { $in: taskJobIds } })
    .populate('customer', 'name phone')
    .sort({ createdAt: -1 });
}

async function getAnalytics(cooperativeId) {
  const workerUserIds = (await WorkerProfile.find({ cooperative: cooperativeId }).select('user')).map((w) => w.user);

  const totalTasks = await Task.countDocuments({ assignedWorker: { $in: workerUserIds } });
  const unfilledTasksRecent = await Task.countDocuments({
    dispatchExplanation: { $exists: true },
    'dispatchExplanation.totalScore': 0,
    status: 'pending',
  });
  const completedTasks = await Task.countDocuments({
    assignedWorker: { $in: workerUserIds },
    status: { $in: ['completed', 'verified'] },
  });

  const fillRate = totalTasks > 0 ? Math.round(((totalTasks - unfilledTasksRecent) / totalTasks) * 100) : 0;

  // Average time between task creation and assignment (proxy for dispatch speed)
  const assignedLedgerEntries = await OpportunityLedger.find({ worker: { $in: workerUserIds } })
    .populate('task', 'createdAt')
    .limit(200)
    .sort({ createdAt: -1 });

  let avgDispatchMinutes = 0;
  if (assignedLedgerEntries.length > 0) {
    const diffs = assignedLedgerEntries
      .filter((e) => e.task)
      .map((e) => (new Date(e.createdAt) - new Date(e.task.createdAt)) / 60000);
    avgDispatchMinutes = diffs.length > 0 ? Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length) : 0;
  }

  const settlements = await Settlement.find({ 'lineItems.worker': { $in: workerUserIds } });
  let totalEarningsDistributed = 0;
  let totalCommissionEarned = 0;
  for (const s of settlements) {
    for (const item of s.lineItems) {
      if (workerUserIds.some((id) => String(id) === String(item.worker))) {
        totalEarningsDistributed += item.workerPayout;
        totalCommissionEarned += item.commissionAmount;
      }
    }
  }

  const workerCount = workerUserIds.length;
  const onlineWorkerCount = await WorkerProfile.countDocuments({
    cooperative: cooperativeId,
    'availability.isOnline': true,
  });

  return {
    workerCount,
    onlineWorkerCount,
    totalTasks,
    completedTasks,
    fillRate,
    avgDispatchMinutes,
    totalEarningsDistributed,
    totalCommissionEarned,
  };
}

module.exports = {
  listWorkers,
  getWorkerDetail,
  updateWorkerCapacity,
  toggleWorkerActive,
  verifyCertification,
  listJobsForCooperative,
  getAnalytics,
};