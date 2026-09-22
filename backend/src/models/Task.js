const mongoose = require('mongoose');

const TASK_TYPES = ['cleaning', 'electrical', 'plumbing', 'carpentry', 'painting', 'appliance_repair', 'general'];
const TASK_STATUSES = ['pending', 'offered', 'assigned', 'in_progress', 'completed', 'verified', 'cancelled'];

const taskSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    tempId: { type: String, required: true }, // LLM-assigned local id (e.g. "t1") kept for traceability
    type: { type: String, enum: TASK_TYPES, default: 'general' },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    requiredSkills: [{ type: String, trim: true }],
    estimatedDurationMinutes: { type: Number, default: 60 },
    dependsOn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    sequenceIndex: { type: Number, default: 0 },
    status: { type: String, enum: TASK_STATUSES, default: 'pending' },
    assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
module.exports.TASK_TYPES = TASK_TYPES;
module.exports.TASK_STATUSES = TASK_STATUSES;