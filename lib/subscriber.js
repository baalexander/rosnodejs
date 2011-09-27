var net         = require('net')
  , url         = require('url')
  , xmlrpc      = require('xmlrpc')
  , portscanner = require('portscanner')
  , ros         = require('./ros')
  , master      = require('./master')
  , tcpros      = require('./tcpros')

ros.Subscriber.prototype.save = function(attributes, options) {
  var nodeId  = this.get('nodeId')
    , node    = ros.nodes.get(nodeId)
    , nodeUri = node.get('uri')
    , topic   = this.get('topic')

  master.registerSubscriber(nodeId, nodeUri, topic, function(error, value) {
    if (error !== null) {
      options.error(error)
    }
    else {
      options.success()
    }
  })
}

ros.Subscriber.prototype.sync = function(method, model, options) {
  options.success()
}

ros.Subscriber.prototype.publisherUpdate = function(publishers, callback) {
  var that = this

  var callerId  = '/' + this.get('nodeId')
    , topic     = this.get('topic')
    , topicName = topic.get('name')

  for (var i = 0; i < publishers.length; i++) {
    var uri    = publishers[i]
      , client = xmlrpc.createClient(uri)

    client.methodCall('requestTopic', [callerId, topicName, [['TCPROS']]], function(error, value) {
      var hostParams = value[2]
        , host       = hostParams[1]
        , port       = hostParams[2]
        , socket     = net.createConnection(port, host)

      socket.on('data', function(data) {
        var topic       = that.get('topic')
          , messageType = topic.get('type')
        that.trigger('message', '' + data)
      })

      var buffer = tcpros.getConnectionHeader(callerId, topic, null)
      socket.write(buffer)
    })
  }
  callback(null)
}

