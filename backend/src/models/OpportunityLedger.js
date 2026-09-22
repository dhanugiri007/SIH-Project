const mongoose = require('mongoose');

// One entry per dispatch decision — the audit trail that makes assignments explainable
// and lets the fairness score look back at how many opportunities a worker recently received.
const opportunityLedgerSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    outcome: { type: String, enum: ['assigned', 'reassigned'], default: 'assigned' },
    scoreBreakdown: {
      skillMatchScore: Number,
      proximityKm: Number,
      proximityScore: Number,
      fairnessScore: Number,
      ratingScore: Number,
      totalScore: Number,
    },
    eligibleWorkerCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

opportunityLedgerSchema.index({ worker: 1, createdAt: -1 });

module.exports = mongoose.model('OpportunityLedger', opportunityLedgerSchema);