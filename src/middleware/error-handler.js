'use strict';

function errorHandler(error, req, res, next) {
  console.error(
    JSON.stringify({
      event: 'unhandled_error',
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    })
  );

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    error:
      statusCode === 500 ? 'Internal server error' : error.message,
  });
}

module.exports = {
  errorHandler,
};
