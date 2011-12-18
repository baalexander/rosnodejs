// Registers Publishers and Subscribers with ROS Master and helps negotiate
// connections with other Nodes. While the Node itself is not a Publisher or
// Subscriber, it contains a collection of each and acts as the contact point
// for them and ROS Master.
//
// Node.js extends the core Node model to communicate with ROS directly.
var url         = require('url')
  , xmlrpc      = require('xmlrpc')
  , portscanner = require('portscanner')
  , ros         = require('../public/ros')
  , environment = require('./environment')

// Creates an XML-RPC server to handle the ROS Slave API calls.
ros.Node.prototype.save = function(attributes, options) {
  this.server = this.createSlaveServer(function(error) {
    options.success()
  })
}

// Starts an XML-RPC server at an available port and listens for method calls
// for the ROS Slave API.
ros.Node.prototype.createSlaveServer = function(callback) {
  var that = this

  var hostname = environment.getHostname()

  // Finds an available port to start the XML-RPC server.
  portscanner.findAPortNotInUse(9000, null, hostname, function(error, port) {

    var uriFields = { protocol: 'http', hostname: hostname, port: port }
      , uri       = url.format(uriFields)
    that.set({ uri: uri })

    // Creates an XML-RPC server listening at the given URI.
    var server = xmlrpc.createServer(uri)

    // Retrieves transport/topic statistics.
    server.on('getBusStats', function(error, params, callback) {
      callback()
    })

    // Retrieves transport/topic connection information.
    server.on('getBusInfo', function(error, params, callback) {
      callback()
    })

    // Gets the URI of the Master node.
    server.on('getMasterUri', function(error, params, callback) {
      callback()
    })


    // Stops this XML-RPC server.
    server.on('shutdown', function(error, params, callback) {
      callback()
    })

    // Gets the Process ID of this XML-RPC server.
    server.on('getPid', function(error, params, callback) {
      var callerId = params[0]

      var code          = 1
        , statusMessage = 'Retrieved node PID'
        , pid           = process.pid
        , params        = [code, statusMessage, params]
      callback(null, params)
    })

    // Returns a list of topics the Node currently subscribes to.
    server.on('getSubscriptions', function(error, params, callback) {
      callback()
    })

    // Returns a list of topics the Node currently publishes.
    server.on('getPublications', function(error, params, callback) {
      callback()
    })

    // Callback from Master with updated value of subscribed parameter.
    server.on('paramUpdate', function(error, params, callback) {
      callback()
    })

    // Callback from Master with the current list of publishers for a topic.
    // Informs any Subscribers for the given topic of the updated list of
    // publishers.
    server.on('publisherUpdate', function(error, params, callback) {
      var callerId   = params[0]
        , topicName  = params[1]
        , publishers = params[2]

      if (topicName.length > 0 && topicName.charAt(0) === '/') {
        topicName = topicName.substr(1, topicName.length - 1)
      }

      // If there's currently a Subscriber for the topic, passes on the updated
      // list of Publishers for the topic.
      var subscriber = that.subscribers.get(topicName)
      subscriber.publisherUpdate(publishers, function(error) {
        callback(error)
      })
    })

    // A 'requestTopic' call is sent by a Subscriber node to a Publisher node to
    // negotiate the protocol for the Publisher to send messages on.
    //
    // The preferred protocol params are passed to the Publisher of the
    // specified topic.
    server.on('requestTopic', function(error, params, callback) {
      var callerId  = params[0]
        , topicName = params[1]
        , protocols = params[2]

      if (topicName.length > 0 && topicName.charAt(0) === '/') {
        topicName = topicName.substr(1, topicName.length - 1)
      }

      // If there's currently a Publisher for the topic, passes the protocol
      // options to that Publisher.
      var publisher = that.publishers.get(topicName)
      publisher.selectProtocol(protocols, function(error, protocolParams) {
        callback(error, protocolParams)
      })
    })

    callback(error)
  })
}

