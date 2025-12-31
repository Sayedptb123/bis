import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const loginPage = (req: Request, res: Response) => res.render('auth/login');
export const registerPage = (req: Request, res: Response) => res.render('auth/register');

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.create(req.body);
    res.redirect('/auth/login');
  } catch (err) {
    next(err);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/auth/login');
  });
};
