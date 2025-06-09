const User = require('../models/User');

exports.loginPage = (req, res) => res.render('auth/login');
exports.registerPage = (req, res) => res.render('auth/register');

exports.register = async (req, res, next) => {
  try {
    await User.create(req.body);
    res.redirect('/auth/login');
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/auth/login');
};
