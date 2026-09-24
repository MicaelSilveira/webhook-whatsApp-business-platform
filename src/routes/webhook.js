'use strict';

const express = require('express');
const { config } = require('../config');
const { verifyMetaSignature } = require('../middleware/verify-meta-signature');
const { generateGeminiResponse } = require('../services/gemini');
const { sendWhatsAppMessage } = require('../services/whatsapp');
const { asyncHandler } = require('../utils/async-handler');

const router = express.Router();

router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const token = req.query['hub.verify_token'];

  if (mode === 'subscribe' && token === config.verifyToken) {
    return res.status(200).send(challenge);
  }

  return res.status(403).json({
    error: 'Webhook verification failed',
  });
});

router.post(
  '/',
  verifyMetaSignature,
  asyncHandler(async (req, res) => {
    const change = req.body?.entry?.[0]?.changes?.[0];

    if (!change) {
      return res.status(200).json({ received: true });
    }

    const value = change.value;
    const message = value?.messages?.[0];

    if (!message) {
      return res.status(200).json({ received: true });
    }

    if (message.type !== 'text') {
      return res.status(200).json({ received: true, ignored: true });
    }

    const userText = message.text?.body;
    const userWaId = message.from;

    if (!userText || !userWaId) {
      return res.status(200).json({ received: true, ignored: true });
    }

    const geminiResponse = await generateGeminiResponse(userText);
    await sendWhatsAppMessage(userWaId, geminiResponse);

    return res.status(200).json({ received: true });
  })
);

module.exports = router;
