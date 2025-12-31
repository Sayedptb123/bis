const cron = require('node-cron');
const { queueDue } = require('../controllers/reminderController');

module.exports = {
  start: () => {
    cron.schedule('* * * * *', queueDue, { timezone: 'Asia/Kolkata' });
    console.log('Scheduler started');
  }
};
