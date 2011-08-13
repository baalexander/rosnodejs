var xmlrpc = require('xmlrpc')

var master = exports

master.registerPublisher = function(callerId, callerUri, topic, callback) {
  console.log('MASTER REGISTER PUBLISHER')
  var masterUri = this.getUri()
  var topicName = topic.get('name')
  var messageType = topic.get('message').get('type')

  var client = xmlrpc.createClient(masterUri)
  client.call('registerPublisher', [callerId, topicName, messageType, callerUri], function(error, value) {
    console.log('RESPONSE FROM REGISTER PUBLISHER')
    parseResponse(error, value, callback)
  })
}

master.unregisterPublisher = function(callerId, callerUri, topic, callback) {
  console.log('MASTER UNREGISTER PUBLISHER')
  var masterUri = this.getUri()
  var topicName = topic.get('name')
  var messageType = topic.get('message').get('type')

  var client = xmlrpc.createClient(masterUri)
  client.call('unregisterPublisher', [callerId, topicName, callerUri], function(error, value) {
    console.log('RESPONSE FROM UNREGISTER PUBLISHER')
    parseResponse(error, value, callback)
  })
}

master.registerSubscriber = function(callerId, callerUri, topic, callback) {
  console.log('MASTER REGISTER SUBSCRIBER')
  var masterUri = this.getUri()
  var topicName = topic.get('name')
  var messageType = topic.get('message').get('type')

  var client = xmlrpc.createClient(masterUri)
  client.call('registerSubscriber', [callerId, topicName, messageType, callerUri], function(error, value) {
    console.log('RESPONSE FROM REGISTER SUBSCRIBER')
    parseResponse(error, value, callback)
  })
}

master.unregisterSubscriber = function(callerId, callerUri, topic, callback) {
  console.log('MASTER UNREGISTER SUBSCRIBER')
  var masterUri = this.getUri()
  var topicName = topic.get('name')

  var client = xmlrpc.createClient(masterUri)
  client.call('unregisterSubscriber', [callerId, topicName, callerUri], function(error, value) {
    console.log('RESPONSE FROM UNREGISTER SUBSCRIBER')
    parseResponse(error, value, callback)
  })
}

master.getPublishedTopics = function(callerId, subgraph, callback) {
  console.log('MASTER GET PUBLISHED TOPICS')
  // If a subgraph not specified, uses empty string for all
  subgraph = subgraph || ''
  var masterUri = this.getUri()

  var client = xmlrpc.createClient(masterUri)
  client.call('getPublishedTopics', [callerId, subgraph], function(error, value) {
    console.log('RESPONSE FROM GET PUBLISHED TOPICS')
    parseResponse(error, value, callback)
  })
}

master.lookupNode = function(callerId, name, callback) {
  console.log('MASTER LOOKUP NODE')
  var masterUri = this.getUri()

  var client = xmlrpc.createClient(masterUri)
  client.call('lookupNode', [callerId, name], function(error, value) {
    console.log('RESPONSE FROM LOOKUP NODE')
    parseResponse(error, value, callback)
  })
}

master.getSystemState = function(callerId, callback) {
  console.log('MASTER GET SYSTEM STATE')
  var masterUri = this.getUri()

  var client = xmlrpc.createClient(masterUri)
  client.call('getSystemState', [callerId], function(error, value) {
    console.log('RESPONSE FROM GET SYSTEM STATE')
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

