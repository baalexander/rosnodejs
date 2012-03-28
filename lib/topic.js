var url           = require('url')
  , EventEmitter2 = require('eventemitter2').EventEmitter2
  , TCPROS        = require('./tcpros');

function Topic(name, messageType) {
  if ((this instanceof Topic) === false) {
    return new Topic(name, messageType)
  }

  this.name = name;
  this.messageType = messageType;
  this.registeredPublisher = false
  this.protocol = null;
}
Topic.prototype.__proto__ = EventEmitter2.prototype;

Topic.prototype.publish = function(message) {
  if (!this.registeredPublisher) {
    this.registeredPublisher = true;
    this.emit('registerPublisher');
  }

  if (this.protocol) {
    this.protocol.publish(message)
  }
}

Topic.prototype.selectProtocol = function(protocols) {
  this.selectTCPROS();
}

Topic.prototype.selectTCPROS = function() {
  var that = this;

  this.protocol = new TCPROS();
  this.protocol.on('listening', function(uri) {
    var statusCode     = 1
      , statusMessage  = 'ready on ' + uri
      , uriFields      = url.parse(uri)
      , hostname       = uriFields.hostname
      , port           = parseInt(uriFields.port)
      , protocolParams = ['TCPROS', hostname, port];

    that.emit('selectedProtocol', [statusCode, statusMessage, protocolParams]);
  });

  this.protocol.listen();
}

module.exports = Topic;

