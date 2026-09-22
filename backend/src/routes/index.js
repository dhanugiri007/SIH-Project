const express = require('express');
const authRoutes = require('./authRoutes');
const cooperativeRoutes = require('./cooperativeRoutes');
const workerRoutes = require('./workerRoutes');
const jobRoutes = require('./jobRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cooperatives', cooperativeRoutes);
router.use('/workers', workerRoutes);
router.use('/jobs', jobRoutes);

module.exports = router;