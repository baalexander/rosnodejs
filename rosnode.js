var ros = require('./ros')
  , master = require('./lib/master')
  , xmlrpc = require('xmlrpc')
  , http   = require('http')
  , net    = require('net')
  , url    = require('url')
  , ctype  = require('ctype')

ros.Node.prototype.save = function(attributes, options) {
  console.log('ROSNODEJS NODE SAVE')
  console.log(this)
  this.server = this.createSlaveServer({ host: 'localhost', port: 9090 })
  options.success()
}

ros.Node.prototype.sync = function(method, model, options) {
  console.log('ROSNODEJS NODE SYNC')
  options.success()
}

ros.Node.prototype.createSlaveServer = function(uri) {
  console.log('CREATE SLAVE SERVER')
  console.log(this)
  var that = this

  var server = xmlrpc.createServer(uri)

  server.on('publisherUpdate', function(error, params, callback) {
    console.log('SLAVE PUBLISHER UPDATE CALLED')
    console.log(that)
    var callerId   = params[0]
    var topicName  = params[1]
    var publishers = params[2]
    console.log(callerId)
    console.log(topicName)
    console.log(publishers)
    if (topicName.length > 0 && topicName.charAt(0) === '/') {
      topicName = topicName.substr(1, topicName.length - 1)
    }
    console.log(topicName)
    var subscriber = that.subscribers.get(topicName)
    console.log(subscriber)
    subscriber.publisherUpdate(publishers, function (error) {
      callback(error)
    })
  })

}

