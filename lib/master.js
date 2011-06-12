var xmlrpc = require('xmlrpc')

var master = exports

master.registerPublisher = function(node, topic, topicType, callback) {
  callerId = node.getId()
  callerUri = 'http://' + node.getUri().host + ':' + node.getUri().port

  var client = xmlrpc.createClient({ host: 'localhost', port: 11311, path: '/'})
  client.call('registerPublisher', [callerId, topic, topicType, callerUri], function(error, value) {
    parseResponse(error, value, callback)
  })
}

master.unregisterPublisher = function(node, topic, callback) {

}

master.registerSubscriber = function(node, topic, topicType, callback) {

}

master.unregisterPublisher = function(node, topic, callback) {

}

master.getPublishedTopics = function(node, subgraph, callback) {

}

master.lookupNode = function(node, name, callback) {

}

master.getSystemState = function(node, callback) {

}

master.getUri = function(node, callback) {

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
