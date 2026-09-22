const express = require('express');
const authRoutes = require('./authRoutes');
const cooperativeRoutes = require('./cooperativeRoutes');
const workerRoutes = require('./workerRoutes');
const jobRoutes = require('./jobRoutes');
const taskRoutes = require('./taskRoutes');
const dispatchRoutes = require('./dispatchRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cooperatives', cooperativeRoutes);
router.use('/workers', workerRoutes);
router.use('/jobs', jobRoutes);
router.use('/tasks', taskRoutes);
router.use('/dispatch', dispatchRoutes);

module.exports = router;