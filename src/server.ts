import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import rateLimit from './middleware/rateLimiter';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import i18nMiddleware from './config/i18n';
import './config/database'; // Import for side effects (connection)
import scheduler from './cron/scheduler';
import errorHandler from './middleware/errorHandler';
import passportConfig from './config/passport';
import { ensureAdmin } from './middleware/auth';
import path from 'path';

// Routes
import webhookRoutes from './routes/webhook';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

// Workers
import './workers/reminderWorker';

const app = express();

// Security & parsing
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit);

// i18n middleware (detects language, adds req.t())
app.use(i18nMiddleware);

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET as string || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI as string,
      mongoOptions: {
        tls: true,
        tlsInsecure: false,
      }
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

// Passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Views are inside src now, but will be copied... wait, I need to copy views to dist or run from src in dev. 
// For dev: src/views. For prod, we need to handle this.
// Let's assume for now we point to where they are. In local dev with ts-node, __dirname is src.
// In dist, __dirname is dist. So we need to copy views to dist/views.

// Routes
app.use('/webhook', webhookRoutes);
app.use('/auth', authRoutes);
app.use('/admin', ensureAdmin, adminRoutes);

// Error handler
app.use(errorHandler);

// Start server & cron
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  scheduler.start();
});