ros.Publisher.prototype.save = function(attributes, options) {
  console.log('ROSNODEJS PUBLISHER SAVE')
  master.registerPublisher(this.get('nodeId'), 'http://localhost:9090', this.get('topic'), function(error, value) {
    console.log('REGISTER PUBLISHER RESPONSE FROM MASTER')
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

ros.Subscriber.prototype.save = function(attributes, options) {
  console.log('ROSNODEJS SUBSCRIBER SAVE')
  master.registerSubscriber(this.get('nodeId'), 'http://localhost:9090', this.get('topic'), function(error, value) {
    console.log('REGISTER SUBSCRIBER RESPONSE FROM MASTER')
    if (error !== null) {
      options.error(error)
    }
    else {
      options.success()
    }
  })
}

ros.Subscriber.prototype.sync = function(method, model, options) {
  console.log('ROSNODEJS SUBSCRIBER SYNC')
  options.success()
}

ros.Subscriber.prototype.publisherUpdate = function(publishers, callback) {
  console.log('SUBSCRIBER PUBLISHER UPDATE')
  var that = this
  var nodeId = '/' + this.get('nodeId')
  var topic = this.get('topic')
  var topicName = topic.get('name')

  for (var i = 0; i < publishers.length; i++) {
    var uriString = publishers[i]
    var uri = url.parse(uriString)
    uri.path = '/'
    console.log(uri)
    var client = xmlrpc.createClient( { host: uri.hostname, port: uri.port, path: uri.path })
    client.call('requestTopic', [nodeId, topicName, [['TCPROS']]], function(error, value) {
      console.log(value)
      var hostParams = value[2]
      var host = hostParams[1]
      var port = hostParams[2]
      var options = { host: host, port: port }

      var headers = []
      headers.push({ key: 'callerid', value: nodeId })
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
      var buffer = new Buffer(totalHeaderLength + 4)
      console.log(totalHeaderLength + 4)
      ctype.wuint32(totalHeaderLength, 'little', buffer, bufferOffset)
      bufferOffset += 4
      for (var i = 0; i < headers.length; i++) {
        var headerKeyValue = headers[i].key + '=' + headers[i].value
        console.log(headerKeyValue)
        ctype.wuint32(headerKeyValue.length, 'little', buffer, bufferOffset)
        bufferOffset += 4
        bufferOffset += buffer.write(headerKeyValue, bufferOffset, 'ascii')
      }

      var socket = net.createConnection(port, host) 
      socket.on('data', function(data) {
        // Create Message from Topic type
        //  Knows to check for stdMsgs.js based on name?
        //  var Message = require(type[0])
        //  var message = new Message[type[1]]
        // Populate message using message.setFromData(data)
        var topic = that.get('topic')
        var messageType = topic.get('type')
        console.log(topic)
        console.log(messageType)
        console.log(data.length)
        console.log(data)
        console.log('RESPONSE: ' + data)
        that.trigger('message', data)
      })

      socket.end(buffer)
    })
  }
  callback(null)
}

function createSlaveServerOLD(uri) {
  var server = xmlrpc.createServer(uri)

  server.on('getSubscriptions', function(error, params, callback) {
    var callerId = params[0]
    console.log('SLAVE GET SUBSCRIPTIONS CALLED')
    callback(null, subscriptions)
  })
  server.on('getPublications', function(error, params, callback) {
    var callerId = params[0]
    console.log('SLAVE GET PUBLICATIONS CALLED')
    callback(null, publications)
  })
  server.on('getBusStats', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET BUS STATS CALLED')
    callback(null, [])
  })
  server.on('getBusInfo', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET BUS INFO CALLED')
    callback(null, [])
  })
  server.on('getMasterUri', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET MASTER URI CALLED')
    callback(null, [])
  })
  server.on('shutdown', function(error, params, callback) {
    var callerId = params[0]
    var message = params[1] || ''
    console.log(callerId)
    console.log(message)
    console.log('SLAVE SHUTDOWN CALLED')
    callback(null, [])
  })
  server.on('getPid', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET PID CALLED')
    callback(null, [])
  })
  server.on('paramUpdate', function(error, params, callback) {
    var callerId       = params[0]
    var parameterKey   = params[1]
    var parameterValue = params[2]
    console.log(callerId)
    console.log(parameterKey)
    console.log(parameterValue)
    console.log('SLAVE PARAM UPDATE CALLED')
    callback(null, [])
  })
  server.on('publisherUpdate', function(error, params, callback) {
    var callerId   = params[0]
    var topicName  = params[1]
    var publishers = params[2]
    console.log(callerId)
    console.log(topicName)
    console.log(publishers)
    console.log('SLAVE PUBLISHER UPDATE CALLED')
    if (topicName.length > 0 && topicName.charAt(0) === '/') {
      topicName = topicName.substr(1, topicName.length - 1)
    }
    console.log(topicName)
    var subscriber = ros.subscribers.get(topicName)
    console.log(subscriber)
    //var subscriber = subscriberForTopic({ name: topicName})
    //subscriber.publisherUpdate(publishers, function (error) {
    //  callback(error)
    //})
  })
  server.on('requestTopic', function(error, params, callback) {
    var callerId  = params[0]
    var topic     = params[1]
    var protocols = params[2]
    console.log(callerId)
    console.log(topic)
    console.log(protocols)
    console.log('SLAVE REQUEST TOPIC CALLED')

    var publisher = publisherForTopic(topic)
    publisher.selectProtocol(protocols, function (error, protocolParams) {
      callback(error, protocolParams)
    })
  })
}

module.exports = ros


