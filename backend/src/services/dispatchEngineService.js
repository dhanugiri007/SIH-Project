const Task = require('../models/Task');
const Job = require('../models/Job');
const WorkerProfile = require('../models/WorkerProfile');
const { getEligibleWorkersForTask } = require('./eligibilityService');
const { computeFairnessScore, recordAssignment } = require('./opportunityLedgerService');
const { solveAssignment } = require('./dispatchSolverClient');
const { recalcJobStatus } = require('./jobStatusService');
const logger = require('../utils/logger');

const SKILL_MATCH_POINTS = 40;
const PROXIMITY_MAX_POINTS = 30;
const RATING_MAX_POINTS = 10;
// Fairness contributes up to 20 (see opportunityLedgerService)

function proximityScore(distanceKm) {
  if (distanceKm === null) return PROXIMITY_MAX_POINTS / 2; // unknown location -> neutral score
  return Math.max(0, Math.round(PROXIMITY_MAX_POINTS - distanceKm)); // linear falloff, 0 by ~30km
}

function ratingScore(ratingAvg) {
  return Math.round(Math.min(RATING_MAX_POINTS, (ratingAvg || 0) * 2)); // 0-5 rating -> 0-10 pts
}

// Builds the scored candidate list for ONE task
async function buildScoredCandidates(task, job) {
  const eligible = await getEligibleWorkersForTask(task, job.serviceLocation);

  const candidates = [];
  for (const { profile, distanceKm } of eligible) {
    const fairness = await computeFairnessScore(profile.user._id);
    const prox = proximityScore(distanceKm);
    const rating = ratingScore(profile.ratingAvg);
    const total = SKILL_MATCH_POINTS + prox + fairness + rating;

    candidates.push({
      workerId: String(profile.user._id),
      profile,
      distanceKm,
      breakdown: {
        skillMatchScore: SKILL_MATCH_POINTS,
        proximityKm: distanceKm !== null ? Math.round(distanceKm * 10) / 10 : null,
        proximityScore: prox,
        fairnessScore: fairness,
        ratingScore: rating,
        totalScore: total,
      },
    });
  }
  return candidates;
}

// Dispatches all pending tasks for a job (or a specific subset of taskIds, used by
// Flow 6's self-healing to reopen and re-dispatch just one failed task).
async function dispatchTasksForJob(jobId, { taskIds } = {}) {
  const job = await Job.findById(jobId);
  if (!job) throw new Error('Job not found for dispatch');

  const query = { job: jobId, status: 'pending' };
  if (taskIds && taskIds.length > 0) query._id = { $in: taskIds };

  const pendingTasks = await Task.find(query);
  if (pendingTasks.length === 0) {
    logger.info(`No pending tasks to dispatch for job ${jobId}`);
    return { dispatched: [], unfilled: [] };
  }

  const candidateMap = new Map();
  const solverTasks = [];

  for (const task of pendingTasks) {
    const candidates = await buildScoredCandidates(task, job);
    candidateMap.set(String(task._id), candidates);
    solverTasks.push({
      taskId: String(task._id),
      eligibleWorkers: candidates.map((c) => ({ workerId: c.workerId, score: c.breakdown.totalScore })),
    });
  }

  const workerIdsInvolved = new Set();
  candidateMap.forEach((candidates) => candidates.forEach((c) => workerIdsInvolved.add(c.workerId)));

  const workerCapacityPayload = [];
  for (const workerId of workerIdsInvolved) {
    const profile = await WorkerProfile.findOne({ user: workerId });
    const activeCount = await Task.countDocuments({
      assignedWorker: workerId,
      status: { $in: ['assigned', 'in_progress'] },
    });
    workerCapacityPayload.push({
      workerId,
      capacity: Math.max(0, profile.capacity - activeCount),
    });
  }

  const dispatched = [];
  const unfilled = [];

  if (solverTasks.some((t) => t.eligibleWorkers.length > 0)) {
    const assignments = await solveAssignment(solverTasks, workerCapacityPayload);

    for (const task of pendingTasks) {
      const winningWorkerId = assignments[String(task._id)];
      if (!winningWorkerId) {
        unfilled.push(task._id);
        task.dispatchExplanation = {
          skillMatchScore: 0,
          proximityKm: null,
          proximityScore: 0,
          fairnessScore: 0,
          ratingScore: 0,
          totalScore: 0,
          eligibleWorkerCount: candidateMap.get(String(task._id))?.length || 0,
          reason: 'No eligible worker available at dispatch time',
        };
        await task.save();
        continue;
      }

      const candidates = candidateMap.get(String(task._id));
      const winner = candidates.find((c) => c.workerId === winningWorkerId);

      task.assignedWorker = winningWorkerId;
      task.status = 'assigned';
      task.dispatchExplanation = {
        ...winner.breakdown,
        eligibleWorkerCount: candidates.length,
        reason: `Selected from ${candidates.length} eligible worker(s) based on skill match, proximity (${winner.breakdown.proximityKm ?? 'unknown'} km), fairness rotation, and rating.`,
      };
      await task.save();

      await recordAssignment({
        task: task._id,
        job: jobId,
        worker: winningWorkerId,
        scoreBreakdown: winner.breakdown,
        eligibleWorkerCount: candidates.length,
      });

      dispatched.push(task._id);
    }
  } else {
    for (const task of pendingTasks) {
      unfilled.push(task._id);
      task.dispatchExplanation = {
        skillMatchScore: 0,
        proximityKm: null,
        proximityScore: 0,
        fairnessScore: 0,
        ratingScore: 0,
        totalScore: 0,
        eligibleWorkerCount: 0,
        reason: 'No eligible worker found for required skills/availability',
      };
      await task.save();
    }
  }

  await recalcJobStatus(jobId);

  logger.info(`Dispatch complete for job ${jobId}: ${dispatched.length} assigned, ${unfilled.length} unfilled`);
  return { dispatched, unfilled };
}

module.exports = { dispatchTasksForJob };