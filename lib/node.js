var url           = require('url')
  , EventEmitter2 = require('eventemitter2').EventEmitter2
  , portscanner   = require('portscanner')
  , xmlrpc        = require('xmlrpc')
  , environment   = require('./environment')
  , master        = require('./master')
  , Topic         = require('./topic');

function node(name) {
  if ((this instanceof node) === false) {
    return new node(name);
  }

  this.name = name;
  this.sockets = [];

  this.createSlaveServer();
};
node.prototype.__proto__ = EventEmitter2.prototype;

node.prototype.topics = function(topics, callback) {
  var that = this;

  var sockets = [];
  topics.forEach(function(topic) {
    var socket = new Topic(this.name, topic.topic, topic.messageType);
    sockets.push(socket);
    that.sockets[topic.topic] = socket;

    socket.on('registerPublisher', function() {
      that.getUri(function(uri) {
        var masterParams = {
          callerId    : that.name
        , callerUri   : uri
        , topic       : topic.topic
        , messageType : topic.messageType
        };
        master.registerPublisher(masterParams, function(error) {
          if (error) {
            that.emit('error', error);
          }
        });
      });
    });

    socket.on('registerSubscriber', function() {
      that.getUri(function(uri) {
        var masterParams = {
          callerId    : that.name
        , callerUri   : uri
        , topic       : topic.topic
        , messageType : topic.messageType
        };
        master.registerSubscriber(masterParams, function(error) {
          if (error) {
            that.emit('error', error);
          }
        });
      });
    });
  });

  callback.apply(this, sockets);

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
};

node.prototype.createSlaveServer = function() {
  var that = this;

  var hostname = environment.getHostname();
  portscanner.findAPortNotInUse(9000, null, hostname, function(error, port) {
    var uriFields = { protocol: 'http', hostname: hostname, port: port }
      , uri       = url.format(uriFields)
      , server    = xmlrpc.createServer(uri);

    that.uri = uri;
    server.on('requestTopic', that.requestTopic.bind(that));
    server.on('publisherUpdate', that.publisherUpdate.bind(that));

    that.emit('connection', uri);
  });
};

node.prototype.requestTopic = function(error, params, callback) {
  var callerId  = params[0]
    , topic     = params[1]
    , protocols = params[2]
    ;

  if (topic.length > 0 && topic.charAt(0) === '/') {
    topic = topic.substr(1, topic.length - 1);
  }

  var socket = this.sockets[topic];
  if (socket) {
    socket.once('selectedProtocol', function(protocol) {
      callback(null, protocol);
    });
    socket.selectProtocol(protocols);
  }
};

node.prototype.publisherUpdate = function(error, params, callback) {
  var callerId   = params[0]
    , topic      = params[1]
    , publishers = params[2]
    ;

  if (topic.length > 0 && topic.charAt(0) === '/') {
    topic = topic.substr(1, topic.length - 1);
  }

  var socket = this.sockets[topic];
  publishers.forEach(function(publisherUri) {
    socket.publisherUpdate(publisherUri);
    var client = xmlrpc.createClient(publisherUri);
    client.methodCall('requestTopic', [callerId, topicName, protocols], function(error, value) {
      var hostParams = value[2]
        , protocol   = hostParams[0]
        , host       = hostParams[1]
        , port       = hostParams[2]

      if (protocol === 'TCPROS') {
        that.tcpros = new TCPROS()

        that.tcpros.on('error', function(error) {
          that.trigger('error', error)
        })

        // If a message is received, emits the event. The core subscriber model
        // listens for the message event and passes the message to the subscribe
        // callback.
        that.tcpros.on('message', function(message) {
          that.trigger('message', message)
        })

        // Sets up a TCP connection with the publisher.
        that.tcpros.createClient(port, host, that)
      }
    });
  });
};

module.exports = node;

