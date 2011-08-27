var express  = require('express')
  , socketio = require('socket.io')
  , ros      = require('./rosnode')

var rosserver = express.createServer()

rosserver.configure(function() {
  rosserver.use(express.methodOverride())
  rosserver.use(express.bodyParser())
})

rosserver.use(express.static(__dirname + '/'))

// Nodes
// -----

var registerPublisher = function(publisher, publishers, options) {
  console.log('REGISTER PUBLISHER')
}

rosserver.get('/nodes/:nodeId?', function(req, res) {
  console.log('NODE GET')
  var nodeId = req.params.nodeId
  if (nodeId === undefined) {
    res.send(ros.nodes)
  }
  else {
    var node = ros.nodes.get(id)
    res.send(node)
  }
})

rosserver.put('/nodes/:nodeId', function(req, res){
  console.log('NODE PUT')
  var nodeId = req.params.nodeId
  var node = ros.nodes.get(nodeId)
  if (node === undefined) {
    ros.createNode(req.body, function(error, node) {
      node.publishers.bind('add', registerPublisher)
      res.end()
    })
  }
  else {
    node.set(req.body)
    res.end()
  }
})

// Publishers
// ----------

rosserver.get('/nodes/:nodeId/publishers/:publisherId?', function(req, res) {
  console.log('PUBLISHERS GET')
  var nodeId = req.params.nodeId
  var node = ros.nodes.get(nodeId)
  var publisherId = req.params.publisherId
  if (publisherId === undefined) {
    res.send(node.get('publishers'))
  }
  else {
    res.send(node.get('publishers').get(publisherId))
  }
})

rosserver.put('/nodes/:nodeId/publishers/:publisherId', function(req, res){
  console.log('PUBLISHERS PUT')
  var nodeId = req.params.nodeId
  var node = ros.nodes.get(nodeId)
  var publisherId = req.params.publisherId
  var publisher = node.publishers.get(publisherId)
  if (publisher === undefined) {
    node.createPublisher(req.body, function(error, publisher) {
      var topic = publisher.get('topic').get('name')
      var namespacedTopic = '/' + topic
      io.of(namespacedTopic).on('connection', function(socket) {
        socket.on('message', function(message) {
          console.log('PUBLISHERS PUT PUBLISH')
          console.log(message)
          publisher.publish(message)
        })
      })
      res.end()
    })
  }
  else {
    publisher.set(req.body)
    res.end()
  }
})

rosserver.del('/nodes/:nodeId/publishers/:publisherId', function(req, res) {
  console.log('PUBLISHERS DELETE')
  var nodeId = req.params.nodeId
  var node = ros.nodes.get(nodeId)
  var publisherId = req.params.publisherId
  var publisher = node.publishers.get(publisherId)
  node.removePublisher(publisher)
  res.end()
})

// Subscribers
// ----------

rosserver.get('/nodes/:nodeId/subscribers/:subscriberId?', function(req, res) {
  console.log('SUBSCRIBERS GET')
  var nodeId = req.params.nodeId
  var node = ros.nodes.get(nodeId)
  var subscriberId = req.params.publisherId
  if (subscriberId === undefined) {
    res.send(node.get('subscribers'))
  }
  else {
    res.send(node.get('subscribers').get(subscriberId))
  }
})

rosserver.put('/nodes/:nodeId/subscribers/:subscriberId', function(req, res){
  console.log('SUBSCRIBERS PUT')
  var nodeId = req.params.nodeId
  var node = ros.nodes.get(nodeId)
  var subscriberId = req.params.subscriberId
  var subscriber = node.subscribers.get(subscriberId)

  // Subscriber is being created
  if (subscriber === undefined) {
    node.createSubscriber(req.body, function(error, subscriber) {
      // Sends published messages to client over web sockets
      var topic = subscriber.get('topic').get('name')
      var namespacedTopic = '/' + topic
      io.of(namespacedTopic).on('connection', function(socket) {
        subscriber.subscribe(function(error, message) {
          console.log('SUBSCRIBERS PUT SUBSCRIBE')
          console.log(message)
          socket.emit('message', message)
        })
      })
      res.end()
    })
  }
  // Subscriber is being updated
  else {
    subscriber.set(req.body)
    res.end()
  }
})

rosserver.del('/nodes/:nodeId/subscribers/:subscriberId', function(req, res) {
  console.log('SUBSCRIBERS DELETE')
  var nodeId = req.params.nodeId
  var node = ros.nodes.get(nodeId)
  var subscriberId = req.params.subscriberId
  var subscriber = node.subscribers.get(subscriberId)
  node.removeSubscriber(subscriber)
  res.end()
})

rosserver.listen(3000);
var io = socketio.listen(rosserver)

console.log('rosserver listening on port 3000')

