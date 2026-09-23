const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notificationService');

const listMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.listForUser(req.user._id);
  res.status(200).json({ success: true, data: notifications });
});

const markRead = asyncHandler(async (req, res) => {
  const notif = await notificationService.markAsRead(req.user._id, req.params.id);
  res.status(200).json({ success: true, data: notif });
});

const markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  res.status(200).json({ success: true });
});

module.exports = { listMyNotifications, markRead, markAllRead };