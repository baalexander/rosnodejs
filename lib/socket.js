var EventEmitter2 = require('eventemitter').EventEmitter2

function Socket() {
  if ((this instanceof Socket) === false) {
    return new Socket()
  }

  this.registeredPublisher = false
  this.protocol = null;
}
Socket.prototype.__proto__ = EventEmitter2.prototype;

Socket.prototype.publish = function(message) {
  if (!this.registeredPublisher) {
    this.registeredPublisher = true;
    this.emit('registerPublisher');
  }

  if (this.protocol) {
    this.protocol.publish(message)
  }
}

Socket.prototype.selectProtocol = function(protocols) {
  this.selectTCPROS();
}

Socket.prototype.selectTCPROS = function() {
  this.protocol = new TCPROS();
  this.protocol.on('listening', function(uri) {
    var statusCode     = 1
      , statusMessage  = 'ready on ' + uri
      , uriFields      = url.parse(uri)
      , hostname       = uriFields.hostname
      , port           = parseInt(uriFields.port)
      , protocolParams = ['TCPROS', hostname, port];

    that.emit('selectedProtocol', [statusCode, statusMessage, protocolParams]);
  }

  this.protocol.listen();
}

