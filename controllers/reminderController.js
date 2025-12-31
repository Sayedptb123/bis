const Reminder = require('../models/Reminder');
const parseDate = require('../utils/parseDate');
// sendWhatsApp moved to worker
const { t } = require('i18next');

exports.handleIncoming = async (req, res, next) => {
  try {
    const from = req.body.From.replace('whatsapp:', '');
    const lang = req.body.ProfileName === 'Hindi' ? 'hi' : req.body.ProfileName === 'Spanish' ? 'es' : 'en';
    const text = req.body.Body;
    // parse commands e.g. "remind me tomorrow at 5pm to call mom"
    const remindAt = parseDate(text);
    const reminder = await Reminder.create({ user: req.body.From, text, remindAt, lang });
    res.send('<Response></Response>'); // TwiML ack
  } catch (err) {
    next(err);
  }
};

// Cron job will call this
exports.queueDue = async () => {
  const now = new Date();
  const due = await Reminder.find({ remindAt: { $lte: now }, archived: false });
  console.log(`Found ${due.length} due reminders`);

  const reminderQueue = require('../queues/reminderQueue');

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
      mediaUrl: [r.media.imageUrl, r.media.voiceUrl].filter(u => u)
    });

    r.archived = true;
    await r.save();
  }
};
