const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    issuingBody: { type: String },
    fileUrl: { type: String },
    verified: { type: Boolean, default: false },
    expiresAt: { type: Date },
  },
  { _id: false }
);

const workerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    cooperative: { type: mongoose.Schema.Types.ObjectId, ref: 'Cooperative', required: true },
    skills: [{ type: String, trim: true }], // e.g. ['electrical', 'plumbing']
    certifications: [certificationSchema],
    capacity: { type: Number, default: 1 }, // max concurrent tasks
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    availability: {
      isOnline: { type: Boolean, default: false },
      windows: [
        {
          day: { type: String, enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
          start: String, // "09:00"
          end: String, // "18:00"
        },
      ],
    },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

workerProfileSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);