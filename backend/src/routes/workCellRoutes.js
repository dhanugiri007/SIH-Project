const express = require('express');
const { getWorkCellForJob } = require('../controllers/workCellController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.get('/job/:jobId', getWorkCellForJob);

module.exports = router;