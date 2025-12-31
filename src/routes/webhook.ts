import express from 'express';
import { handleIncoming } from '../controllers/reminderController';

const router = express.Router();

router.post('/', handleIncoming);

export default router;
