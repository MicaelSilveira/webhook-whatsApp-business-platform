'use strict';

const { config } = require('../config');
const { HttpError } = require('../utils/http-error');

async function sendWhatsAppMessage(to, message) {
  const url =
    `https://graph.facebook.com/${config.graphApiVersion}/` +
    `${config.whatsappPhoneNumberId}/messages`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${config.whatsappAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new HttpError(
        502,
        `WhatsApp API error ${response.status}: ${body}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new HttpError(504, 'WhatsApp request timed out');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  sendWhatsAppMessage,
};
