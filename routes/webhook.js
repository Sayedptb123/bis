const express = require('express');
const router = express.Router();
const { handleIncoming } = require('../controllers/reminderController');

router.post('/', handleIncoming);

module.exports = router;
