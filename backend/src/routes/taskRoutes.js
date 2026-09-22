const express = require('express');
const { listTasksForJob, getMyTasks, getTask, updateStatus, manualAssign, reportFailure } = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');

const router = express.Router();
router.use(protect);

router.get('/mine', roleGuard('worker'), getMyTasks);
router.get('/job/:jobId', listTasksForJob);
router.get('/:id', getTask);
router.patch('/:id/status', updateStatus);
router.patch('/:id/assign', roleGuard('cooperativeAdmin'), manualAssign);
router.post('/:id/report-failure', roleGuard('worker'), reportFailure);

module.exports = router;