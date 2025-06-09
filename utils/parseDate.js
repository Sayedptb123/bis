const { parse, format, add } = require('date-fns');
const chrono = require('chrono-node');

module.exports = text => {
  const date = chrono.parseDate(text, new Date(), { forwardDate: true });
  if (!date) throw new Error('Could not parse date');
  return date;
};
