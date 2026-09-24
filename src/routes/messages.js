'use strict';

const express = require('express');
const { authenticateJWT } = require('../middleware/auth');
const { sendWhatsAppMessage } = require('../services/whatsapp');
const { asyncHandler } = require('../utils/async-handler');
const { HttpError } = require('../utils/http-error');

const router = express.Router();

router.post(
  '/api/messages',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
      throw new HttpError(400, 'Fields "to" and "message" are required');
    }

    const result = await sendWhatsAppMessage(to, message);

    res.status(200).json({
      success: true,
      data: result,
    });
  })
);

module.exports = router;
