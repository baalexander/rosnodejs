// Publishes messages to Nodes for a given topic. A Publisher belongs to a Node.
//
// Extends the core Publisher model to publish messages over ROS protocols like
// TCPROS.
var url         = require('url')
  , ros         = require('../roswebjs/ros')
  , TCPROS      = require('./tcpros')
  , master      = require('./master')

// Registers its parent Node with ROS Master as a publisher of the given topic.
ros.Publisher.prototype.save = function(attributes, options) {
  var that = this

  var nodeId      = this.get('nodeId')
    , node        = ros.nodes.get(nodeId)
    , nodeUri     = node.get('uri')
    , topic       = this.get('topic')
    , Message     = this.get('Message')
    , message     = new Message()
    , messageType = message.get('type')

  // Register the Node the Publisher belongs to, the topic the Publisher
  // publishes, and the type of message being published with ROS Master.
  master.registerPublisher(nodeId, nodeUri, topic, messageType, function(error, value) {
    if (error !== null) {
      options.error(error)
    }
    else {
      options.success()
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
}

// Negotiates the ROS protocol with the topic Subscriber.
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

  // Selects the first protocol both the Subscriber and Publisher agree on.
  for (var i = 0; i < protocols.length && !selectedProtocol; i++) {
    var protocol = protocols[i]
    if (protocol == publisherProtocol) {
      selectedProtocol = protocol
    }
  }

  // Creates a TCP server to support the TCPROS protocol.
  if (selectedProtocol == 'TCPROS') {
    this.tcpros = new TCPROS()
    this.tcpros.createServer(null, null, this, function(error, uri) {
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

