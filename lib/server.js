/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things
 */


const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const eventsmanager = require('./eventsmanager');
const infrastructuremanager = require('./infrastructuremanager');


const DEFAULT_HTTP_PORT = 3001;


/**
 * RTLIPSServer Class
 * Real-Time Location & Indoor Positioning System server.
 * @param {Object} options The options as a JSON object.
 * @constructor
 */
function RTLIPSServer(options) {
  const self = this;

  options = options || {};
  self.httpPort = process.env.PORT || options.httpPort || DEFAULT_HTTP_PORT;

  self.app = express();
  self.app.use(bodyParser.json());
  self.app.use(function(req, res, next) {
    req.rtlips = self;
    next();
  });
  self.app.use('/events', require('./routes/events'));
  self.server = http.createServer(self.app);

  self.ioServer = socketio(self.server);

  self.ioServer.on('connection', function(socket) {
    console.log('A socket.io client connected');
  });

  self.server.listen(self.httpPort, function() {
    console.log('rtlips-server is listening on port', self.httpPort);
  });
}


/**
 * Handle an inbound event
 * @param {String} event The type of event.
 * @param {callback} callback Function to call on completion.
 */
RTLIPSServer.prototype.handleEvent = function(event, callback) {
  const self = this;

  // Abort if not a valid event
  if(!eventsmanager.isValidEvent(event)) {
    return callback({ "error": "Not a valid event" }, 400);
  }
  callback({}, 200);

  infrastructuremanager.translateRssiSignature(event);

  // TODO: mixing, positioning, trimming

  self.ioServer.emit(event.event, event);
};


module.exports = RTLIPSServer;
