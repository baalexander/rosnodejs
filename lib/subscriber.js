var http        = require('http')
  , net         = require('net')
  , url         = require('url')
  , xmlrpc      = require('xmlrpc')
  , ctype       = require('ctype')
  , portscanner = require('portscanner')
  , ros         = require('./ros')
  , environment = require('./environment')
  , master      = require('./master')

ros.Subscriber.prototype.save = function(attributes, options) {
  var nodeId    = this.get('nodeId')
    , node      = ros.nodes.get(nodeId)
    , nodeUri   = node.get('uri')
    , topic     = this.get('topic')

    console.log(nodeUri)
  master.registerSubscriber(nodeId, nodeUri, topic, function(error, value) {
    if (error !== null) {
    console.log(error)
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
    var uri       = publishers[i]
      , uriFields = url.parse(uri)
    uriFields.path = '/'

    var client = xmlrpc.createClient( { host: uri.hostname, port: uri.port, path: uri.path })
    client.call('requestTopic', [callerId, topicName, [['TCPROS']]], function(error, value) {
      var hostParams = value[2]
        , host       = hostParams[1]
        , port       = hostParams[2]

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

      socket.write(buffer)
    })
  }
  callback(null)
}

