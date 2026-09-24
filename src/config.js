'use strict';

const dotenv = require('dotenv');

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,

  verifyToken: process.env.VERIFY_TOKEN,
  metaAppSecret: process.env.META_APP_SECRET,

  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  graphApiVersion: process.env.GRAPH_API_VERSION || 'v25.0',

  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',

  jwtSecret: process.env.JWT_SECRET,
  jwtIssuer: process.env.JWT_ISSUER || 'whatsapp-api',
  jwtAudience: process.env.JWT_AUDIENCE || 'whatsapp-api-client',

  bodyLimit: process.env.BODY_LIMIT || '100kb',
};

function getMissingRequiredEnv() {
  const requiredEnv = {
    VERIFY_TOKEN: config.verifyToken,
    META_APP_SECRET: config.metaAppSecret,
    WHATSAPP_ACCESS_TOKEN: config.whatsappAccessToken,
    WHATSAPP_PHONE_NUMBER_ID: config.whatsappPhoneNumberId,
    GEMINI_API_KEY: config.geminiApiKey,
    JWT_SECRET: config.jwtSecret,
  };

  return Object.entries(requiredEnv)
    .filter(([, value]) => !value)
    .map(([name]) => name);
}

function assertConfig() {
  const missing = getMissingRequiredEnv();

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

module.exports = {
  config,
  assertConfig,
};
