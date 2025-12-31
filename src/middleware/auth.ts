import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface if needed, or cast req.
// Passport adds `user` to request.

export const ensureAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
};

export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore - req.user is added by passport
  if (req.isAuthenticated() && req.user?.role === 'admin') return next();
  res.redirect('/auth/login');
};
