'use strict';

const crypto = require('crypto');
const { config } = require('../config');
const { safeEqualHex } = require('../utils/safe-equal-hex');

function verifyMetaSignature(req, res, next) {
  const signature = req.get('x-hub-signature-256');

  if (!signature || !signature.startsWith('sha256=')) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const received = signature.slice('sha256='.length);

  const expected = crypto
    .createHmac('sha256', config.metaAppSecret)
    .update(req.rawBody || Buffer.from(''))
    .digest('hex');

  if (!safeEqualHex(received, expected)) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  return next();
}

module.exports = {
  verifyMetaSignature,
};
