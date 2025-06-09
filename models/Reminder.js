const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  remindAt: { type: Date, required: true },
  archived: { type: Boolean, default: false },
  media: {
    voiceUrl: String,
    imageUrl: String
  },
  lang: { type: String, enum: ['en','es','hi'], default: 'en' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
