const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// Calls the local OR-Tools (CP-SAT) Python microservice to solve the
// max-score bipartite assignment problem under worker capacity constraints.
async function solveAssignment(tasksPayload, workersPayload) {
  let response;
  try {
    response = await fetch(`${env.dispatchSolverUrl}/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: tasksPayload, workers: workersPayload }),
    });
  } catch (err) {
    logger.error(`Dispatch solver unreachable: ${err.message}`);
    throw new ApiError(502, 'Dispatch solver service is unreachable. Is `python app.py` running?');
  }

  if (!response.ok) {
    const text = await response.text();
    logger.error(`Dispatch solver error [${response.status}]: ${text}`);
    throw new ApiError(502, 'Dispatch solver returned an error');
  }

  const data = await response.json();
  return data.assignments; // { taskId: workerId | null }
}

module.exports = { solveAssignment };