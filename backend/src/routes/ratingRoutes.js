const express = require('express');
const { submitRating, getForTask, getForWorker } = require('../controllers/ratingController');
const { protect } = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');

const router = express.Router();
router.use(protect);

router.post('/task/:taskId', roleGuard('customer'), submitRating);
router.get('/task/:taskId', getForTask);
router.get('/worker/:workerId', getForWorker);

module.exports = router;