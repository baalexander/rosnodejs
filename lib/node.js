var util       = require('util')
  , events     = require('events')
  , xmlrpc     = require('xmlrpc')
  , master     = require('./master')
  , Publisher  = require('./publisher')
  , Subscriber = require('./subscriber')

// Topic to Publisher/Subscriber pairs
var publications  = []
var subscriptions = []

function Node(name) {
  if (false === (this instanceof Node)) {
    return new Node(name);
  }
  this.name = name

  // Creates XML-RPC server
  this.server = createSlaveServer(this.getUri())
}


///////////////////////////////////////////////////////////////////////
// Node
///////////////////////////////////////////////////////////////////////

Node.prototype.getId = function() {
  return '/' + this.name;
}

Node.prototype.getUri = function() {
  return {
    host : 'localhost'
  , port : 9090
  }
}


///////////////////////////////////////////////////////////////////////
// Publisher
///////////////////////////////////////////////////////////////////////

Node.prototype.getPublishedTopics = function() {
  // Retrieves just the topic from the list of publications 
  var topics = []
  for (var i = 0; i < publications.length; i++) {
    topics.push(publications[i].topic)
  }
}

Node.prototype.createPublisher= function(topic) {
  var publisher = new Publisher(topic)
  this.addPublisherForTopic(topic, publisher)

  return publisher
}

Node.prototype.addPublisherForTopic = function(topic, publisher) {
  var that = this

  // Add Publisher to the list
  var index = indexOfPublication(topic)
  if (index < 0) {
    publications.push({ topic: topic, publisher: publisher })
  }
  else {
    publications[index].publisher = publisher
  }

  // Listen to events from the Publisher
  publisher.on('unregister', function(topic) {
    that.removePublisherForTopic(topic)
  })

  // Register Publisher with Master
  master.registerPublisher(this.getId(), this, topic, function(error, value) {
    console.log('REGISTER PUBLISHER  RESPONSE FROM MASTER')
    console.log('ERROR: ' + error)
    console.log('VALUE: ' + value)
  })
}

Node.prototype.removePublisherForTopic = function(topic) {
  var index = this.indexOfPublication(topic)
  if (index >= 0) {
    // Remove the Publisher from list
    this.publications.splice(index, 1)

    // Unregister Publisher with Master
    master.unregisterPublisher(this.getId(), this, topic, function(error, value) {
      console.log('UNREGISTER PUBLISHER RESPONSE FROM MASTER')
      console.log('ERROR: ' + error)
      console.log('VALUE: ' + value)
    })
  }
}

function indexOfPublication(topic) {
  var index = -1

  // Look for publications based off matching topic name
  for (var i = 0; i < publications.length && index === -1; i++) {
    var topicAndPublisher = publications[i]
    if (topicAndPublisher.topic.name === topic.name) {
      index = i;
    }
  }

  return index;
}

function publisherForTopic(topic) {
  var publisher = null

  // Retrieves the matching Publisher from the list of publications
  var index = indexOfPublication(topic)
  if (index >= 0) {
    publisher = publications[index].publisher
  }

  return publisher
}


///////////////////////////////////////////////////////////////////////
// Subscriber
///////////////////////////////////////////////////////////////////////

Node.prototype.getSubscribedTopics = function() {
  // Retrieves just the topic from the list of subscriptions
  var topics = []
  for (var i = 0; i < subscriptions.length; i++) {
    topics.push(subscriptions[i].topic)
  }
}

Node.prototype.createSubscriber = function(topic) {
  var subscriber = new Subscriber(topic)
  this.addSubscriberForTopic(topic, subscriber)

  return subscriber
}

Node.prototype.addSubscriberForTopic = function(topic, subscriber) {
  var that = this

  // Add Subscriber to the list
  var index = indexOfSubscription(topic)
  if (index < 0) {
    console.log('pushed!')
    subscriptions.push({ topic: topic, subscriber: subscriber })
  }
  else {
    subscriptions[index].subscriber = subscriber
  }

  // Listen to events from the Subscriber
  subscriber.on('unregister', function(topic) {
    that.removeSubscriberForTopic(topic)
  })

  // Register Subscriber with Master
  master.registerSubscriber(this.getId(), this, topic, function(error, value) {
    console.log('REGISTER SUBSCRIBER RESPONSE FROM MASTER')
    console.log('ERROR: ' + error)
    console.log('VALUE: ' + value)
  })
}

