const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const CompletionProof = require('../models/CompletionProof.js');
const Task = require('../models/Task');
const { logEvent } = require('../services/timelineService');

// @route POST /api/completion-proofs/task/:taskId  (multipart, field name "file")
const uploadProof = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { note } = req.body;

  if (!req.file) throw new ApiError(400, 'A photo or video file is required');

  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, 'Task not found');
  if (String(task.assignedWorker) !== String(req.user._id)) {
    throw new ApiError(403, 'You are not assigned to this task');
  }
  if (task.status !== 'in_progress') {
    throw new ApiError(400, 'Proof can only be uploaded while the task is in progress');
  }

  const fileType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
  const fileUrl = `/uploads/${req.file.filename}`;

  const proof = await CompletionProof.findOneAndUpdate(
    { task: taskId },
    { task: taskId, job: task.job, uploadedBy: req.user._id, fileUrl, fileType, note: note || '', capturedAt: new Date() },
    { upsert: true, new: true }
  );

  await logEvent({ jobId: task.job, taskId, actorId: req.user._id, event: 'proof_uploaded', note: 'Completion proof captured' });

  res.status(201).json({ success: true, data: proof });
});

// @route GET /api/completion-proofs/task/:taskId
const getProofForTask = asyncHandler(async (req, res) => {
  const proof = await CompletionProof.findOne({ task: req.params.taskId });
  if (!proof) throw new ApiError(404, 'No proof uploaded for this task yet');
  res.status(200).json({ success: true, data: proof });
});

module.exports = { uploadProof, getProofForTask };