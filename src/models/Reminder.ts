import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  user: string; // The phone number string, treating it as ID for now based on controller usage
  text: string;
  remindAt: Date;
  archived: boolean;
  media: {
    voiceUrl?: string;
    imageUrl?: string;
  };
  lang: 'en' | 'es' | 'hi';
  createdAt: Date;
}

const ReminderSchema: Schema = new Schema({
  user: { type: String, required: true }, // Changed to String as per controller usage (req.body.From)
  text: { type: String, required: true },
  remindAt: { type: Date, required: true },
  archived: { type: Boolean, default: false },
  media: {
    voiceUrl: String,
    imageUrl: String
  },
  lang: { type: String, enum: ['en', 'es', 'hi'], default: 'en' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReminder>('Reminder', ReminderSchema);