Node.prototype.removeSubscriberForTopic = function(topic) {
  var index = this.indexOSubscription(topic)
  if (index >= 0) {
    // Remove the Subscriber from list
    this.subscriptions.splice(index, 1)

    // Unregister Subscriber with Master
    master.unregisterSubscriber(this.getId(), this, topic, function(error, value) {
      console.log('UNREGISTER SUBSCRIBER RESPONSE FROM MASTER')
      console.log('ERROR: ' + error)
      console.log('VALUE: ' + value)
    })
  }
}

function indexOfSubscription(topic) {
  var index = -1

  // Look for subscription based off matching topic name
  for (var i = 0; i < subscriptions.length && index === -1; i++) {
    var topicAndSubscriber = subscriptions[i]
    console.log(topicAndSubscriber)
    if (topicAndSubscriber.topic.name === topic.name) {
      index = i;
    }
  }

  return index;
}

function subscriberForTopic(topic) {
  var subscriber = null

  // Retrieves the matching Subscriber from the list of subscriptions
  var index = indexOfSubscription(topic)
  if (index >= 0) {
    subscriber = subscriptions[index].subscriber
  }

  return subscriber
}


///////////////////////////////////////////////////////////////////////
// Slave API
///////////////////////////////////////////////////////////////////////

function createSlaveServer(uri) {
  var server = xmlrpc.createServer(uri)

  server.on('getSubscriptions', function(error, params, callback) {
    var callerId = params[0]
    console.log('GET SUBSCRIPTIONS CALLED')
    callback(null, subscriptions)
  })
  server.on('getPublications', function(error, params, callback) {
    var callerId = params[0]
    console.log('GET PUBLICATIONS CALLED')
    callback(null, publications)
  })
  server.on('getBusStats', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('GET BUS STATS CALLED')
    callback(null, [])
  })
  server.on('getBusInfo', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('GET BUS INFO CALLED')
    callback(null, [])
  })
  server.on('getMasterUri', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('GET MASTER URI CALLED')
    callback(null, [])
  })
  server.on('shutdown', function(error, params, callback) {
    var callerId = params[0]
    var message = params[1] || ''
    console.log(callerId)
    console.log(message)
    console.log('SHUTDOWN CALLED')
    callback(null, [])
  })
  server.on('getPid', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('GET PID CALLED')
    callback(null, [])
  })
  server.on('paramUpdate', function(error, params, callback) {
    var callerId       = params[0]
    var parameterKey   = params[1]
    var parameterValue = params[2]
    console.log(callerId)
    console.log(parameterKey)
    console.log(parameterValue)
    console.log('PARAM UPDATE CALLED')
    callback(null, [])
  })
  server.on('publisherUpdate', function(error, params, callback) {
    var callerId   = params[0]
    var topicName  = params[1]
    var publishers = params[2]
    console.log(callerId)
    console.log(topicName)
    console.log(publishers)
    console.log('PUBLISHER UPDATE CALLED')
    if (topicName.length > 0 && topicName.charAt(0) === '/') {
      topicName = topicName.substr(1, topicName.length - 1)
    }
    console.log(topicName)
    var subscriber = subscriberForTopic({ name: topicName})
    subscriber.publisherUpdate(publishers, function (error) {
      callback(error)
    })
  })
  server.on('requestTopic', function(error, params, callback) {
    var callerId  = params[0]
    var topic     = params[1]
    var protocols = params[2]
    console.log(callerId)
    console.log(topic)
    console.log(protocols)
    console.log('REQUEST TOPIC CALLED')

    var publisher = publisherForTopic(topic)
    publisher.selectProtocol(protocols, function (error, protocolParams) {
      callback(error, protocolParams)
    })
  })
}

module.exports = Node

