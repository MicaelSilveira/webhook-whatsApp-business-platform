'use strict';

const { config } = require('../config');
const { HttpError } = require('../utils/http-error');

async function generateGeminiResponse(userText) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${config.geminiModel}:generateContent?key=${encodeURIComponent(
      config.geminiApiKey
    )}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: userText }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new HttpError(
        502,
        `Gemini API error ${response.status}: ${body}`
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();

    if (!text) {
      throw new HttpError(502, 'Gemini returned an empty response');
    }

    return text;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new HttpError(504, 'Gemini request timed out');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  generateGeminiResponse,
};
