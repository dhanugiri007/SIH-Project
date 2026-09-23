const express = require('express');
const { listMyNotifications, markRead, markAllRead } = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');

const router = express.Router();
router.use(protect);

router.get('/', listMyNotifications);
router.patch('/:id/read', markRead);
router.patch('/read-all', markAllRead);

module.exports = router;