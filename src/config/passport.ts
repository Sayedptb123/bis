import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { PassportStatic } from 'passport';
import User from '../models/User';

export default function (passport: PassportStatic) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'Incorrect email' });
        // @ts-ignore - comparePassword defined on IUser interface
        const match = await bcrypt.compare(password, user.password as string);
        if (!match) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser((id, done) =>
    User.findById(id).then(user => done(null, user)).catch(err => done(err))
  );
};
