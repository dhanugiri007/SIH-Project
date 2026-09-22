const OpportunityLedger = require('../models/OpportunityLedger');

// Fairness lookback window — workers who received many offers recently get de-prioritized
const FAIRNESS_LOOKBACK_DAYS = 30;
const MAX_FAIRNESS_SCORE = 20;

async function getRecentAssignmentCount(workerId) {
  const since = new Date(Date.now() - FAIRNESS_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
  return OpportunityLedger.countDocuments({ worker: workerId, createdAt: { $gte: since } });
}

async function computeFairnessScore(workerId) {
  const recentCount = await getRecentAssignmentCount(workerId);
  return Math.max(0, MAX_FAIRNESS_SCORE - recentCount * 2);
}

async function recordAssignment({ task, job, worker, scoreBreakdown, eligibleWorkerCount }) {
  return OpportunityLedger.create({
    task,
    job,
    worker,
    outcome: 'assigned',
    scoreBreakdown,
    eligibleWorkerCount,
  });
}

module.exports = { computeFairnessScore, recordAssignment, getRecentAssignmentCount };