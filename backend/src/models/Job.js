const mongoose = require('mongoose');

const JOB_STATUSES = ['processing', 'ready', 'failed', 'dispatched', 'in_progress', 'completed', 'cancelled'];

const jobSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rawRequestText: { type: String, required: true },
    inputMode: { type: String, enum: ['text', 'voice'], default: 'text' },
    title: { type: String, trim: true, default: 'Untitled Job' },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    status: { type: String, enum: JOB_STATUSES, default: 'processing' },
    failureReason: { type: String, default: null },
    serviceAddress: { type: String, trim: true, default: '' },
    serviceLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
  },
  { timestamps: true }
);

jobSchema.index({ serviceLocation: '2dsphere' });

module.exports = mongoose.model('Job', jobSchema);
module.exports.JOB_STATUSES = JOB_STATUSES;