const express = require('express');
const router = express.Router();
const AdminCtrl = require('../controllers/adminController');

router.get('/', AdminCtrl.dashboard);
router.get('/users', AdminCtrl.listUsers);
router.get('/reminders', AdminCtrl.listReminders);
router.post('/reminders/:id/archive', AdminCtrl.archiveReminder);
router.post('/reminders/:id/restore', AdminCtrl.restoreReminder);

module.exports = router;
