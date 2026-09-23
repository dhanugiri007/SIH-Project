const express = require('express');
const {
  listWorkers, getWorker, updateCapacity, toggleActive, verifyCertification, listJobs, getAnalytics,
} = require('../controllers/cooperativeAdminController');
const { protect } = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');

const router = express.Router();
router.use(protect, roleGuard('cooperativeAdmin'));

router.get('/workers', listWorkers);
router.get('/workers/:workerUserId', getWorker);
router.patch('/workers/:workerUserId/capacity', updateCapacity);
router.patch('/workers/:workerUserId/active', toggleActive);
router.patch('/workers/:workerUserId/verify-certification', verifyCertification);
router.get('/jobs', listJobs);
router.get('/analytics', getAnalytics);

module.exports = router;