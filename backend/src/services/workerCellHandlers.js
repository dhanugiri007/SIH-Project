const presenceService = require('../services/presenceService');
const logger = require('../utils/logger');
const { emitToWorkCell } = require('../services/socketService');

// Registers WorkCell-specific socket events (join/leave a live crew room) on top of
// the already-authenticated socket from sockets/index.js.
function registerWorkCellHandlers(io, socket) {
  const joinedWorkCells = new Set();

  socket.on('workcell:join', async ({ workCellId }) => {
    if (!workCellId) return;
    socket.join(`workcell:${workCellId}`);
    joinedWorkCells.add(workCellId);

    await presenceService.markPresent(workCellId, socket.user.id);
    const presentUserIds = await presenceService.getPresentUserIds(workCellId);
    emitToWorkCell(workCellId, 'workcell:presence', { presentUserIds });

    logger.info(`User ${socket.user.id} joined workcell:${workCellId}`);
  });

  socket.on('workcell:leave', async ({ workCellId }) => {
    if (!workCellId) return;
    socket.leave(`workcell:${workCellId}`);
    joinedWorkCells.delete(workCellId);

    await presenceService.markAbsent(workCellId, socket.user.id);
    const presentUserIds = await presenceService.getPresentUserIds(workCellId);
    emitToWorkCell(workCellId, 'workcell:presence', { presentUserIds });
  });

  // Cleans up presence for every WorkCell this socket had joined, on disconnect
  // (tab close, network drop) — this is also what Flow 6 watches to detect worker failure.
  socket.on('disconnect', async () => {
    for (const workCellId of joinedWorkCells) {
      await presenceService.markAbsent(workCellId, socket.user.id);
      const presentUserIds = await presenceService.getPresentUserIds(workCellId);
      emitToWorkCell(workCellId, 'workcell:presence', { presentUserIds });
    }
  });
}

module.exports = registerWorkCellHandlers;