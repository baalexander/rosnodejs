// A web server serving core ROS files to the browser and handling the
// communication between the browser and ROS on the server.
//
// A RESTful API and web sockets are set up to communicate between the browser
// and server.
var express  = require('express')
  , socketio = require('socket.io')
  , ros      = require('../rosnodejs/rosnode')

var rosserver = exports

// Collection of ROS package message files to include. The message file
// definitions for these packages will be made available to the client.
//
// Example:
// { std_msgs      : std_msgs
// , geometry_msgs : geometry_msgs
// }
rosserver.packages = {}

// Array of static directories to serve. The core ROS models are being served by
// default.
rosserver.statics  = []

rosserver.app = express.createServer()

rosserver.app.configure(function() {
  rosserver.app.use(express.methodOverride())
  rosserver.app.use(express.bodyParser())
  // Include the core ROS files for use on the web.
  rosserver.app.use(express.static(__dirname + '/../roswebjs/'))
})


// Node
// ----

// Retrieves a collection of nodes or a specified node.
rosserver.app.get('/nodes/:nodeId?', function(req, res) {
  var nodeId = req.params.nodeId
  if (nodeId === undefined) {
    res.send(ros.nodes)
  }
  else {
    var node = ros.nodes.get(nodeId)
    res.send(node)
  }
})

// Creates or updates a node.
rosserver.app.put('/nodes/:nodeId', function(req, res){
  var nodeId = req.params.nodeId
    , node   = ros.nodes.get(nodeId)

  // Creates a node.
  if (node === undefined) {
    ros.createNode(req.body, function(error, node) {
      res.end()
    })
  }
  // Updates a node.
  else {
    node.set(req.body)
    res.end()
  }
})


// Publisher
// ---------

// Retrieves a collection of publishers or a specified publisher.
rosserver.app.get('/nodes/:nodeId/publishers/:publisherId?', function(req, res) {
  var nodeId      = req.params.nodeId
    , node        = ros.nodes.get(nodeId)
    , publisherId = req.params.publisherId

  if (publisherId === undefined) {
    res.send(node.get('publishers'))
  }
  else {
    res.send(node.get('publishers').get(publisherId))
  }
})

// Creates or updates a publisher.
rosserver.app.put('/nodes/:nodeId/publishers/:publisherId', function(req, res){
  var nodeId      = req.params.nodeId
    , node        = ros.nodes.get(nodeId)
    , publisherId = req.params.publisherId
    , publisher   = node.publishers.get(publisherId)

  // Creates a publisher.
  if (publisher === undefined) {

    // Creates an uninitialized Message based on the message type attribute as
    // the uninitialized Message object cannot be passed using JSON.
    var Message = req.body.Message
    if (Message === undefined && req.body.messageType) {
      var messageTypeComponents = req.body.messageType.split('/')
        , packageName           = messageTypeComponents[0]
        , messageType           = messageTypeComponents[1]
        , packageMessages       = rosserver.packages[packageName]

      req.body.Message = Message = packageMessages[messageType]
    }

    node.createPublisher(req.body, function(error, publisher) {
      var topic           = publisher.get('topic')
        , namespacedTopic = '/' + topic

      // Opens up a web socket for the publisher. The web socket is namespaced
      // for the publisher's topic.
      rosserver.io.of(namespacedTopic).on('connection', function(socket) {
        socket.on('message', function(data) {
          var message = new Message(data)
          publisher.publish(message, function(error) {
            console.log(error)
          })
        })
      })
      res.end()
    })
  }
  // Updates a publisher.
  else {
    publisher.set(req.body)
    res.end()
  }
})

// Deletes a publisher.
rosserver.app.del('/nodes/:nodeId/publishers/:publisherId', function(req, res) {
  var nodeId      = req.params.nodeId
    , node        = ros.nodes.get(nodeId)
    , publisherId = req.params.publisherId
    , publisher   = node.publishers.get(publisherId)

  node.removePublisher(publisher)
  res.end()
})


// Subscriber
// ----------

// Retrieves a collection of subscribers or a specified subscriber.
rosserver.app.get('/nodes/:nodeId/subscribers/:subscriberId?', function(req, res) {
  var nodeId       = req.params.nodeId
    , node         = ros.nodes.get(nodeId)
    , subscriberId = req.params.publisherId

  if (subscriberId === undefined) {
    res.send(node.get('subscribers'))
  }
  else {
    res.send(node.get('subscribers').get(subscriberId))
  }
})

// Creates or updates a subscriber.
rosserver.app.put('/nodes/:nodeId/subscribers/:subscriberId', function(req, res){
  var nodeId       = req.params.nodeId
    , node         = ros.nodes.get(nodeId)
    , subscriberId = req.params.subscriberId
    , subscriber   = node.subscribers.get(subscriberId)

  // Creates a subscriber.
  if (subscriber === undefined) {

    // Creates an uninitialized Message based on the message type attribute as
    // the uninitialized Message object cannot be passed using JSON.
    if (req.body.Message === undefined && req.body.messageType) {
      var messageTypeComponents = req.body.messageType.split('/')
        , packageName           = messageTypeComponents[0]
        , messageType           = messageTypeComponents[1]
        , packageMessages       = rosserver.packages[packageName]
        , Message               = packageMessages[messageType]

      req.body.Message = Message
      console.log(req.body)
    }

    node.createSubscriber(req.body, function(error, subscriber) {
      var topic           = subscriber.get('topic')
        , namespacedTopic = '/' + topic

      // Listens for messages over the web socket and emits a 'message' event
      // when received.
      rosserver.io.of(namespacedTopic).on('connection', function(socket) {
        subscriber.subscribe(function(error, message) {
          socket.emit('message', message)
        })
      })
      res.end()
    })
  }
  // Updates a subscriber.
  else {
    subscriber.set(req.body)
    res.end()
  }
})

// Deletes a subscriber.
rosserver.app.del('/nodes/:nodeId/subscribers/:subscriberId', function(req, res) {
  var nodeId       = req.params.nodeId
    , node         = ros.nodes.get(nodeId)
    , subscriberId = req.params.subscriberId
    , subscriber   = node.subscribers.get(subscriberId)

  node.removeSubscriber(subscriber)
  res.end()
})

// Start the web server and web sockets.
rosserver.start = function(port) {

  // Adds any specified directories to serve.
  for (var i = 0; i < rosserver.statics.length; i++) {
    var staticDirectory = rosserver.statics[i]
    rosserver.app.use(express.static(staticDirectory))
  }

  // Start the web server.
  rosserver.app.listen(port)

  // Start the web sockets server.
  rosserver.io = socketio.listen(rosserver.app)

  console.log('rosserver listening on port ' + port)
}

