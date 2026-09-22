const ApiError = require('./ApiError');

const TRANSITIONS = {
  pending: ['assigned', 'cancelled'],
  offered: ['assigned', 'pending', 'cancelled'],
  assigned: ['in_progress', 'cancelled'],
  in_progress: ['paused', 'completed', 'cancelled'],
  paused: ['in_progress', 'cancelled'],
  completed: ['verified'],
  verified: [],
  cancelled: [],
};

const ROLE_PERMISSIONS = {
  worker: ['in_progress', 'paused', 'completed'],
  customer: ['verified', 'cancelled'],
  cooperativeAdmin: ['assigned', 'in_progress', 'paused', 'completed', 'verified', 'cancelled', 'pending'],
};

function assertValidTransition(currentStatus, nextStatus) {
  const allowed = TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    throw new ApiError(400, `Cannot move task from '${currentStatus}' to '${nextStatus}'`);
  }
}

function assertRoleCanPerform(role, nextStatus) {
  const allowed = ROLE_PERMISSIONS[role] || [];
  if (!allowed.includes(nextStatus)) {
    throw new ApiError(403, `Role '${role}' is not allowed to set status '${nextStatus}'`);
  }
}

module.exports = { TRANSITIONS, assertValidTransition, assertRoleCanPerform };