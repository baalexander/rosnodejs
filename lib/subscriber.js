var xmlrpc      = require('xmlrpc')
  , portscanner = require('portscanner')
  , ros         = require('./ros')
  , master      = require('./master')
  , TCPROS      = require('./tcpros')

ros.Subscriber.prototype.save = function(attributes, options) {
  var nodeId      = this.get('nodeId')
    , node        = ros.nodes.get(nodeId)
    , nodeUri     = node.get('uri')
    , topic       = this.get('topic')
    , Message     = this.get('Message')
    , message     = new Message()
    , messageType = message.get('type')

  master.registerSubscriber(nodeId, nodeUri, topic, messageType, function(error, value) {
    if (error !== null) {
      options.error(error)
    }
    else {
      options.success()
    }
  })
}

ros.Subscriber.prototype.publisherUpdate = function(publishers, callback) {
  var that = this

  var callerId  = '/' + this.get('nodeId')
    , topic     = this.get('topic')
    , Message   = this.get('Message')
    , protocols = [[this.get('protocol')]]

  for (var i = 0; i < publishers.length; i++) {
    var uri    = publishers[i]
      , client = xmlrpc.createClient(uri)

    client.methodCall('requestTopic', [callerId, topic, protocols], function(error, value) {
      var hostParams = value[2]
        , protocol   = hostParams[0]
        , host       = hostParams[1]
        , port       = hostParams[2]
      console.log('HOST: ' + host + ' PORT: ' + port)

      if (protocol === 'TCPROS') {
        this.tcpros = new TCPROS()

        tcpros.on('error', function(error) {
          console.error(error)
        })

        tcpros.on('message', function(message) {
          that.trigger('message', message)
        })

        tcpros.createClient(port, host, that)
      }

    })
  }

  callback(null)
}

