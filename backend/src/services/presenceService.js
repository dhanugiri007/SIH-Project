const redisClient = require('../config/redis');

const presenceKey = (workCellId) => `workcell:${workCellId}:presence`;

// Redis hash: { userId: lastSeenTimestamp } per WorkCell. TTL is a safety net so
// presence never lingers forever if a disconnect event is ever missed.
async function markPresent(workCellId, userId) {
  await redisClient.hset(presenceKey(workCellId), userId, Date.now());
  await redisClient.expire(presenceKey(workCellId), 60 * 60 * 6);
}

async function markAbsent(workCellId, userId) {
  await redisClient.hdel(presenceKey(workCellId), userId);
}

async function getPresentUserIds(workCellId) {
  const presence = await redisClient.hgetall(presenceKey(workCellId));
  return Object.keys(presence || {});
}

module.exports = { markPresent, markAbsent, getPresentUserIds };