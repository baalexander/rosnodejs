// Subscribes to messages for a given topic. A subscriber belongs to a node.
//
// Extends the core subscriber model to listen for messages over ROS protocols
// like TCPROS.
var xmlrpc      = require('xmlrpc')
  , ros         = require('../public/ros')
  , TCPROS      = require('./tcpros')
  , master      = require('./master')

// Registers its parent node as a subscriber for the given topic.
ros.Subscriber.prototype.save = function(attributes, options) {
  var that = this

  var nodeId      = this.get('nodeId')
    , node        = ros.nodes.get(nodeId)
    , nodeUri     = node.get('uri')
    , topic       = this.get('topic')
    , Message     = this.get('Message')
    , message     = new Message()
    , messageType = message.get('type')

  // Register the subscriber the parent node belongs to, the topic being
  // subscribed to, and the type of message being subscribed to with ROS Master.
  master.registerSubscriber(nodeId, nodeUri, topic, messageType, function(error, value) {
    if (error) {
      // Follows the Backbone error signature of (model, response).
      var response = {
        responseText: JSON.stringify({
          message: error.message
        })
      }
      options.error(null, response)
    }
    else {
      options.success(that)
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

    // Sends the publisher the supported protocols. The publisher will return
    // the selected protocol and any connection parameters like port or host.
    // The subscriber then begins listening over the discussed channel.
    client.methodCall('requestTopic', [callerId, topic, protocols], function(error, value) {
      var hostParams = value[2]
        , protocol   = hostParams[0]
        , host       = hostParams[1]
        , port       = hostParams[2]

      if (protocol === 'TCPROS') {
        that.tcpros = new TCPROS()

        that.tcpros.on('error', function(error) {
          that.trigger('error', error)
        })

        // If a message is received, emits the event. The core subscriber model
        // listens for the message event and passes the message to the subscribe
        // callback.
        that.tcpros.on('message', function(message) {
          that.trigger('message', message)
        })

        // Sets up a TCP connection with the publisher.
        that.tcpros.createClient(port, host, that)
      }

    })
  }

  callback(null)
}

