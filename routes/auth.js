const express = require('express');
const passport = require('passport');
const router = express.Router();
const AuthCtrl = require('../controllers/authController');

router.get('/login', AuthCtrl.loginPage);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/auth/login'
}));
router.get('/logout', AuthCtrl.logout);
router.get('/register', AuthCtrl.registerPage);
router.post('/register', AuthCtrl.register);

module.exports = router;
