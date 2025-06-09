const User = require('../models/User');
const Reminder = require('../models/Reminder');

exports.dashboard = async (req, res) => {
  const userCount = await User.count();
  const remCount = await Reminder.count();
  res.render('admin/dashboard', { userCount, remCount });
};
exports.listUsers = async (req, res) => {
  const users = await User.find();
  res.render('admin/users', { users });
};
exports.listReminders = async (req, res) => {
  const reminders = await Reminder.find().populate('user');
  res.render('admin/reminders', { reminders });
};
exports.archiveReminder = async (req, res) => {
  await Reminder.findByIdAndUpdate(req.params.id, { archived:true });
  res.redirect('/admin/reminders');
};
exports.restoreReminder = async (req, res) => {
  await Reminder.findByIdAndUpdate(req.params.id, { archived:false });
  res.redirect('/admin/reminders');
};
