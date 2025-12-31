import { Request, Response } from 'express';
import User from '../models/User';
import Reminder from '../models/Reminder';

export const dashboard = async (req: Request, res: Response) => {
  const userCount = await User.countDocuments();
  const remCount = await Reminder.countDocuments();
  res.render('admin/dashboard', { userCount, remCount });
};
export const listUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.render('admin/users', { users });
};
export const listReminders = async (req: Request, res: Response) => {
  const reminders = await Reminder.find().populate('user');
  res.render('admin/reminders', { reminders });
};
export const archiveReminder = async (req: Request, res: Response) => {
  await Reminder.findByIdAndUpdate(req.params.id, { archived: true });
  res.redirect('/admin/reminders');
};
export const restoreReminder = async (req: Request, res: Response) => {
  await Reminder.findByIdAndUpdate(req.params.id, { archived: false });
  res.redirect('/admin/reminders');
};
