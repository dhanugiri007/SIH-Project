const express = require('express');
const { runDispatch } = require('../controllers/dispatchController');
const { protect } = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');

const router = express.Router();

router.use(protect, roleGuard('cooperativeAdmin'));

router.post('/jobs/:jobId/run', runDispatch);

module.exports = router;