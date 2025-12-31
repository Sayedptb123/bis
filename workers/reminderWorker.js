const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { sendWhatsApp } = require('../utils/twilioClient');

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
});

const reminderWorker = new Worker('reminderVideo', async job => {
    const { user, text, buttons, mediaUrl } = job.data;
    console.log(`Processing reminder for ${user}: ${text}`);
    try {
        await sendWhatsApp(user, text, buttons, mediaUrl);
        console.log(`Reminder sent to ${user}`);
    } catch (err) {
        console.error(`Failed to send reminder to ${user}:`, err);
        throw err; // BullMQ will retry if configured
    }
}, { connection });

module.exports = reminderWorker;
