var http        = require('http')
  , net         = require('net')
  , url         = require('url')
  , xmlrpc      = require('xmlrpc')
  , ctype       = require('ctype')
  , portscanner = require('portscanner')
  , ros         = require('./ros')
  , environment = require('./environment')
  , master      = require('./master')

ros.Publisher.prototype.save = function(attributes, options) {
  var that = this

  var nodeId  = this.get('nodeId')
    , node    = ros.nodes.get(nodeId)
    , nodeUri = node.get('uri')
    , topic   = this.get('topic')

  master.registerPublisher(nodeId, nodeUri, topic, function(error, value) {
    if (error !== null) {
      options.error(error)
    }
    else {
      var hostname = environment.getHostname()
      portscanner.findAPortNotInUse(9000, 9050, hostname, function(error, port) {

        var uriFields = { protocol: 'http', hostname: hostname, port: port }
          , uri       = url.format(uriFields)
        that.set({ uri: uri })

        that.server = net.createServer(function(socket) {
          socket.on('data', function(data) { })
          that.socket = socket
        })
        that.server.listen(port)
        options.success()
      })
    }
  })
}

ros.Publisher.prototype.publish = function(message, callback) {
  if (this.socket) {
    this.socket.write(JSON.stringify(message))
  }
}

ros.Publisher.prototype.selectProtocol = function(protocols, callback) {
  var uri       = this.get('uri')
    , uriFields = url.parse(uri)

  var status   = 1
    , message  = 'ready on ' + uri
    , protocol = ['TCPROS', uriFields.hostname, uriFields.port]
  callback(null, [status, message, protocol])
}

