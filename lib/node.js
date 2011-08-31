var url         = require('url')
  , xmlrpc      = require('xmlrpc')
  , portscanner = require('portscanner')
  , ros         = require('./ros')
  , environment = require('./environment')

ros.Node.prototype.save = function(attributes, options) {
  this.server = this.createSlaveServer()
  options.success()
}

ros.Node.prototype.createSlaveServer = function(uri) {
  var that = this

  var hostname = environment.getHostname()
  portscanner.findAPortNotInUse(9000, 9050, hostname, function(error, port) {

    var uriFields = { protocol: 'http', hostname: hostname, port: port }
      , uri       = url.format(uriFields)
    that.set({ uri: uri })

    var server = xmlrpc.createServer({ port: port })
    server.on('publisherUpdate', function(error, params, callback) {
      var callerId   = params[0]
        , topicName  = params[1]
        , publishers = params[2]

      if (topicName.length > 0 && topicName.charAt(0) === '/') {
        topicName = topicName.substr(1, topicName.length - 1)
      }

      var subscriber = that.subscribers.get(topicName)
      subscriber.publisherUpdate(publishers, function (error) {
        callback(error)
      })
    })
    server.on('requestTopic', function(error, params, callback) {
      var callerId  = params[0]
        , topicName = params[1]
        , protocols = params[2]

      if (topicName.length > 0 && topicName.charAt(0) === '/') {
        topicName = topicName.substr(1, topicName.length - 1)
      }

      var publisher = that.publishers.get(topicName)
      publisher.selectProtocol(protocols, function (error, protocolParams) {
        callback(error, protocolParams)
      })
    })
  })
}

