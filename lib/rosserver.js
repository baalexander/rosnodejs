var express  = require('express')
  , socketio = require('socket.io')
  , ros      = require('./rosnode')

var rosserver = exports

rosserver.packages = {}
rosserver.statics  = []

rosserver.app = express.createServer()

rosserver.app.configure(function() {
  rosserver.app.use(express.methodOverride())
  rosserver.app.use(express.bodyParser())
})


/////////////////////////////////////////////////////////////////////////////
// ros.Node
/////////////////////////////////////////////////////////////////////////////

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

rosserver.app.put('/nodes/:nodeId', function(req, res){
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

rosserver.app.put('/nodes/:nodeId/publishers/:publisherId', function(req, res){
  var nodeId      = req.params.nodeId
    , node        = ros.nodes.get(nodeId)
    , publisherId = req.params.publisherId
    , publisher   = node.publishers.get(publisherId)

  if (publisher === undefined) {
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

      rosserver.io.of(namespacedTopic).on('connection', function(socket) {
        socket.on('message', function(data) {
          var message = new Message(data)
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

rosserver.app.del('/nodes/:nodeId/publishers/:publisherId', function(req, res) {
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

rosserver.app.put('/nodes/:nodeId/subscribers/:subscriberId', function(req, res){
  var nodeId       = req.params.nodeId
    , node         = ros.nodes.get(nodeId)
    , subscriberId = req.params.subscriberId
    , subscriber   = node.subscribers.get(subscriberId)

  if (subscriber === undefined) {
    console.log(req.body)

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
      console.log('CREATE SUBSCRIBER')
      console.log(error)
      console.log(subscriber)

      var topic           = subscriber.get('topic')
        , namespacedTopic = '/' + topic

      rosserver.io.of(namespacedTopic).on('connection', function(socket) {
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

rosserver.app.del('/nodes/:nodeId/subscribers/:subscriberId', function(req, res) {
  var nodeId       = req.params.nodeId
    , node         = ros.nodes.get(nodeId)
    , subscriberId = req.params.subscriberId
    , subscriber   = node.subscribers.get(subscriberId)

  node.removeSubscriber(subscriber)
  res.end()
})

rosserver.start = function(port) {

  for (var i = 0; i < rosserver.statics.length; i++) {
    var staticDirectory = rosserver.statics[i]
    rosserver.app.use(express.static(staticDirectory))
  }

  rosserver.app.listen(port)
  rosserver.io = socketio.listen(rosserver.app)

  console.log('rosserver listening on port ' + port)
}

