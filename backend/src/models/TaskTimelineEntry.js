const mongoose = require('mongoose');

const taskTimelineEntrySchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null = system-generated
    event: { type: String, required: true }, // status_changed, reopened, proof_uploaded...
    fromStatus: { type: String, default: null },
    toStatus: { type: String, default: null },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

taskTimelineEntrySchema.index({ job: 1, createdAt: 1 });

module.exports = mongoose.model('TaskTimelineEntry', taskTimelineEntrySchema);