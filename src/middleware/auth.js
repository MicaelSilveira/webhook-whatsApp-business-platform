'use strict';

const jwt = require('jsonwebtoken');
const { config } = require('../config');

function authenticateJWT(req, res, next) {
  const authorization = req.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Missing or invalid Authorization header',
    });
  }

  const token = authorization.slice('Bearer '.length);

  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
      issuer: config.jwtIssuer,
      audience: config.jwtAudience,
    });

    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
}

module.exports = {
  authenticateJWT,
};
