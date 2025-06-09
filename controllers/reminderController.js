const Reminder = require('../models/Reminder');
const parseDate = require('../utils/parseDate');
const { sendWhatsApp } = require('../utils/twilioClient');
const { t } = require('i18next');

exports.handleIncoming = async (req, res, next) => {
  try {
    const from = req.body.From.replace('whatsapp:','');
    const lang = req.body.ProfileName==='Hindi'?'hi':req.body.ProfileName==='Spanish'?'es':'en';
    const text = req.body.Body;
    // parse commands e.g. "remind me tomorrow at 5pm to call mom"
    const remindAt = parseDate(text);
    const reminder = await Reminder.create({ user:req.body.From, text, remindAt, lang });
    res.send('<Response></Response>'); // TwiML ack
  } catch (err) {
    next(err);
  }
};

// Cron job will call this
exports.sendDue = async () => {
  const now = new Date();
  const due = await Reminder.find({ remindAt: { $lte: now }, archived:false });
  for (let r of due) {
    await sendWhatsApp(r.user, r.text, [
      { payload: `ARCHIVE_${r.id}`, title: t('Archive', { lng: r.lang }) },
      { payload: `RESTORE_${r.id}`, title: t('Restore', { lng: r.lang }) }
    ], [r.media.imageUrl, r.media.voiceUrl].filter(u=>u));
    r.archived = true;
    await r.save();
  }
};
