var util       = require('util')
  , events     = require('events')
  , xmlrpc     = require('xmlrpc')
  , master     = require('./master')
  , Publisher  = require('./publisher')
  , Subscriber = require('./subscriber')

var publications  = []
var subscriptions = []

function Node(name) {
  if (false === (this instanceof Node)) {
    return new Node(name);
  }

  this.name = name

  // Creates XML-RPC server
  this.server = createSlaveServer(this.getUri())

  // Events handled
  events.EventEmitter.call(this);

  // Topics
  // Publishing
  this.on('published', function(topic) {
    publications.push(topic)
    console.log('PUBLISHED: ' + publications)
  })
  this.on('unpublished', function(topic) {
    var topicIndex = publications.indexOf(topic)
    if (topicIndex >= 0) {
      publications.splice(topicIndex, 1)
    }
    console.log('UNPUBLISHED: ' + publications)
  })

  // Subscribing
  this.on('subscribed', function(topic) {
    subscriptions.push(topic)
    console.log('SUBSCRIBED: ' + subscriptions)
  })

}
util.inherits(Node, events.EventEmitter)

Node.prototype.createPublisher = function() {
  return new Publisher(this)
}

Node.prototype.createSubscriber = function() {
  return new Subscriber(this)
}

Node.prototype.getId = function() {
  return '/' + this.name;
}

Node.prototype.getUri = function() {
  return {
    host : 'localhost'
  , port : 9090
  }
}

function createSlaveServer(uri) {
  var server = xmlrpc.createServer(uri)

  server.on('getSubscriptions', function(error, params, callback) {
    var callerId = params[0]
    callback(null, subscriptions)
  })
  server.on('getPublications', function(error, params, callback) {
    var callerId = params[0]
    callback(null, publications)
  })
}

module.exports = Node

