const TaskTimelineEntry = require('../models/TaskTimelineEntry');

async function logEvent({ jobId, taskId, actorId = null, event, fromStatus = null, toStatus = null, note = '' }) {
  return TaskTimelineEntry.create({ job: jobId, task: taskId, actor: actorId, event, fromStatus, toStatus, note });
}

async function getTimelineForJob(jobId) {
  return TaskTimelineEntry.find({ job: jobId })
    .populate('actor', 'name role')
    .populate('task', 'title')
    .sort({ createdAt: 1 });
}

module.exports = { logEvent, getTimelineForJob };