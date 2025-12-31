import express from 'express';
import passport from 'passport';
import * as AuthCtrl from '../controllers/authController';

const router = express.Router();

router.get('/login', AuthCtrl.loginPage);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/auth/login'
}));
router.get('/logout', AuthCtrl.logout);
router.get('/register', AuthCtrl.registerPage);
router.post('/register', AuthCtrl.register);

export default router;
