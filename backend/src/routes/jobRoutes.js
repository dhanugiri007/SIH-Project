const express = require('express');
const { createJob, listJobs, getJob, getTimeline } = require('../controllers/jobController');
const { protect } = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');

const router = express.Router();
router.use(protect, roleGuard('customer'));

router.post('/', createJob);
router.get('/', listJobs);
router.get('/:id', getJob);
router.get('/:id/timeline', getTimeline);

module.exports = router;