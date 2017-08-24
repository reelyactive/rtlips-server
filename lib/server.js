/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things
 */


const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const socketioClient = require('socket.io-client');
const eventsmanager = require('./eventsmanager');
const infrastructuremanager = require('./infrastructuremanager');
const positioningengine = require('./positioningengine');


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

  self.positioningEngine = new positioningengine(options);

  self.app = express();
  self.app.use(bodyParser.json());
  self.app.use(function(req, res, next) {
    req.rtlips = self;
    next();
  });
  self.app.use('/events', require('./routes/events'));
  self.server = http.createServer(self.app);

  self.io = socketio(self.server);

  self.io.on('connection', function(socket) {
    console.log('A socket.io client connected');
  });

  self.server.listen(self.httpPort, function() {
    console.log('rtlips-server is listening on port', self.httpPort);
  });
}


/**
 * Handle an inbound event
 * @param {String} event The given event.
 * @param {callback} callback Function to call on completion.
 */
RTLIPSServer.prototype.handleEvent = function(event, callback) {
  const self = this;

  // Abort if not a valid event
  if(!eventsmanager.normaliseEvent(event)) {
    if(callback) {
      callback({ "error": "Not a valid event" }, 400);
    }
    return;
  }
  if(callback) {
    callback({}, 200);
  }

  infrastructuremanager.translateRssiSignature(event);
  self.positioningEngine.positionEvent(event, function(positionedEvent) {
    eventsmanager.trimProperties(positionedEvent);
    self.io.emit(positionedEvent.event, positionedEvent);
  });
};


/**
 * Connect to a websocket
 * @param {String} event The given event.
 * @param {callback} callback Function to call on completion.
 */
RTLIPSServer.prototype.connect = function(url, options) {
  const self = this;

  options = options || {};

  var ioClient = socketioClient.connect(url, options);

  ioClient.on('connect', function() {
    console.log('socket.io client connected to ' + url);
  });

  ioClient.on('appearance', function(event) {
    self.handleEvent(event);
  });

  ioClient.on('displacement', function(event) {
    self.handleEvent(event);
  });

  ioClient.on('keep-alive', function(event) {
    self.handleEvent(event);
  });

  ioClient.on('disappearance', function(event) {
    self.handleEvent(event);
  });

  ioClient.on('disconnect', function() {
    console.log('socket.io client disconnected from ' + url);
  });
};


module.exports = RTLIPSServer;
