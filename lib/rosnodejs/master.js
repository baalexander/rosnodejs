// Handles all calls to ROS Master using the ROS Master API.
var xmlrpc      = require('xmlrpc')
  , environment = require('./environment')

var master = exports

// Registers the Node as a publisher of the given topic.
//
// The parameters include:
//  * callerId - The name of the Node to register as a Publisher.
//  * callerUri - The URI of the Node.
//  * topic - The topic name.
//  * messageType - The message type name.
master.registerPublisher = function(callerId, callerUri, topic, messageType, callback) {
  var masterUri   = environment.getRosMasterUri()
    , callerId    = getGraphResourceName(callerId)
    , topicName   = getGraphResourceName(topic)
    , params      = [callerId, topicName, messageType, callerUri]
    , client      = xmlrpc.createClient(masterUri)

  client.methodCall('registerPublisher', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

// Unregisters the Node as a publisher of the given topic.
//
// The parameters include:
//  * callerId - The name of the Node to unregister as a Publisher.
//  * callerUri - The URI of the Node.
//  * topic - The topic name no longer being published.
master.unregisterPublisher = function(callerId, callerUri, topic, callback) {
  var masterUri   = environment.getRosMasterUri()
    , callerId    = getGraphResourceName(callerId)
    , topicName   = getGraphResourceName(topic)
    , params      = [callerId, topicName, callerUri]
    , client      = xmlrpc.createClient(masterUri)

  client.methodCall('unregisterPublisher', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

// Registers the Node as a subscriber for the given topic.
//
// The parameters include:
//  * callerId - The name of the Node to register as a Subscriber.
//  * callerUri - The URI of the Node.
//  * topic - The topic name.
//  * messageType - The message type name.
master.registerSubscriber = function(callerId, callerUri, topic, messageType, callback) {
  var masterUri   = environment.getRosMasterUri()
    , callerId    = getGraphResourceName(callerId)
    , topicName   = getGraphResourceName(topic)
    , params      = [callerId, topicName, messageType, callerUri]
    , client      = xmlrpc.createClient(masterUri)

  client.methodCall('registerSubscriber', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

// Unregisters the Node as a subscriber for the given topic.
//
// The parameters include:
//  * callerId - The name of the Node to unregister as a Subscriber.
//  * callerUri - The URI of the Node.
//  * topic - The topic name no longer being published.
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

// Returns an array of topics that currently have Publishers.
//
// The parameters include:
//  * callerId - The name of the Node performing the request.
//  * subgraph - Restricts topic names to match within this subgraph.
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

// Returns the XML-RPC URI of the matching Node.
//
// The parameters include:
//  * callerId - The name of the Node performing the request.
//  * nodeName - The name of the Node to look up.
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

// Retrieves a comprehensive list of the current ROS state, including
// Publishers, Subscribers, and Services.
//
// The parameters include:
//  * callerId - The name of the Node performing the request.
master.getSystemState = function(callerId, callback) {
  var masterUri = environment.getRosMasterUri()
    , callerId  = getGraphResourceName(callerId)
    , params    = [callerId]
    , client    = xmlrpc.createClient(masterUri)

  client.methodCall('getSystemState', params, function(error, value) {
    parseResponse(error, value, callback)
  })
}

// Returns the ROS Master URI
//
// The parameters include:
//  * callerId - The name of the Node performing the request.
master.getUri = function(callerId, callback) {
  var masterUri = environment.getRosMasterUri()
    , callerId  = getGraphResourceName(callerId)

  callback(null, masterUri)
}

// Normalizes a Node's name. Really just makes it belong to root right now.
function getGraphResourceName(name) {
  var graphResourceName = name
  if (name.charAt(0) !== '/') {
    graphResourceName = '/' + graphResourceName
  }

  return graphResourceName
}

// Extracts the error or the value (if any) from a ROS response.
function parseResponse(error, response, callback) {
  var value = null

  // Determines if an error or value based on the response.
  if (error === null) {
    // The standard format response for ROS is:
    //  [0] status code
    //  [1] status message
    //  [2] value
    if (response instanceof Array && response.length >= 2) {
      // Status codes of <= 0 are considered errors.
      if (response[0] === -1 || response[1] === 0) {
        error = response[1]
      }
      else {
        value = true
        // If a value is specified in the response, use it.
        if (response.length === 3) {
          value = response[2]
        }
      }
    }
    // The response does not match ROS' standard format.
    else {
      error = 'Master returned an invalid response.'
    }
  }

  callback(error, value)
}

