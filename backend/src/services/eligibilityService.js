const WorkerProfile = require('../models/WorkerProfile');
const Task = require('../models/Task');

const MAX_DISTANCE_KM = 50;

function haversineKm([lng1, lat1], [lng2, lat2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// excludeWorkerIds lets self-healing re-dispatch a task without re-offering it
// to the same worker who just failed/dropped it.
async function getEligibleWorkersForTask(task, jobServiceLocation, excludeWorkerIds = []) {
  const candidates = await WorkerProfile.find({
    'availability.isOnline': true,
    user: { $nin: excludeWorkerIds },
    ...(task.requiredSkills.length > 0 ? { skills: { $all: task.requiredSkills } } : {}),
  }).populate('user', 'name isActive');

  const eligible = [];

  for (const profile of candidates) {
    if (!profile.user || !profile.user.isActive) continue;

    const activeTaskCount = await Task.countDocuments({
      assignedWorker: profile.user._id,
      status: { $in: ['assigned', 'in_progress'] },
    });
    const remainingCapacity = profile.capacity - activeTaskCount;
    if (remainingCapacity <= 0) continue;

    let distanceKm = null;
    if (jobServiceLocation && profile.location?.coordinates) {
      const [lng, lat] = profile.location.coordinates;
      if (lng !== 0 || lat !== 0) {
        distanceKm = haversineKm(jobServiceLocation.coordinates, profile.location.coordinates);
        if (distanceKm > MAX_DISTANCE_KM) continue;
      }
    }

    eligible.push({ profile, remainingCapacity, distanceKm });
  }

  return eligible;
}

module.exports = { getEligibleWorkersForTask, haversineKm };