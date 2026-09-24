'use strict';

const express = require('express');
const helmet = require('helmet');

const { config } = require('./config');
const { captureRawBody } = require('./utils/raw-body');
const { requestLogger } = require('./middleware/request-logger');
const { notFound } = require('./middleware/not-found');
const { errorHandler } = require('./middleware/error-handler');

const healthRoutes = require('./routes/health');
const webhookRoutes = require('./routes/webhook');
const messageRoutes = require('./routes/messages');

const app = express();

app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  express.json({
    limit: config.bodyLimit,
    verify: captureRawBody,
  })
);

app.use(requestLogger);

app.use(healthRoutes);
app.use(webhookRoutes);
app.use(messageRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
