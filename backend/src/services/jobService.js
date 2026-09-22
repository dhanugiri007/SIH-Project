const Job = require('../models/Job');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const { generateJobGraph } = require('./jobGraphService');
const { dispatchTasksForJob } = require('./dispatchEngineService');

async function createJobFromRequest(customerId, { rawRequestText, inputMode = 'text', serviceAddress, serviceLocation }) {
  if (!rawRequestText || !rawRequestText.trim()) {
    throw new ApiError(400, 'rawRequestText is required');
  }

  const job = await Job.create({
    customer: customerId,
    rawRequestText,
    inputMode,
    status: 'processing',
    serviceAddress: serviceAddress || '',
    serviceLocation: serviceLocation?.coordinates
      ? { type: 'Point', coordinates: serviceLocation.coordinates }
      : undefined,
  });

  let graph;
  try {
    graph = await generateJobGraph(rawRequestText);
  } catch (err) {
    job.status = 'failed';
    job.failureReason = err.message;
    await job.save();
    throw err;
  }

  const tempIdToRealId = new Map();
  const createdTasks = [];

  for (let i = 0; i < graph.tasks.length; i++) {
    const t = graph.tasks[i];
    const task = await Task.create({
      job: job._id,
      tempId: t.tempId,
      type: t.type,
      title: t.title,
      description: t.description || '',
      requiredSkills: t.requiredSkills,
      estimatedDurationMinutes: t.estimatedDurationMinutes || 60,
      sequenceIndex: i,
      dependsOn: [],
    });
    tempIdToRealId.set(t.tempId, task._id);
    createdTasks.push({ doc: task, dependsOnTemp: t.dependsOn });
  }

  for (const { doc, dependsOnTemp } of createdTasks) {
    const resolvedDeps = dependsOnTemp.map((tempId) => tempIdToRealId.get(tempId)).filter(Boolean);
    doc.dependsOn = resolvedDeps;
    await doc.save();
  }

  job.title = graph.jobTitle || 'Untitled Job';
  job.tasks = createdTasks.map((t) => t.doc._id);
  job.status = 'ready';
  await job.save();

  logger.info(`Job graph created: ${job._id} with ${createdTasks.length} tasks`);

  try {
    await dispatchTasksForJob(job._id);
  } catch (err) {
    logger.error(`Auto-dispatch failed for job ${job._id}: ${err.message}`);
  }

  return Job.findById(job._id).populate({
    path: 'tasks',
    populate: [
      { path: 'dependsOn', select: 'title tempId status' },
      { path: 'assignedWorker', select: 'name phone' },
    ],
  });
}

async function getJobById(jobId, customerId) {
  const job = await Job.findOne({ _id: jobId, customer: customerId }).populate({
    path: 'tasks',
    populate: [
      { path: 'dependsOn', select: 'title tempId status' },
      { path: 'assignedWorker', select: 'name phone' },
    ],
  });
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
}

async function listJobsForCustomer(customerId) {
  return Job.find({ customer: customerId }).sort({ createdAt: -1 }).select('-rawRequestText');
}

module.exports = { createJobFromRequest, getJobById, listJobsForCustomer };