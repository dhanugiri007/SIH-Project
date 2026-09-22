// Holds a single reference to the io server so any service (task updates, dispatch,
// self-healing) can emit real-time events without importing app.js or creating cycles.
let ioInstance = null;

function setIO(io) {
  ioInstance = io;
}

function emitToWorkCell(workCellId, event, payload) {
  if (!ioInstance) return;
  ioInstance.to(`workcell:${workCellId}`).emit(event, payload);
}

function emitToUser(userId, event, payload) {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit(event, payload);
}

module.exports = { setIO, emitToWorkCell, emitToUser };