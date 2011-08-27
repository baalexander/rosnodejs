var xmlrpc = require('xmlrpc')

var master = exports

master.registerPublisher = function(callerId, callerUri, topic, callback) {
  var masterUri   = this.getUri()
    , topicName   = topic.get('name')
    , messageType = topic.get('type')
    , params      = [callerId, topicName, messageType, callerUri]

  var client = xmlrpc.createClient(masterUri)
  client.call('registerPublisher', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.unregisterPublisher = function(callerId, callerUri, topic, callback) {
  var masterUri   = this.getUri()
    , topicName   = topic.get('name')
    , messageType = topic.get('type')
    , params      = [callerId, topicName, callerUri]

  var client = xmlrpc.createClient(masterUri)
  client.call('unregisterPublisher', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.registerSubscriber = function(callerId, callerUri, topic, callback) {
  var masterUri   = this.getUri()
    , topicName   = topic.get('name')
    , messageType = topic.get('type')
    , params      = [callerId, topicName, messageType, callerUri]

  var client = xmlrpc.createClient(masterUri)
  client.call('registerSubscriber', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.unregisterSubscriber = function(callerId, callerUri, topic, callback) {
  var masterUri = this.getUri()
    , topicName = topic.get('name')
    , params    = [callerId, topicName, callerUri]

  var client = xmlrpc.createClient(masterUri)
  client.call('unregisterSubscriber', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.getPublishedTopics = function(callerId, subgraph, callback) {
  subgraph = subgraph || ''
  var masterUri = this.getUri()
    , params    = [callerId, subgraph]

  var client = xmlrpc.createClient(masterUri)
  client.call('getPublishedTopics', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.lookupNode = function(callerId, name, callback) {
  var masterUri = this.getUri()
    , params    = [callerId, name]

  var client = xmlrpc.createClient(masterUri)
  client.call('lookupNode', [callerId, name], function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.getSystemState = function(callerId, callback) {
  var masterUri = this.getUri()
    , params    = [callerId]

  var client = xmlrpc.createClient(masterUri)
  client.call('getSystemState', params, function(error, value) {
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

