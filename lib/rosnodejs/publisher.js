var url         = require('url')
  , portscanner = require('portscanner')
  , ros         = require('../roswebjs/ros')
  , TCPROS      = require('./tcpros/tcpros')
  , environment = require('./environment')
  , master      = require('./master')

ros.Publisher.prototype.save = function(attributes, options) {
  var that = this

  var nodeId      = this.get('nodeId')
    , node        = ros.nodes.get(nodeId)
    , nodeUri     = node.get('uri')
    , topic       = this.get('topic')
    , Message     = this.get('Message')
    , message     = new Message()
    , messageType = message.get('type')

  master.registerPublisher(nodeId, nodeUri, topic, messageType, function(error, value) {
    if (error !== null) {
      console.log('REGISTER ERROR')
      options.error(error)
    }
    else {
      console.log('REGISTER SUCCESS')
      options.success()
    }
  })
}

ros.Publisher.prototype.publish = function(message, callback) {
  console.log('PUBLISH')
  if (this.tcpros) {
    console.log('SENDING MESSAGE')
    this.tcpros.sendMessage(message, function(error) {
      callback(error)
    })
  }
}

ros.Publisher.prototype.selectProtocol = function(protocols, callback) {
  var that = this

  var Message           = this.get('Message')
    , statusError       = null 
    , statusCode        = -1
    , statusMessage     = ''
    , protocolParams    = []
    , publisherProtocol = this.get('protocol')
    , selectedProtocol  = false

  // Selects the first protocol both the subscriber and publisher agree on
  for (var i = 0; i < protocols.length && !selectedProtocol; i++) {
    var protocol = protocols[i]
    if (protocol == publisherProtocol) {
      selectedProtocol = protocol
    }
  }

  // Create a TCP server to support the TCPROS protocol
  if (selectedProtocol == 'TCPROS') {
    console.log('WINNING')
    this.tcpros = new TCPROS()
    this.tcpros.createServer(null, null, this, function(error, uri) {
      if (error) {
        statusError   = error
        statusCode    = -1
        statusMessage = error.message
      }
      else {
        console.log('URI')
        that.set({ uri: uri })
        console.log('CHECKING IF THAT IS THE RIGHT THIS')
        console.log(that)
        console.log(that.get('uri'))
        var uriFields = url.parse(uri)
          , hostname  = uriFields.hostname
          , port      = parseInt(uriFields.port)

        statusCode     = 1
        statusMessage  = 'ready on ' + uri
        protocolParams = ['TCPROS', hostname, port]
      }

      console.log('SC: ' + statusCode + ' SM: ' + statusMessage + ' PP: ' + protocolParams)
      callback(statusError, [statusCode, statusMessage, protocolParams])
    })
  }
  else {
    callback(statusError, [statusCode, statusMessage, protocolParams])
  }
}

