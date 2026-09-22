const express = require('express');
const authRoutes = require('./authRoutes');
const cooperativeRoutes = require('./cooperativeRoutes');
const workerRoutes = require('./workerRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cooperatives', cooperativeRoutes);
router.use('/workers', workerRoutes);

module.exports = router;