var ctype = require('ctype')

var tcpros = exports

tcpros.getPublishBuffer = function(callerId, topic, message) {
  var headers = getConnectionHeader(callerId, topic, message)
    , body    = getMessageBody(message)

  var headerLength = 0
  for (var i = 0; i < headers.length; i++) {
    // Example field format:
    // latching=1
    headerLength += headers[i].key.length
    headerLength += headers[i].value.length
    // +1 for the '='
    headerLength += 1
    // +4 for the field length (4 byte integer)
    headerLength += 4
  }

  var bodyLength = 0
  for (i = 0; i < body.length; i++) {
    bodyLength += body[i].length
    // +4 for the field length (4 byte integer)
    bodyLength += 4
  }

  // total length = header length + 4 (for the header size)
  //              + body length + 4 (for the body size)
  var totalLength  = headerLength + bodyLength + 4 + 4
    , buffer       = new Buffer(totalLength)
    , bufferOffset = 0

  // Sets the Connection Header
  ctype.wuint32(headerLength, 'little', buffer, bufferOffset)
  bufferOffset += 4
  for (i = 0; i < headers.length; i++) {
    var headerKeyValue = headers[i].key + '=' + headers[i].value
    ctype.wuint32(headerKeyValue.length, 'little', buffer, bufferOffset)
    bufferOffset += 4
    bufferOffset += buffer.write(headerKeyValue, bufferOffset, 'ascii')
  }

  // Sets the Message Body
  ctype.wuint32(bodyLength, 'little', buffer, bufferOffset)
  bufferOffset += 4
  for (i = 0; i < body.length; i++) {
    ctype.wuint32(body[i].length, 'little', buffer, bufferOffset)
    bufferOffset += 4
    bufferOffset += buffer.write(body[i], bufferOffset, 'ascii')
  }

  return buffer
}

function getConnectionHeader(callerId, topic, message) {
  var topicName = '/' + topic.get('name')

  var headers = []
  headers.push({ key: 'callerid', value: callerId })
  headers.push({ key: 'md5sum', value: '992ce8a1687cec8c8bd883ec73ca41d1' })
  headers.push({ key: 'topic', value: topicName })
  headers.push({ key: 'type', value: 'std_msgs/String' })

  return headers
}

function getMessageBody(message) {
  var body = []
  body.push(message.get('data'))

  return body
}

