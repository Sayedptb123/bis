# WhatsApp Reminder Service

## Features
- Send & receive WhatsApp reminders via Twilio
- Interactive buttons, media support
- Multi-language (EN/ES/HI)
- Cron scheduler (every minute)
- Admin dashboard with user/activity stats

## Tech Stack
- Node.js, Express, MongoDB, Mongoose
- Passport for auth, sessions
- date-fns & chrono-node for NL date parsing
- i18next for localization
- node-cron for scheduling
- helmet, rate-limiter for security

## Setup
1. Clone repo
2. `npm install`
3. Copy `.env.example` → `.env`, fill values
4. **Twilio webhook**: set “When message comes” to `https://your-app.herokuapp.com/webhook`
5. `npm start` or deploy to Heroku

## Heroku Deployment
- `heroku create`
- `heroku config:set $(cat .env | xargs)`
- `git push heroku main`
