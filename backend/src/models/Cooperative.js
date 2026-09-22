const mongoose = require('mongoose');

const cooperativeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address: { type: String },
    commissionRate: { type: Number, default: 10 }, // % cut for settlements (Flow 9)
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cooperative', cooperativeSchema);