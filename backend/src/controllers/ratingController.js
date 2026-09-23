const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ratingService = require('../services/ratingService');

// @route POST /api/ratings/task/:taskId
const submitRating = asyncHandler(async (req, res) => {
  const { stars, comment } = req.body;
  if (stars === undefined) throw new ApiError(400, 'stars is required');
  const rating = await ratingService.submitRating({
    taskId: req.params.taskId, customerId: req.user._id, stars, comment,
  });
  res.status(201).json({ success: true, data: rating });
});

// @route GET /api/ratings/task/:taskId
const getForTask = asyncHandler(async (req, res) => {
  const rating = await ratingService.getRatingForTask(req.params.taskId);
  if (!rating) throw new ApiError(404, 'No rating yet for this task');
  res.status(200).json({ success: true, data: rating });
});

// @route GET /api/ratings/worker/:workerId
const getForWorker = asyncHandler(async (req, res) => {
  const ratings = await ratingService.getRatingsForWorker(req.params.workerId);
  res.status(200).json({ success: true, data: ratings });
});

module.exports = { submitRating, getForTask, getForWorker };