var environment = require('./environment')
  , master      = require('./master');

function node(name) {
  this.name = name;
  this.sockets = [];
};

node.prototype.topic = function(params, callback) {
  var that = this;

  var socket = new Socket(params.topic, params.messageType);
  this.sockets[params.topic] = socket;

  socket.on('registerPublisher', function() {
    that.getUri(function(uri) {
      master.registerPublisher(that.name, uri, params.topic, params.messageType);
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
    this.on('connected', function(uri) {
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
    that.emit('connection', uri);

    server.on('requestTopic', that.requestTopic);
  });
};

node.prototype.requestTopic = function(error, params, callback) {
  var callerId  = params[0]
    , topic     = params[1]
    , protocols = params[2]

  if (topic.length > 0 && topic.charAt(0) === '/') {
    topic = topic.substr(1, topic.length - 1)
  }

  var socket = sockets[topic];
  if (socket) {
    socket.once('selectedProtocol', function(protocol) {
      callback(null, protocol);
    }
    socket.selectProtocol(protocol);
  }
}

module.exports = node

