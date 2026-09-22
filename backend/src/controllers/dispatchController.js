const asyncHandler = require('../utils/asyncHandler');
const { dispatchTasksForJob } = require('../services/dispatchEngineService');

// @route POST /api/dispatch/jobs/:jobId/run  (cooperativeAdmin — manual re-run/retry)
const runDispatch = asyncHandler(async (req, res) => {
  const result = await dispatchTasksForJob(req.params.jobId);
  res.status(200).json({ success: true, data: result });
});

module.exports = { runDispatch };