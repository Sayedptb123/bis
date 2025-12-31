import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

interface Button {
  payload: string;
  title: string;
}

export const sendWhatsApp = (to: string, body: string, buttons: Button[] = [], mediaUrl: string[] = []) =>
  client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`,
    body,
    persistentAction: buttons.map(b => `action=${b.payload}`),
    mediaUrl
  });
