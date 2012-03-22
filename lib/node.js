var url           = require('url')
  , EventEmitter2 = require('eventemitter2').EventEmitter2
  , portscanner   = require('portscanner')
  , xmlrpc        = require('xmlrpc')
  , environment   = require('./environment')
  , master        = require('./master')
  , Socket        = require('./socket');

function node(name) {
  if ((this instanceof node) === false) {
    return new node(name);
  }

  this.name = name;
  this.sockets = [];

  this.createSlaveServer();
};
node.prototype.__proto__ = EventEmitter2.prototype;

node.prototype.topic = function(params, callback) {
  var that = this;

  var socket = new Socket(params.topic, params.messageType);
  this.sockets[params.topic] = socket;

  socket.on('registerPublisher', function() {
    that.getUri(function(uri) {
      var masterParams = {
        callerId    : that.name
      , callerUri   : uri
      , topic       : params.topic
      , messageType : params.messageType
      }
      master.registerPublisher(masterParams, function(error) {
        if (error) {
          that.emit('error', error);
        }
      });
    });
  });

  callback(socket);
  return this;
};

node.prototype.getUri = function(callback) {
  if (this.uri) {
    callback(this.uri);
  }
  else {
    this.on('connection', function(uri) {
      callback(uri);
    });
  }
}

node.prototype.createSlaveServer = function() {
  var that = this;

  var hostname = environment.getHostname();
  portscanner.findAPortNotInUse(9000, null, hostname, function(error, port) {
    var uriFields = { protocol: 'http', hostname: hostname, port: port }
      , uri       = url.format(uriFields)
      , server    = xmlrpc.createServer(uri);

    that.uri = uri;
    server.on('requestTopic', that.requestTopic.bind(that));

    that.emit('connection', uri);
  });
};

node.prototype.requestTopic = function(error, params, callback) {
  var callerId  = params[0]
    , topic     = params[1]
    , protocols = params[2]

  if (topic.length > 0 && topic.charAt(0) === '/') {
    topic = topic.substr(1, topic.length - 1)
  }

  var socket = this.sockets[topic];
  if (socket) {
    socket.once('selectedProtocol', function(protocol) {
      callback(null, protocol);
    });
    socket.selectProtocol(protocols);
  }
}

module.exports = node;

