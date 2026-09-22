const express = require('express');
const { getJobSettlement, getMyPayouts } = require('../controllers/settlementController');
const { protect } = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');

const router = express.Router();
router.use(protect);

router.get('/job/:jobId', getJobSettlement);
router.get('/mine', roleGuard('worker'), getMyPayouts);

module.exports = router;