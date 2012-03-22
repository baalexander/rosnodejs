// Publishes messages to nodes for a given topic. a publisher belongs to a node.
//
// Extends the core publisher model to publish messages over ROS protocols like
// TCPROS.
var url         = require('url')
  , ros         = require('../public/ros')
  , TCPROS      = require('./tcpros')
  , master      = require('./master')

// Registers its parent node with ROS Master as a publisher of the given topic.
ros.Publisher.prototype.save = function(attributes, options) {
  var that = this

  var nodeId      = this.get('nodeId')
    , node        = ros.nodes.get(nodeId)
    , nodeUri     = node.get('uri')
    , topic       = this.get('topic')
    , Message     = this.get('Message')
    , message     = new Message()
    , messageType = message.get('type')

  // Register the node the publisher belongs to, the topic the publisher
  // publishes, and the type of message being published with ROS Master.
  master.registerPublisher(nodeId, nodeUri, topic, messageType, function(error, value) {
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

// Sends the message over the negotiated ROS protocol.
ros.Publisher.prototype.publish = function(message, callback) {

  // Use TCPROS to send the message
  if (this.tcpros) {
    this.tcpros.sendMessage(message, function(error) {
      callback(error)
    })
  }
  // There are no subscribers for the topic or at least no subscribers that
  // agree on the transportation protocol.
  else {
    callback()
  }
}

// Negotiates the ROS protocol with the topic subscriber.
//
// Takes an array of protocol options (like ['TCPROS', 'UDPROS']), selects the
// best protocol option, and returns in the callback the selected protocol
// parameters.
ros.Publisher.prototype.selectProtocol = function(protocols, callback) {
  var that = this

  var Message           = this.get('Message')
    , statusError       = null 
    , statusCode        = -1
    , statusMessage     = ''
    , protocolParams    = []
    , publisherProtocol = this.get('protocol')
    , selectedProtocol  = false

  // Selects the first protocol both the subscriber and publisher agree on.
  for (var i = 0; i < protocols.length && !selectedProtocol; i++) {
    var protocol = protocols[i]
    if (protocol == publisherProtocol) {
      selectedProtocol = protocol
    }
  }

  // Creates a TCP server to support the TCPROS protocol.
  if (selectedProtocol == 'TCPROS') {
    this.tcpros = new TCPROS()
    this.tcpros.createServer(this, function(error, uri) {
      if (error) {
        statusError   = error
        statusCode    = -1
        statusMessage = error.message
      }
      else {
        that.set({ uri: uri })
        var uriFields = url.parse(uri)
          , hostname  = uriFields.hostname
          , port      = parseInt(uriFields.port)

        statusCode     = 1
        statusMessage  = 'ready on ' + uri
        protocolParams = ['TCPROS', hostname, port]
      }

      callback(statusError, [statusCode, statusMessage, protocolParams])
    })
  }
  // No protocol could be agreed upon, returns the error.
  else {
    callback(statusError, [statusCode, statusMessage, protocolParams])
  }
}

