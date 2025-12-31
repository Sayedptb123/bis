import * as chrono from 'chrono-node';

export default function parseDate(text: string): Date {
  const date = chrono.parseDate(text, new Date(), { forwardDate: true });
  if (!date) throw new Error('Could not parse date');
  return date;
}
