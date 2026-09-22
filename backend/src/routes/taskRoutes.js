const express = require('express');
const { listTasksForJob, getTask, updateStatus, manualAssign } = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');

const router = express.Router();

router.use(protect);

router.get('/job/:jobId', listTasksForJob);
router.get('/:id', getTask);
router.patch('/:id/status', updateStatus); // permission enforced inside service per-role
router.patch('/:id/assign', roleGuard('cooperativeAdmin'), manualAssign);

module.exports = router;