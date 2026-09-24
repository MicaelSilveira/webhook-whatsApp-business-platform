'use strict';

const crypto = require('crypto');

function safeEqualHex(a, b) {
  try {
    const bufferA = Buffer.from(a, 'hex');
    const bufferB = Buffer.from(b, 'hex');

    if (bufferA.length !== bufferB.length) {
      return false;
    }

    return crypto.timingSafeEqual(bufferA, bufferB);
  } catch {
    return false;
  }
}

module.exports = {
  safeEqualHex,
};
