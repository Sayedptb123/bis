import express from 'express';
import { handleIncoming, verifyWebhook } from '../controllers/reminderController';

const router = express.Router();

router.get('/', verifyWebhook);
router.post('/', handleIncoming);

export default router;
