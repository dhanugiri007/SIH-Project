const ApiError = require('./ApiError');

// Allowed transitions per current status
const TRANSITIONS = {
  pending: ['assigned', 'cancelled'],
  offered: ['assigned', 'pending', 'cancelled'], // declined offer -> back to pending
  assigned: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: ['verified'],
  verified: [], // terminal
  cancelled: [], // terminal
};

// Who is allowed to perform which transition (role-level, refined further in service)
const ROLE_PERMISSIONS = {
  worker: ['in_progress', 'completed'],
  customer: ['verified', 'cancelled'],
  cooperativeAdmin: ['assigned', 'in_progress', 'completed', 'verified', 'cancelled', 'pending'],
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