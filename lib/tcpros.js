var net           = require('net')
  , url           = require('url')
  , EventEmitter2 = require('eventemitter2').EventEmitter2
  , portscanner   = require('portscanner')
  , environment   = require('./environment')

function TCPROS() {
  if ((this instanceof TCPROS) === false) {
    return new TCPROS();
  }
}
TCPROS.prototype.__proto__ = EventEmitter2.prototype;

TCPROS.prototype.listen = function() {
  var that = this

  var hostname = environment.getHostname()
  portscanner.findAPortNotInUse(9000, null, hostname, function(error, port) {
    var uriFields = { protocol: 'http', hostname: hostname, port: port }
      , uri       = url.format(uriFields)

    var server = net.createServer(function(socket) {
      socket.on('data', function(data) {

      });
    });

    server.on('listening', function() {
      that.emit('listening', uri);
    });

    server.on('error', function(error) {
      that.emit('error', error)
    });

    server.listen(port, hostname);
  });
};

TCPROS.prototype.publish = function(message) {
  console.log('PUBLISHED');
};

module.exports = TCPROS;

