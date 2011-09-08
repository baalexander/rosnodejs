var xmlrpc      = require('xmlrpc')
  , environment = require('./environment')

var master = exports

master.registerPublisher = function(callerId, callerUri, topic, callback) {
  var masterUri   = environment.getRosMasterUri()
    , topicName   = topic.get('name')
    , messageType = topic.get('type')
    , params      = [callerId, topicName, messageType, callerUri]

  var client = xmlrpc.createClient(masterUri)
  client.methodCall('registerPublisher', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.unregisterPublisher = function(callerId, callerUri, topic, callback) {
  var masterUri   = environment.getRosMasterUri()
    , topicName   = topic.get('name')
    , messageType = topic.get('type')
    , params      = [callerId, topicName, callerUri]

  var client = xmlrpc.createClient(masterUri)
  client.methodCall('unregisterPublisher', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.registerSubscriber = function(callerId, callerUri, topic, callback) {
  var masterUri   = environment.getRosMasterUri()
    , topicName   = topic.get('name')
    , messageType = topic.get('type')
    , params      = [callerId, topicName, messageType, callerUri]

  var client = xmlrpc.createClient(masterUri)
  client.methodCall('registerSubscriber', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.unregisterSubscriber = function(callerId, callerUri, topic, callback) {
  var masterUri = environment.getRosMasterUri()
    , topicName = topic.get('name')
    , params    = [callerId, topicName, callerUri]

  var client = xmlrpc.createClient(masterUri)
  client.methodCall('unregisterSubscriber', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.getPublishedTopics = function(callerId, subgraph, callback) {
  subgraph = subgraph || ''
  var masterUri = environment.getRosMasterUri()
    , params    = [callerId, subgraph]

  var client = xmlrpc.createClient(masterUri)
  client.methodCall('getPublishedTopics', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.lookupNode = function(callerId, name, callback) {
  var masterUri = environment.getRosMasterUri()
    , params    = [callerId, name]

  var client = xmlrpc.createClient(masterUri)
  client.methodCall('lookupNode', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.getSystemState = function(callerId, callback) {
  var masterUri = environment.getRosMasterUri()
    , params    = [callerId]

  var client = xmlrpc.createClient(masterUri)
  client.methodCall('getSystemState', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.getUri = function(callerId, callback) {
  var masterUri = environment.getRosMasterUri()
  callback(null, masterUri)
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

