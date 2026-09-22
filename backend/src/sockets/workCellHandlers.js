const WorkCell = require('../models/WorkCell');
const Task = require('../models/Task');
const presenceService = require('../services/presenceService');
const { reopenAndReassignTask } = require('../services/selfHealingService');
const { emitToWorkCell } = require('../services/socketService');
const logger = require('../utils/logger');

const DISCONNECT_GRACE_MS = 2 * 60 * 1000; // 2 min to reconnect (tab refresh, brief signal loss) before we treat it as a failure

function registerWorkCellHandlers(io, socket) {
  const joinedWorkCells = new Set();

  socket.on('workcell:join', async ({ workCellId }) => {
    if (!workCellId) return;
    socket.join(`workcell:${workCellId}`);
    joinedWorkCells.add(workCellId);
    await presenceService.markPresent(workCellId, socket.user.id);
    const presentUserIds = await presenceService.getPresentUserIds(workCellId);
    emitToWorkCell(workCellId, 'workcell:presence', { presentUserIds });
  });

  socket.on('workcell:leave', async ({ workCellId }) => {
    if (!workCellId) return;
    socket.leave(`workcell:${workCellId}`);
    joinedWorkCells.delete(workCellId);
    await presenceService.markAbsent(workCellId, socket.user.id);
    const presentUserIds = await presenceService.getPresentUserIds(workCellId);
    emitToWorkCell(workCellId, 'workcell:presence', { presentUserIds });
  });

  // Live worker location, forwarded to everyone in the WorkCell room (Flow 7)
  socket.on('location:update', ({ workCellId, lat, lng }) => {
    if (!workCellId || lat == null || lng == null) return;
    emitToWorkCell(workCellId, 'worker:location', { workerId: socket.user.id, lat, lng, at: Date.now() });
  });

  socket.on('disconnect', async () => {
    for (const workCellId of joinedWorkCells) {
      await presenceService.markAbsent(workCellId, socket.user.id);
      const presentUserIds = await presenceService.getPresentUserIds(workCellId);
      emitToWorkCell(workCellId, 'workcell:presence', { presentUserIds });

      if (socket.user.role === 'worker') {
        scheduleFailureCheck(workCellId, socket.user.id);
      }
    }
  });
}

function scheduleFailureCheck(workCellId, workerId) {
  setTimeout(async () => {
    try {
      const stillPresent = (await presenceService.getPresentUserIds(workCellId)).includes(workerId);
      if (stillPresent) return; // reconnected within grace period, nothing to do

      const workCell = await WorkCell.findById(workCellId);
      if (!workCell) return;

      const activeTasks = await Task.find({
        job: workCell.job,
        assignedWorker: workerId,
        status: { $in: ['assigned', 'in_progress'] },
      });

      for (const task of activeTasks) {
        await reopenAndReassignTask(task._id, {
          failedWorkerId: workerId,
          reason: 'Worker disconnected and did not reconnect',
        });
      }
    } catch (err) {
      logger.error(`Failure check error for workcell ${workCellId}: ${err.message}`);
    }
  }, DISCONNECT_GRACE_MS);
}

module.exports = registerWorkCellHandlers;