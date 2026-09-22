const mongoose = require('mongoose');

const completionProofSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true, unique: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ['image', 'video'], default: 'image' },
    note: { type: String, default: '' },
    capturedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompletionProof', completionProofSchema);