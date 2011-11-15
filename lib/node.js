var url         = require('url')
  , xmlrpc      = require('xmlrpc')
  , portscanner = require('portscanner')
  , ros         = require('./ros')
  , environment = require('./environment')

ros.Node.prototype.save = function(attributes, options) {
  this.server = this.createSlaveServer(function(error) {
    options.success()
  })
}

ros.Node.prototype.createSlaveServer = function(callback) {
  var that = this

  var hostname = environment.getHostname()
  portscanner.findAPortNotInUse(9000, 9050, hostname, function(error, port) {

    var uriFields = { protocol: 'http', hostname: hostname, port: port }
      , uri       = url.format(uriFields)
    that.set({ uri: uri })

    var server = xmlrpc.createServer(uri)
    server.on('getBusStats', function(error, params, callback) {
      console.log('GET BUS STATS')
      callback()
    })
    server.on('getBusInfo', function(error, params, callback) {
      console.log('GET BUS INFO')
      callback()
    })
    server.on('getMasterUri', function(error, params, callback) {
      console.log('GET MASTER URI')
      callback()
    })
    server.on('shutdown', function(error, params, callback) {
      console.log('SHUTDOWN')
      callback()
    })
    server.on('getPid', function(error, params, callback) {
      console.log('GET PID')
      var callerId = params[0]

      var code          = 1
        , statusMessage = 'Retrieved node PID'
        , pid           = process.pid
        , params        = [code, statusMessage, params]
      console.log(params)
      callback(null, params)
    })
    server.on('getSubscriptions', function(error, params, callback) {
      console.log('GET SUBSCRIPTIONS')
      callback()
    })
    server.on('getPublications', function(error, params, callback) {
      console.log('GET PUBLICATIONS')
      callback()
    })
    server.on('paramUpdate', function(error, params, callback) {
      console.log('PARAM UPDATE')
      callback()
    })
    server.on('publisherUpdate', function(error, params, callback) {
      console.log('PUBLISHER UPDATE')
      var callerId   = params[0]
        , topicName  = params[1]
        , publishers = params[2]

      if (topicName.length > 0 && topicName.charAt(0) === '/') {
        topicName = topicName.substr(1, topicName.length - 1)
      }

      var subscriber = that.subscribers.get(topicName)
      subscriber.publisherUpdate(publishers, function(error) {
        callback(error)
      })
    })
    server.on('requestTopic', function(error, params, callback) {
      console.log('REQUEST TOPIC')
      var callerId  = params[0]
        , topicName = params[1]
        , protocols = params[2]

      if (topicName.length > 0 && topicName.charAt(0) === '/') {
        topicName = topicName.substr(1, topicName.length - 1)
      }

      var publisher = that.publishers.get(topicName)
      publisher.selectProtocol(protocols, function(error, protocolParams) {
        console.log('LAST PP: ' + protocolParams)
        console.log(protocolParams)
        callback(error, protocolParams)
      })
    })

    callback(error)
  })
}

