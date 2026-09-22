const express = require('express');
const { registerCooperative, listCooperatives } = require('../controllers/cooperativeController');

const router = express.Router();

router.post('/register', registerCooperative);
router.get('/', listCooperatives);

module.exports = router;