var express  = require('express')
  , socketio = require('socket.io')
  , ros      = require('./rosnode')

var rosserver = express.createServer()

rosserver.configure(function() {
  rosserver.use(express.methodOverride())
  rosserver.use(express.bodyParser())
  rosserver.use(express.static(__dirname + '/'))
  rosserver.use(express.static(__dirname + '/../example/'))
})


/////////////////////////////////////////////////////////////////////////////
// ros.Node
/////////////////////////////////////////////////////////////////////////////

rosserver.get('/nodes/:nodeId?', function(req, res) {
  var nodeId = req.params.nodeId
  if (nodeId === undefined) {
    res.send(ros.nodes)
  }
  else {
    var node = ros.nodes.get(nodeId)
    res.send(node)
  }
})

rosserver.put('/nodes/:nodeId', function(req, res){
  var nodeId = req.params.nodeId
    , node   = ros.nodes.get(nodeId)

  if (node === undefined) {
    ros.createNode(req.body, function(error, node) {
      res.end()
    })
  }
  else {
    node.set(req.body)
    res.end()
  }
})


/////////////////////////////////////////////////////////////////////////////
// ros.Publisher
/////////////////////////////////////////////////////////////////////////////

rosserver.get('/nodes/:nodeId/publishers/:publisherId?', function(req, res) {
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

rosserver.put('/nodes/:nodeId/publishers/:publisherId', function(req, res){
  var nodeId      = req.params.nodeId
    , node        = ros.nodes.get(nodeId)
    , publisherId = req.params.publisherId
    , publisher   = node.publishers.get(publisherId)

  if (publisher === undefined) {
    node.createPublisher(req.body, function(error, publisher) {
      var topic           = publisher.get('topic').get('name')
        , namespacedTopic = '/' + topic

      io.of(namespacedTopic).on('connection', function(socket) {
        socket.on('message', function(message) {
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
  var nodeId      = req.params.nodeId
    , node        = ros.nodes.get(nodeId)
    , publisherId = req.params.publisherId
    , publisher   = node.publishers.get(publisherId)

  node.removePublisher(publisher)
  res.end()
})


/////////////////////////////////////////////////////////////////////////////
// ros.Subscriber
/////////////////////////////////////////////////////////////////////////////

rosserver.get('/nodes/:nodeId/subscribers/:subscriberId?', function(req, res) {
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

rosserver.put('/nodes/:nodeId/subscribers/:subscriberId', function(req, res){
  var nodeId       = req.params.nodeId
    , node         = ros.nodes.get(nodeId)
    , subscriberId = req.params.subscriberId
    , subscriber   = node.subscribers.get(subscriberId)

  if (subscriber === undefined) {
    node.createSubscriber(req.body, function(error, subscriber) {
      var topic           = subscriber.get('topic').get('name')
        , namespacedTopic = '/' + topic

      io.of(namespacedTopic).on('connection', function(socket) {
        subscriber.subscribe(function(error, message) {
          socket.emit('message', message)
        })
      })
      res.end()
    })
  }
  else {
    subscriber.set(req.body)
    res.end()
  }
})

rosserver.del('/nodes/:nodeId/subscribers/:subscriberId', function(req, res) {
  var nodeId       = req.params.nodeId
    , node         = ros.nodes.get(nodeId)
    , subscriberId = req.params.subscriberId
    , subscriber   = node.subscribers.get(subscriberId)

  node.removeSubscriber(subscriber)
  res.end()
})

rosserver.listen(3000)
var io = socketio.listen(rosserver)

console.log('rosserver listening on port 3000')

