import cron from 'node-cron';
import { queueDue } from '../controllers/reminderController';

export default {
  start: () => {
    cron.schedule('* * * * *', queueDue, { timezone: 'Asia/Kolkata' });
    console.log('Scheduler started');
  }
};
