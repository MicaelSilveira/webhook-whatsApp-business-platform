'use strict';

function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        duration_ms: Date.now() - startedAt,
        user_agent: req.get('user-agent'),
        ip: req.ip,
      })
    );
  });

  next();
}

module.exports = {
  requestLogger,
};
