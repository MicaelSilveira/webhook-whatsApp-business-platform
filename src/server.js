'use strict';

const app = require('./app');
const { config, assertConfig } = require('./config');

assertConfig();

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
