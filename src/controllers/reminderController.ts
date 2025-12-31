import { Request, Response, NextFunction } from 'express';
import Reminder, { IReminder } from '../models/Reminder';
import parseDate from '../utils/parseDate';
import { t } from 'i18next';
import reminderQueue from '../queues/reminderQueue';

export const verifyWebhook = (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
};

export const handleIncoming = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if this is a WhatsApp status update or message
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message) {
      const from = message.from; // e.g. "15550234002"
      const textBody = message.text?.body || message.interactive?.button_reply?.title; // Handle text or button reply

      // Simple profile name extraction if available
      const profileName = value.contacts?.[0]?.profile?.name;
      const lang = profileName === 'Hindi' ? 'hi' : profileName === 'Spanish' ? 'es' : 'en';

      // parse commands e.g. "remind me tomorrow at 5pm to call mom"
      if (textBody) {
        const remindAt = parseDate(textBody);
        await Reminder.create({ user: from, text: textBody, remindAt, lang });
      }
    }

    res.sendStatus(200); // Meta requires 200 OK immediately
  } catch (err) {
    console.error('Webhook Error:', err);
    res.sendStatus(200);
  }
};

// Cron job will call this
export const queueDue = async () => {
  const now = new Date();
  const due = await Reminder.find({ remindAt: { $lte: now }, archived: false });
  console.log(`Found ${due.length} due reminders`);

  for (let r of due) {
    // Prepare payload with pre-translated buttons to keep worker simple
    const buttons = [
      { payload: `ARCHIVE_${r.id}`, title: t('Archive', { lng: r.lang }) },
      { payload: `RESTORE_${r.id}`, title: t('Restore', { lng: r.lang }) }
    ];

    await reminderQueue.add('send-reminder', {
      user: r.user,
      text: r.text,
      buttons,
      mediaUrl: [r.media.imageUrl, r.media.voiceUrl].filter(u => u) // Typescript knows r is IReminder
    });

    r.archived = true;
    await r.save();
  }
};
