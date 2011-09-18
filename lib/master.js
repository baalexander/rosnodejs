var xmlrpc      = require('xmlrpc')
  , environment = require('./environment')

var master = exports

master.registerPublisher = function(callerId, callerUri, topic, callback) {
  var masterUri   = environment.getRosMasterUri()
    , callerId    = getGraphResourceName(callerId)
    , topicName   = getGraphResourceName(topic.get('name'))
    , messageType = topic.get('type')
    , params      = [callerId, topicName, messageType, callerUri]
    , client      = xmlrpc.createClient(masterUri)

  client.methodCall('registerPublisher', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.unregisterPublisher = function(callerId, callerUri, topic, callback) {
  var masterUri   = environment.getRosMasterUri()
    , callerId    = getGraphResourceName(callerId)
    , topicName   = getGraphResourceName(topic.get('name'))
    , messageType = topic.get('type')
    , params      = [callerId, topicName, callerUri]
    , client      = xmlrpc.createClient(masterUri)

  client.methodCall('unregisterPublisher', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.registerSubscriber = function(callerId, callerUri, topic, callback) {
  var masterUri   = environment.getRosMasterUri()
    , callerId    = getGraphResourceName(callerId)
    , topicName   = getGraphResourceName(topic.get('name'))
    , messageType = topic.get('type')
    , params      = [callerId, topicName, messageType, callerUri]
    , client      = xmlrpc.createClient(masterUri)

  client.methodCall('registerSubscriber', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.unregisterSubscriber = function(callerId, callerUri, topic, callback) {
  var masterUri = environment.getRosMasterUri()
    , callerId  = getGraphResourceName(callerId)
    , topicName = getGraphResourceName(topic.get('name'))
    , params    = [callerId, topicName, callerUri]
    , client    = xmlrpc.createClient(masterUri)

  client.methodCall('unregisterSubscriber', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.getPublishedTopics = function(callerId, subgraph, callback) {
  subgraph = subgraph || ''
  var masterUri = environment.getRosMasterUri()
    , callerId  = getGraphResourceName(callerId)
    , params    = [callerId, subgraph]
    , client    = xmlrpc.createClient(masterUri)

  client.methodCall('getPublishedTopics', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.lookupNode = function(callerId, nodeName, callback) {
  var masterUri = environment.getRosMasterUri()
    , callerId  = getGraphResourceName(callerId)
    , nodeName  = getGraphResourceName(nodeName)
    , params    = [callerId, nodeName]
    , client    = xmlrpc.createClient(masterUri)

  client.methodCall('lookupNode', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.getSystemState = function(callerId, callback) {
  var masterUri = environment.getRosMasterUri()
    , callerId  = getGraphResourceName(callerId)
    , params    = [callerId]
    , client    = xmlrpc.createClient(masterUri)

  client.methodCall('getSystemState', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.getUri = function(callerId, callback) {
  var masterUri = environment.getRosMasterUri()
    , callerId  = getGraphResourceName(callerId)

  callback(null, masterUri)
}

function getGraphResourceName(name) {
  var graphResourceName = name
  if (name.charAt(0) !== '/') {
    graphResourceName = '/' + graphResourceName
  }

  return graphResourceName
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

