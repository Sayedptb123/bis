import express from 'express';
import * as AdminCtrl from '../controllers/adminController';

const router = express.Router();

router.get('/', AdminCtrl.dashboard);
router.get('/users', AdminCtrl.listUsers);
router.get('/reminders', AdminCtrl.listReminders);
router.post('/reminders/:id/archive', AdminCtrl.archiveReminder);
router.post('/reminders/:id/restore', AdminCtrl.restoreReminder);

export default router;
