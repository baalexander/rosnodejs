var xmlrpc = require('xmlrpc')

var master = exports

master.registerPublisher = function(callerId, node, topic, callback) {
  var callerUri = 'http://' + node.getUri().host + ':' + node.getUri().port

  var masterUri = this.getUri()
  var client = xmlrpc.createClient(masterUri)
  client.call('registerPublisher', [callerId, topic.name, topic.type, callerUri], function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.unregisterPublisher = function(callerId, node, topic, callback) {
  var callerUri = 'http://' + node.getUri().host + ':' + node.getUri().port

  var masterUri = this.getUri()
  var client = xmlrpc.createClient(masterUri)
  client.call('unregisterPublisher', [callerId, topic.name, callerUri], function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.registerSubscriber = function(callerId, node, topic, callback) {
  var callerUri = 'http://' + node.getUri().host + ':' + node.getUri().port

  var masterUri = this.getUri()
  var client = xmlrpc.createClient(masterUri)
  client.call('registerSubscriber', [callerId, topic.name, topic.type, callerUri], function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.unregisterSubscriber = function(callerId, node, topic, callback) {
  var callerUri = 'http://' + node.getUri().host + ':' + node.getUri().port

  var masterUri = this.getUri()
  var client = xmlrpc.createClient(masterUri)
  client.call('unregisterSubscriber', [callerId, topic.name, callerUri], function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.getPublishedTopics = function(callerId, subgraph, callback) {
  // If a subgraph not specified, uses empty string for all
  subgraph = subgraph || ''

  var masterUri = this.getUri()
  var client = xmlrpc.createClient(masterUri)
  client.call('getPublishedTopics', [callerId, subgraph], function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.lookupNode = function(callerId, name, callback) {
  var masterUri = this.getUri()
  var client = xmlrpc.createClient(masterUri)
  client.call('lookupNode', [callerId, name], function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.getSystemState = function(callerId, callback) {
  var masterUri = this.getUri()
  var client = xmlrpc.createClient(masterUri)
  client.call('getSystemState', [callerId], function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.getUri = function(node, callback) {
  return { host: 'localhost', port: 11311, path: '/' }
}

function parseResponse(error, response, callback) {
  var value = null

  // Determines error or value based on the response
  if (error === null) {
    // The standard format response for ROS is:
    // [0] status code
    // [1] status message
    // [2] value
    if (response instanceof Array && response.length >= 2) {
      if (response[0] === -1 || response[1] === 0) {
        error = response[1]
      }
      // Successful response
      else {
        value = true
        // If a value is specified in the response, use that
        if (response.length === 3) {
          value = response[2]
        }
      }
    }
    // The response does not match ROS' standard format
    else {
      error = 'Master returned an invalid response.'
    }
  }

  callback(error, value)
}

