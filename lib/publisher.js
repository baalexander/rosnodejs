var net         = require('net')
  , url         = require('url')
  , ctype       = require('ctype')
  , portscanner = require('portscanner')
  , ros         = require('./ros')
  , environment = require('./environment')
  , master      = require('./master')

ros.Publisher.prototype.save = function(attributes, options) {
  var that = this

  var nodeId  = this.get('nodeId')
    , node    = ros.nodes.get(nodeId)
    , nodeUri = node.get('uri')
    , topic   = this.get('topic')

  master.registerPublisher(nodeId, nodeUri, topic, function(error, value) {
    if (error !== null) {
      options.error(error)
    }
    else {
      var hostname = environment.getHostname()
      portscanner.findAPortNotInUse(9000, 9050, hostname, function(error, port) {

        var uriFields = { protocol: 'http', hostname: hostname, port: port }
          , uri       = url.format(uriFields)
        that.set({ uri: uri })

        that.server = net.createServer(function(socket) {
          socket.on('data', function(data) {
            console.log('' + data)
          })
          that.socket = socket
        })
        that.server.listen(port, hostname)
        options.success()
      })
    }
  })
}

ros.Publisher.prototype.publish = function(message, callback) {
  if (this.socket) {
    var nodeId  = this.get('nodeId')
      , topic   = this.get('topic')
      , topicName = '/' + topic.get('name')

    var headers = []
    headers.push({ key: 'callerid', value: nodeId })
    headers.push({ key: 'md5sum', value: '992ce8a1687cec8c8bd883ec73ca41d1' })
    headers.push({ key: 'topic', value: topicName })
    headers.push({ key: 'type', value: 'std_msgs/String' })

    var body = []
    body.push(message.get('data'))
    console.log('BODY:')
    console.log(body)

    var headerLength = 0
    for (var i = 0; i < headers.length; i++) {
      headerLength += headers[i].key.length
      headerLength += headers[i].value.length
      headerLength += 4
      headerLength += 1
    }

    var bodyLength = 0
    for (var j = 0; j < body.length; j++) {
      bodyLength += body[j].length
      bodyLength += 4
    }

    var totalLength  = headerLength + bodyLength + 4 + 4
      , bufferOffset = 0
      , buffer       = new Buffer(totalLength)
    ctype.wuint32(headerLength, 'little', buffer, bufferOffset)
    bufferOffset += 4
    for (var k = 0; k < headers.length; k++) {
      var headerKeyValue = headers[k].key + '=' + headers[k].value
      ctype.wuint32(headerKeyValue.length, 'little', buffer, bufferOffset)
      bufferOffset += 4
      bufferOffset += buffer.write(headerKeyValue, bufferOffset, 'ascii')
    }

    ctype.wuint32(bodyLength, 'little', buffer, bufferOffset)
    bufferOffset += 4
    for (var l = 0; l < body.length; l++) {
      ctype.wuint32(body[l].length, 'little', buffer, bufferOffset)
      bufferOffset += 4
      bufferOffset += buffer.write(body[l], bufferOffset, 'ascii')
    }

    console.log('' + buffer)
    this.socket.write(buffer)
  }
}

ros.Publisher.prototype.selectProtocol = function(protocols, callback) {
  var uri       = this.get('uri')
    , uriFields = url.parse(uri)
    , hostname  = uriFields.hostname
    , port      = parseInt(uriFields.port)
    , status    = 1
    , message   = 'ready on ' + uri
    , protocol  = ['TCPROS', hostname, port]

  callback(null, [status, message, protocol])
}

