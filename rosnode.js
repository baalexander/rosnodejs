var ros = require('./ros')
  , master = require('./lib/master')
  , xmlrpc = require('xmlrpc')

ros.Node.prototype.save = function(attributes, options) {
  console.log('ROSNODEJS NODE SAVE')
  this.server = createSlaveServer({ host: 'localhost', port: 9090 })
  options.success()
}

ros.Node.prototype.sync = function(method, model, options) {
  console.log('ROSNODEJS NODE SYNC')
  options.success()
}

ros.Publisher.prototype.save = function(attributes, options) {
  console.log('ROSNODEJS PUBLISHER SAVE')
  // STOPPED
  // Things to work on:
  // + this.get is failing
  // + Set the ID attribute for publisher on topic attribute save
  // + Store the URI of the node in the node
  // + Figure out way for publisher to know the node's URI
  // + Create a base ros.Message model
  //     Give Message a prototype field for type
  // + Have topic take ros.Message as a property
  //     Update Master to use topic's message type
  // + Make the URI host configurable
  // + Check for an available port in node
  master.registerPublisher(this.get('nodeId'), 'http://localhost:9090', this.get('topic'), function(error, value) {
    console.log('REGISTER PUBLISHER  RESPONSE FROM MASTER')
    if (error !== null) {
      options.error(error)
    }
    else {
      options.success()
    }
  })
}

ros.Publisher.prototype.sync = function(method, model, options) {
  console.log('ROSNODEJS PUBLISHER SYNC')
  options.success()
}

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

module.exports = ros

