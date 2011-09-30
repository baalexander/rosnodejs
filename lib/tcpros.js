var ctype = require('ctype')
  , ros   = require('./ros')

var tcpros = exports

tcpros.getPublishBuffer = function(connectionHeader) {
  var headerBuffer  = this.getBufferFromConnectionHeader(connectionHeader)
    , messageBuffer = this.getBufferFromMessage(connectionHeader.message)

  var buffer = new Buffer(headerBuffer.length + messageBuffer.length)
  headerBuffer.copy(buffer, 0, 0, headerBuffer.length)
  messageBuffer.copy(buffer, headerBuffer.length, 0, messageBuffer.length)

  return buffer
}

tcpros.getConnectionHeaderFromBuffer = function(buffer) {
  var connectionHeader = {}
  connectionHeader.topic   = new ros.Topic()
  connectionHeader.message = new ros.Message()

  var bufferOffset = 0
  var headerLength = ctype.ruint32(buffer, 'little', bufferOffset)
  bufferOffset += 4
  while (bufferOffset < headerLength) {
    var fieldLength = ctype.ruint32(buffer, 'little', bufferOffset)
    bufferOffset += 4
    var fieldStart      = bufferOffset
      , fieldEnd        = fieldStart + fieldLength
      , field           = buffer.toString('utf8', fieldStart, fieldEnd)
      , fieldComponents = field.split('=')
      , fieldName       = fieldComponents[0]
      , fieldValue      = fieldComponents[1]
    bufferOffset += fieldLength

    if (fieldName === 'callerid') {
      connectionHeader.callerId = fieldValue
    }
    else if (fieldName === 'topic') {
      connectionHeader.topic.set({ name: fieldValue })
    }
    else if (fieldName === 'md5sum') {
      connectionHeader.message.set({ md5sum: fieldValue })
    }
    else if (fieldName === 'type') {
      connectionHeader.message.set({ type: fieldValue })
    }
  }

  return connectionHeader
}

tcpros.getBufferFromConnectionHeader = function(connectionHeader) {
  var headers = []

  var callerId = connectionHeader.callerId
  if (callerId !== undefined) {
    headers.push({ key: 'callerid', value: callerId })
  }
  var topic = connectionHeader.topic
  if (topic !== undefined) {
    var topicName = '/' + topic.get('name')
    headers.push({ key: 'topic', value: topicName })
  }
  var message = connectionHeader.message
  if (message !== undefined)  {
    headers.push({ key: 'md5sum', value: message.get('md5sum') })
    headers.push({ key: 'type', value: message.get('type') })
  }

  var headerLength = 0
  for (var i = 0; i < headers.length; i++) {
    console.log(headers[i])
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

tcpros.getMessageFromBuffer = function(buffer) {

}

tcpros.getBufferFromMessage = function(message) {
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

