var http   = require('http')
  , net    = require('net')
  , url    = require('url')
  , xmlrpc = require('xmlrpc')
  , ctype  = require('ctype')
  , ros    = require('./ros')
  , master = require('./master')


/////////////////////////////////////////////////////////////////////////////
// ros.Node
/////////////////////////////////////////////////////////////////////////////

ros.Node.prototype.save = function(attributes, options) {
  this.server = this.createSlaveServer({ host: 'localhost', port: 9090 })
  options.success()
}

ros.Node.prototype.sync = function(method, model, options) {
  options.success()
}

ros.Node.prototype.createSlaveServer = function(uri) {
  var that = this

  var server = xmlrpc.createServer(uri)

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
}


/////////////////////////////////////////////////////////////////////////////
// ros.Publisher
/////////////////////////////////////////////////////////////////////////////

ros.Publisher.prototype.save = function(attributes, options) {
  var that = this

  var callerId  = this.get('nodeId')
    , callerUri = 'http://localhost:9090'
    , topic     = this.get('topic')

  master.registerPublisher(callerId, callerUri, topic, function(error, value) {
    if (error !== null) {
      options.error(error)
    }
    else {
      this.server = net.createServer(function(socket) {
        that.socket = socket
      })
      this.server.listen(10000, 'localhost')
      options.success()
    }
  })
}

ros.Publisher.prototype.sync = function(method, model, options) {
  options.success()
}

ros.Publisher.prototype.publish = function(message, callback) {
  if (this.socket) {
    this.socket.write(message)
  }
}

ros.Publisher.prototype.selectProtocol = function(protocols, callback) {
  callback(null, [1, 'ready on localhost:10000', ['TCPROS', 'localhost', 10000]])
}


/////////////////////////////////////////////////////////////////////////////
// ros.Subscriber
/////////////////////////////////////////////////////////////////////////////

ros.Subscriber.prototype.save = function(attributes, options) {
  var callerId  = this.get('nodeId')
    , callerUri = 'http://localhost:9090'
    , topic     = this.get('topic')

  master.registerSubscriber(callerId, callerUri, topic, function(error, value) {
    if (error !== null) {
      options.error(error)
    }
    else {
      options.success()
    }
  })
}

ros.Subscriber.prototype.sync = function(method, model, options) {
  options.success()
}

ros.Subscriber.prototype.publisherUpdate = function(publishers, callback) {
  var that = this

  var callerId  = '/' + this.get('nodeId')
    , topic     = this.get('topic')
    , topicName = topic.get('name')

  for (var i = 0; i < publishers.length; i++) {
    var uriString = publishers[i]
    var uri = url.parse(uriString)
    uri.path = '/'

    var client = xmlrpc.createClient( { host: uri.hostname, port: uri.port, path: uri.path })
    client.call('requestTopic', [callerId, topicName, [['TCPROS']]], function(error, value) {
      var hostParams = value[2]
        , host       = hostParams[1]
        , port       = hostParams[2]
        , options    = { host: host, port: port }

      var headers = []
      headers.push({ key: 'callerid', value: callerId })
      headers.push({ key: 'topic', value: '/' + topicName })
      headers.push({ key: 'md5sum', value: '992ce8a1687cec8c8bd883ec73ca41d1' })
      headers.push({ key: 'type', value: 'std_msgs/String' })

      var totalHeaderLength = 0
      for (var i = 0; i < headers.length; i++) {
        totalHeaderLength += headers[i].key.length
        totalHeaderLength += headers[i].value.length
        totalHeaderLength += 5
      }

      var bufferOffset = 0
        , buffer       = new Buffer(totalHeaderLength + 4)
      ctype.wuint32(totalHeaderLength, 'little', buffer, bufferOffset)
      bufferOffset += 4
      for (var j = 0; j < headers.length; j++) {
        var headerKeyValue = headers[j].key + '=' + headers[j].value
        ctype.wuint32(headerKeyValue.length, 'little', buffer, bufferOffset)
        bufferOffset += 4
        bufferOffset += buffer.write(headerKeyValue, bufferOffset, 'ascii')
      }

      var socket = net.createConnection(port, host) 
      socket.on('data', function(data) {
        var topic       = that.get('topic')
          , messageType = topic.get('type')
        that.trigger('message', '' + data)
      })

      socket.end(buffer)
    })
  }
  callback(null)
}

module.exports = ros

