const mongoose = require('mongoose');

const WORKCELL_STATUSES = ['forming', 'active', 'completed', 'disbanded'];

const workCellMemberSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date, default: null },
    status: { type: String, enum: ['active', 'replaced', 'completed'], default: 'active' },
  },
  { _id: false }
);

const workCellSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, unique: true },
    members: [workCellMemberSchema],
    status: { type: String, enum: WORKCELL_STATUSES, default: 'forming' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkCell', workCellSchema);
module.exports.WORKCELL_STATUSES = WORKCELL_STATUSES;