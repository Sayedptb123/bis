import axios from 'axios';

interface Button {
    payload: string;
    title: string;
}

export const sendWhatsApp = async (to: string, body: string, buttons: Button[] = [], mediaUrl: string[] = []): Promise<any> => {
    const phoneId = process.env.META_PHONE_ID;
    const token = process.env.META_ACCESS_TOKEN;

    if (!phoneId || !token) {
        throw new Error('Meta configuration missing: META_PHONE_ID or META_ACCESS_TOKEN');
    }

    const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;

    let payload: any = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: body }
    };

    // If there are buttons, we must use 'interactive' type
    if (buttons.length > 0) {
        payload = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: { text: body },
                action: {
                    buttons: buttons.map(b => ({
                        type: 'reply',
                        reply: {
                            id: b.payload,
                            title: b.title
                        }
                    }))
                }
            }
        };
    }

    // If there is media (taking the first one for simplicity, as WhatsApp API usually handles one header media)
    // For multiple media, we'd need multiple messages or a complex template.
    // This implementation supports one image if present, overriding text/buttons for simplicity in this migration.
    // A robust implementation would handle mixed content more carefully.
    if (mediaUrl.length > 0) {
        // NOTE: Meta requires an ID or link. 'link' is easiest for migration.
        // However, 'image' messages can't easily have reply buttons in the same message object without a template.
        // For this MVP migration, if media is present, we send it as a separate image message first.

        const mediaPayload = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'image',
            image: { link: mediaUrl[0] }
        };

        await axios.post(url, mediaPayload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // If we also have text/buttons, send them as a follow-up
        if (body) {
            // Recursive call without media to send the text/button part
            return sendWhatsApp(to, body, buttons, []);
        }
        return;
    }

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Meta API Error:', error.response?.data || error.message);
        throw error;
    }
};
