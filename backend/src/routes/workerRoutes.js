const express = require('express');
const { getMyProfile, updateMyProfile, addCertification, pingLocation } = require('../controllers/workerController');
const { protect } = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');

const router = express.Router();
router.use(protect, roleGuard('worker'));

router.get('/me/profile', getMyProfile);
router.patch('/me/profile', updateMyProfile);
router.post('/me/certifications', addCertification);
router.patch('/me/location', pingLocation);

module.exports = router;