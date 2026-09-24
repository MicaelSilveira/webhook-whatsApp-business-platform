'use strict';

function captureRawBody(req, res, buffer) {
  req.rawBody = buffer;
}

module.exports = {
  captureRawBody,
};
