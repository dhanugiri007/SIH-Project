const Notification = require('../models/Notification');
const { emitToUser } = require('./socketService');

async function createNotification(recipientId, type, { title, message, job = null, task = null }) {
  const notif = await Notification.create({ recipient: recipientId, type, title, message, job, task });
  emitToUser(recipientId, 'notification:new', notif);
  return notif;
}

async function listForUser(userId) {
  return Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(50);
}

async function markAsRead(userId, notificationId) {
  return Notification.findOneAndUpdate({ _id: notificationId, recipient: userId }, { read: true }, { new: true });
}

async function markAllAsRead(userId) {
  await Notification.updateMany({ recipient: userId, read: false }, { read: true });
}

module.exports = { createNotification, listForUser, markAsRead, markAllAsRead };