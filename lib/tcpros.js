var ctype = require('ctype')

var tcpros = exports

tcpros.getPublishBuffer = function(callerId, topic, message) {
  var connectionHeader = this.getConnectionHeader(callerId, topic, message)
    , messageBody      = this.getMessageBody(message)

  var buffer = new Buffer(connectionHeader.length + messageBody.length)
  connectionHeader.copy(buffer, 0, 0, connectionHeader.length)
  messageBody.copy(buffer, connectionHeader.length, 0, messageBody.length)

  return buffer
}

tcpros.getConnectionHeader = function(callerId, topic, message) {
  var topicName = '/' + topic.get('name')

  var headers = []
  headers.push({ key: 'callerid', value: callerId })
  headers.push({ key: 'md5sum', value: '992ce8a1687cec8c8bd883ec73ca41d1' })
  headers.push({ key: 'topic', value: topicName })
  headers.push({ key: 'type', value: 'std_msgs/String' })

  var headerLength = 0
  for (var i = 0; i < headers.length; i++) {
    headerLength += headers[i].key.length
    headerLength += headers[i].value.length
    headerLength += 1
    headerLength += 4
  }

  var buffer       = new Buffer(headerLength + 4)
    , bufferOffset = 0
  ctype.wuint32(headerLength, 'little', buffer, bufferOffset)
  bufferOffset += 4
  for (i = 0; i < headers.length; i++) {
    var headerKeyValue = headers[i].key + '=' + headers[i].value
    ctype.wuint32(headerKeyValue.length, 'little', buffer, bufferOffset)
    bufferOffset += 4
    bufferOffset += buffer.write(headerKeyValue, bufferOffset, 'ascii')
  }

  return buffer
}

tcpros.getMessageBody = function(message) {
  var body = []
  body.push(message.get('data'))

  var bodyLength = 0
  for (var i = 0; i < body.length; i++) {
    bodyLength += body[i].length
    // +4 for the field length (4 byte integer)
    bodyLength += 4
  }

  var buffer       = new Buffer(bodyLength + 4)
    , bufferOffset = 0
  ctype.wuint32(bodyLength, 'little', buffer, bufferOffset)
  bufferOffset += 4
  for (i = 0; i < body.length; i++) {
    ctype.wuint32(body[i].length, 'little', buffer, bufferOffset)
    bufferOffset += 4
    bufferOffset += buffer.write(body[i], bufferOffset, 'ascii')
  }

  return buffer
}