function createSlaveServer(uri) {
  var server = xmlrpc.createServer(uri)

  server.on('getSubscriptions', function(error, params, callback) {
    var callerId = params[0]
    console.log('SLAVE GET SUBSCRIPTIONS CALLED')
    callback(null, subscriptions)
  })
  server.on('getPublications', function(error, params, callback) {
    var callerId = params[0]
    console.log('SLAVE GET PUBLICATIONS CALLED')
    callback(null, publications)
  })
  server.on('getBusStats', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET BUS STATS CALLED')
    callback(null, [])
  })
  server.on('getBusInfo', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET BUS INFO CALLED')
    callback(null, [])
  })
  server.on('getMasterUri', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET MASTER URI CALLED')
    callback(null, [])
  })
  server.on('shutdown', function(error, params, callback) {
    var callerId = params[0]
    var message = params[1] || ''
    console.log(callerId)
    console.log(message)
    console.log('SLAVE SHUTDOWN CALLED')
    callback(null, [])
  })
  server.on('getPid', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET PID CALLED')
    callback(null, [])
  })
  server.on('paramUpdate', function(error, params, callback) {
    var callerId       = params[0]
    var parameterKey   = params[1]
    var parameterValue = params[2]
    console.log(callerId)
    console.log(parameterKey)
    console.log(parameterValue)
    console.log('SLAVE PARAM UPDATE CALLED')
    callback(null, [])
  })
  server.on('publisherUpdate', function(error, params, callback) {
    var callerId   = params[0]
    var topicName  = params[1]
    var publishers = params[2]
    console.log(callerId)
    console.log(topicName)
    console.log(publishers)
    console.log('SLAVE PUBLISHER UPDATE CALLED')
    if (topicName.length > 0 && topicName.charAt(0) === '/') {
      topicName = topicName.substr(1, topicName.length - 1)
    }
    console.log(topicName)
    var subscriber = this.subscribers.get(topicName)
    console.log(subscriber)
    //var subscriber = subscriberForTopic({ name: topicName})
    //subscriber.publisherUpdate(publishers, function (error) {
    //  callback(error)
    //})
  })
  server.on('requestTopic', function(error, params, callback) {
    var callerId  = params[0]
    var topic     = params[1]
    var protocols = params[2]
    console.log(callerId)
    console.log(topic)
    console.log(protocols)
    console.log('SLAVE REQUEST TOPIC CALLED')

    var publisher = publisherForTopic(topic)
    publisher.selectProtocol(protocols, function (error, protocolParams) {
      callback(error, protocolParams)
    })
  })
}

function createSlaveServerOLD(uri) {
  var server = xmlrpc.createServer(uri)

  server.on('getSubscriptions', function(error, params, callback) {
    var callerId = params[0]
    console.log('SLAVE GET SUBSCRIPTIONS CALLED')
    callback(null, subscriptions)
  })
  server.on('getPublications', function(error, params, callback) {
    var callerId = params[0]
    console.log('SLAVE GET PUBLICATIONS CALLED')
    callback(null, publications)
  })
  server.on('getBusStats', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET BUS STATS CALLED')
    callback(null, [])
  })
  server.on('getBusInfo', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET BUS INFO CALLED')
    callback(null, [])
  })
  server.on('getMasterUri', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET MASTER URI CALLED')
    callback(null, [])
  })
  server.on('shutdown', function(error, params, callback) {
    var callerId = params[0]
    var message = params[1] || ''
    console.log(callerId)
    console.log(message)
    console.log('SLAVE SHUTDOWN CALLED')
    callback(null, [])
  })
  server.on('getPid', function(error, params, callback) {
    var callerId = params[0]
    console.log(callerId)
    console.log('SLAVE GET PID CALLED')
    callback(null, [])
  })
  server.on('paramUpdate', function(error, params, callback) {
    var callerId       = params[0]
    var parameterKey   = params[1]
    var parameterValue = params[2]
    console.log(callerId)
    console.log(parameterKey)
    console.log(parameterValue)
    console.log('SLAVE PARAM UPDATE CALLED')
    callback(null, [])
  })
  server.on('publisherUpdate', function(error, params, callback) {
    var callerId   = params[0]
    var topicName  = params[1]
    var publishers = params[2]
    console.log(callerId)
    console.log(topicName)
    console.log(publishers)
    console.log('SLAVE PUBLISHER UPDATE CALLED')
    if (topicName.length > 0 && topicName.charAt(0) === '/') {
      topicName = topicName.substr(1, topicName.length - 1)
    }
    console.log(topicName)
    var subscriber = ros.subscribers.get(topicName)
    console.log(subscriber)
    //var subscriber = subscriberForTopic({ name: topicName})
    //subscriber.publisherUpdate(publishers, function (error) {
    //  callback(error)
    //})
  })
  server.on('requestTopic', function(error, params, callback) {
    var callerId  = params[0]
    var topic     = params[1]
    var protocols = params[2]
    console.log(callerId)
    console.log(topic)
    console.log(protocols)
    console.log('SLAVE REQUEST TOPIC CALLED')

    var publisher = publisherForTopic(topic)
    publisher.selectProtocol(protocols, function (error, protocolParams) {
      callback(error, protocolParams)
    })
  })
}

module.exports = ros

