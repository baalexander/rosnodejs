// Subscribes to messages for a given topic. A Subscriber belongs to a Node.
//
// Extends the core Subscriber model to listen for messages over ROS protocols
// like TCPROS.
var xmlrpc      = require('xmlrpc')
  , ros         = require('../roswebjs/ros')
  , TCPROS      = require('./tcpros')
  , master      = require('./master')

// Registers its parent Node as a subscriber for the given topic.
ros.Subscriber.prototype.save = function(attributes, options) {
  var nodeId      = this.get('nodeId')
    , node        = ros.nodes.get(nodeId)
    , nodeUri     = node.get('uri')
    , topic       = this.get('topic')
    , Message     = this.get('Message')
    , message     = new Message()
    , messageType = message.get('type')

  // Register the Subscriber the parent Node belongs to, the topic being
  // subscribed to, and the type of message being subscribed to with ROS Master.
  master.registerSubscriber(nodeId, nodeUri, topic, messageType, function(error, value) {
    if (error !== null) {
      options.error(error)
    }
    else {
      options.success()
    }
  })
}

// Receives a list of publishers for the subscribed to topic and negotiates the
// best ROS protocol to use for each of them.
ros.Subscriber.prototype.publisherUpdate = function(publishers, callback) {
  var that = this

  var callerId  = '/' + this.get('nodeId')
    , topic     = this.get('topic')
    , Message   = this.get('Message')
    , protocols = [[this.get('protocol')]]

  for (var i = 0; i < publishers.length; i++) {
    var uri    = publishers[i]
      , client = xmlrpc.createClient(uri)

    // Sends the Publisher the supported protocols. The Publisher will return
    // the selected protocol and any connection parameters like port or host.
    // The Subscriber then begins listening over the discussed channel.
    client.methodCall('requestTopic', [callerId, topic, protocols], function(error, value) {
      var hostParams = value[2]
        , protocol   = hostParams[0]
        , host       = hostParams[1]
        , port       = hostParams[2]

      if (protocol === 'TCPROS') {
        this.tcpros = new TCPROS()

        tcpros.on('error', function(error) {
          that.trigger('error', error)
        })

        // If a message is received, emits the event. The core Subscriber model
        // listens for the message event and passes the message to the subscribe
        // callback.
        tcpros.on('message', function(message) {
          that.trigger('message', message)
        })

        // Sets up a TCP connection with the Publisher.
        tcpros.createClient(port, host, that)
      }

    })
  }

  callback(null)
}

