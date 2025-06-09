require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('./middleware/rateLimiter');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const i18n = require('./config/i18n');
const db = require('./config/database');
const scheduler = require('./cron/scheduler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security & parsing
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit);

// i18n
app.use(i18n.init);

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

// Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Routes
app.use('/webhook', require('./routes/webhook'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./middleware/auth').ensureAdmin, require('./routes/admin'));

// Error handler
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  scheduler.start();
});
