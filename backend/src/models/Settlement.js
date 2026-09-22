const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    title: String,
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workerName: String,
    durationMinutes: Number,
    ratePerHour: Number,
    taskCost: Number,
    commissionAmount: Number,
    workerPayout: Number,
  },
  { _id: false }
);

const settlementSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lineItems: [lineItemSchema],
    subtotal: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['generated', 'paid'], default: 'generated' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settlement', settlementSchema);