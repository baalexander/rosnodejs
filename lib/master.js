var xmlrpc = require('xmlrpc')

var master = exports

master.registerPublisher = function(node, topic, topicType, callback) {
  callerId = node.getId()
  callerUri = node.getUri().host + ':' + node.getUri().port
  callerUri = 'http://localhost:9090'
  console.log('DEBUG')
  console.log(callerUri)
  console.log(topicType)

  var client = xmlrpc.createClient({ host: 'localhost', port: 11311, path: '/'})
  client.call('registerPublisher', [callerId, topic, topicType, callerUri], function(error, value) {
      console.log(error)
      console.log(value)
    callback()
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

