var express = require('express')
  , ros = require('./rosnode')

var app = express.createServer()

app.configure(function() {
  app.use(express.methodOverride())
  app.use(express.bodyParser())
})

app.use(express.static(__dirname + '/'))

// Nodes
// -----

var registerPublisher = function(publisher, publishers, options) {
  console.log('REGISTER PUBLISHER')
}

app.get('/nodes/:nodeId?', function(req, res) {
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

app.put('/nodes/:nodeId', function(req, res){
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

app.post('/nodes/:nodeId/publishers', function(req, res) {
  console.log('PUBLISHERS POST')
  var nodeId = req.params.nodeId
  var node = ros.nodes.get(nodeId)
  node.createPublisher(req.body, function(error, publisher) {
    
  })
  res.end()
})

app.get('/nodes/:nodeId/publishers/:publisherId?', function(req, res) {
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

app.put('/nodes/:nodeId/publishers/:publisherId', function(req, res){
  console.log('PUBLISHERS PUT')
  var nodeId = req.params.nodeId
  var node = ros.nodes.get(nodeId)
  var publisherId = req.params.publisherId
  var publisher = node.publishers.get(publisherId)
  if (publisher === undefined) {
    node.createPublisher(req.body, function(error, publisher) {
      res.end()
    })
  }
  else {
    publisher.set(req.body)
    res.end()
  }
})

app.del('/nodes/:nodeId/publishers/:publisherId', function(req, res) {
  console.log('PUBLISHERS DELETE')
  var nodeId = req.params.nodeId
  var node = ros.nodes.get(nodeId)
  var publisherId = req.params.publisherId
  var publisher = node.publishers.get(publisherId)
  node.removePublisher(publisher)
  res.end()
})

app.listen(3000);
console.log('Express server listening on port 3000');

