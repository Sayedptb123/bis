const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

module.exports = {
  sendWhatsApp: (to, body, buttons=[], mediaUrl=[]) =>
    client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
      body,
      persistentAction: buttons.map(b => `action=${b.payload}`),
      mediaUrl
    })
};
