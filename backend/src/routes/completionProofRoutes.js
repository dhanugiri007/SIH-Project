const express = require('express');
const { uploadProof, getProofForTask } = require('../controllers/completionProofController');
const { protect } = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const upload = require('../config/upload');

const router = express.Router();
router.use(protect);

router.post('/task/:taskId', roleGuard('worker'), upload.single('file'), uploadProof);
router.get('/task/:taskId', getProofForTask);

module.exports = router;