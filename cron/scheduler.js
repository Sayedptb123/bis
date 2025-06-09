const cron = require('node-cron');
const { sendDue } = require('../controllers/reminderController');

module.exports = {
  start: () => {
    cron.schedule('* * * * *', sendDue, { timezone: 'Asia/Kolkata' });
    console.log('Scheduler started');
  }
};
