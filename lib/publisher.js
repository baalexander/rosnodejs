var net         = require('net')
  , url         = require('url')
  , portscanner = require('portscanner')
  , ros         = require('./ros')
  , environment = require('./environment')
  , master      = require('./master')
  , tcpros      = require('./tcpros')

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
          socket.on('data', function(data) {
            console.log('' + data)
          })
          that.socket = socket
        })
        that.server.listen(port, hostname)
        options.success()
      })
    }
  })
}

ros.Publisher.prototype.publish = function(message, callback) {
  if (this.socket) {
    var nodeId = this.get('nodeId')
      , topic  = this.get('topic')
      , buffer = tcpros.getPublishBuffer(nodeId, topic, message)

    console.log('' + buffer)
    this.socket.write(buffer)
  }
}

ros.Publisher.prototype.selectProtocol = function(protocols, callback) {
  var uri       = this.get('uri')
    , uriFields = url.parse(uri)
    , hostname  = uriFields.hostname
    , port      = parseInt(uriFields.port)
    , status    = 1
    , message   = 'ready on ' + uri
    , protocol  = ['TCPROS', hostname, port]

  callback(null, [status, message, protocol])
}

