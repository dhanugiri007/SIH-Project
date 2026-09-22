const mongoose = require('mongoose');

const rateCardSchema = new mongoose.Schema(
  {
    cooperative: { type: mongoose.Schema.Types.ObjectId, ref: 'Cooperative', required: true },
    taskType: { type: String, required: true },
    ratePerHour: { type: Number, required: true },
  },
  { timestamps: true }
);

rateCardSchema.index({ cooperative: 1, taskType: 1 }, { unique: true });

module.exports = mongoose.model('RateCard', rateCardSchema);