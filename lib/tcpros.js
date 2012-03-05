var environment   = require('environment')
  , EventEmitter2 = require('eventemitter').EventEmitter2

function TCPROS() {
  if ((this instanceof TCPROS) === false) {
    return new TCPROS()
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

