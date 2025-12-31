import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { sendWhatsApp } from '../utils/metaClient';
import Reminder from '../models/Reminder'; // Need to fetch fresh data
import { RRule } from 'rrule';

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    maxRetriesPerRequest: null,
});

const reminderWorker = new Worker('reminderVideo', async (job: Job) => {
    const { id, user, text, buttons, mediaUrl } = job.data;

    console.log(`Processing reminder for ${user}: ${text}`);
    try {
        await sendWhatsApp(user, text, buttons, mediaUrl);
        console.log(`Reminder sent to ${user}`);

        // Handle Recurrence
        if (id) {
            const reminder = await Reminder.findById(id);
            if (reminder && reminder.recurrenceRule) {
                try {
                    const rule = RRule.fromString(reminder.recurrenceRule);
                    const nextDate = rule.after(new Date());

                    if (nextDate) {
                        reminder.remindAt = nextDate;
                        reminder.archived = false; // Reactivate it
                        await reminder.save();
                        console.log(`Rescheduled recurrence for ${user} to ${nextDate}`);
                    }
                } catch (rErr) {
                    console.error('Error parsing recurrence rule:', rErr);
                }
            }
        }
    } catch (err) {
        console.error(`Failed to send reminder to ${user}:`, err);
        throw err; // BullMQ will retry if configured
    }
}, { connection });

export default reminderWorker;
