var ctype  = require('ctype')
  , ros    = require('./ros')
  , fields = require('./messages/fields')

var tcpros = exports

tcpros.getPublishBuffer = function(connectionHeader) {
  var headerBuffer  = this.getBufferFromConnectionHeader(connectionHeader)
    , messageBuffer = this.getBufferFromMessage(connectionHeader.message)
    , bufferLength  = headerBuffer.length + messageBuffer.length
    , buffer        = new Buffer(bufferLength)

  headerBuffer.copy(buffer, 0, 0, headerBuffer.length)
  messageBuffer.copy(buffer, headerBuffer.length, 0, messageBuffer.length)

  return buffer
}

tcpros.getConnectionHeaderFromBuffer = function(buffer) {
  var connectionHeader = {}

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
      connectionHeader.topic = fieldValue
    }
    else if (fieldName === 'md5sum') {
      connectionHeader.md5sum = fieldValue
    }
    else if (fieldName === 'type') {
      connectionHeader.type = fieldValue
    }
    else if (fieldName === 'message_definition') {
      connectionHeader.message_definition = fieldValue
    }
    else if (fieldName === 'latching') {
      connectionHeader.latching = parseInt(fieldValue)
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
    headers.push({ key: 'topic', value: topic })
  }
  var type = connectionHeader.type
  if (type !== undefined) {
    headers.push({ key: 'type', value: type })
  }
  var md5sum = connectionHeader.md5sum
  if (md5sum !== undefined) {
    headers.push({ key: 'md5sum', value: md5sum })
  }

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

tcpros.getMessageFromBuffer = function(buffer, Message) {
  var message            = new Message()
    , headerLength       = 0
    , isConnectionHeader = false
    , messageLength      = ctype.ruint32(buffer, 'little', 0)
    , bufferOffset       = 4
    , fieldOrder         = message.get('fieldOrder')
    , fieldTypes         = message.get('fieldTypes')
    , fieldIndex         = 0

  // If the initial length is less than the buffer, than a connection header was
  // sent first as part of this buffer.
  if (messageLength < buffer.length - bufferOffset) {
    headerLength = messageLength
    bufferOffset += headerLength
    messageLength = ctype.ruint32(buffer, 'little', bufferOffset)
    bufferOffset += 4
  }
  // Checks if a connection header by looking for required attribute 'type'
  else {
    var bufferString = buffer.toString('utf8')
    if (bufferString.indexOf('type=') >= 0) {
      isConnectionHeader = true
      message = null
    }
  }

  // Populate the message if not a connection header
  if (!isConnectionHeader) {
    message = populateMessageFromBuffer(message, buffer, bufferOffset)
  }

  return message
}

function populateMessageFromBuffer(message, buffer, bufferOffset) {
  var fieldOrder = message.get('fieldOrder')
    , fieldTypes = message.get('fieldTypes')

  for (var fieldIndex = 0; fieldIndex < fieldOrder.length; fieldIndex++) {
    var fieldName  = fieldOrder[fieldIndex]
      , fieldType  = fieldTypes[fieldName]
      , fieldValue = null
      , fieldSize  = 0

    if (fields.isPrimitiveType(fieldType)) {
      fieldValue = fields.readFieldFromBuffer(fieldType, buffer, bufferOffset)
      fieldSize  = fields.getFieldSize(fieldType, fieldValue)
    }
    else if (fields.isArray(fieldType)) {

    }
    else if (fields.isMessageType(fieldType)) {
      var innerMessage = message.get(fieldName)
      fieldValue = populateMessageFromBuffer(innerMessage, buffer, bufferOffset)
      fieldSize  = fields.getFieldSize(fieldType, fieldValue)
    }

    bufferOffset += fieldSize

    var messageParam = {}
    messageParam[fieldName] = fieldValue
    message.set(messageParam)
  }

  return message
}

tcpros.getBufferFromMessage = function(message) {
  var fields      = []
    , fieldOrder  = message.get('fieldOrder')
    , fieldTypes  = message.get('fieldTypes')
    , fieldName   = null
    , fieldType   = null
    , fieldValue  = null
    , fieldSize   = null
    , messageSize = 0

  // Calculates the Buffer size
  for (var i = 0; i < fieldOrder.length; i++) {
    fieldName  = fieldOrder[i]
    fieldType  = fieldTypes[fieldName]
    fieldValue = message.get(fieldName)
    fieldSize  = fields.getFieldSize(fieldType, fieldValue)

    messageSize += fieldSize
  }

  var buffer       = new Buffer(messageSize + 4)
    , bufferOffset = 0
  ctype.wuint32(messageSize, 'little', buffer, bufferOffset)
  bufferOffset += 4

  // Populates the buffer with message content
  for (i = 0; i < fieldOrder.length; i++) {
    fieldName  = fieldOrder[i]
    fieldType  = fieldTypes[fieldName]
    fieldValue = message.get(fieldName)
    fieldSize  = fields.getFieldSize(fieldType, fieldValue)

    fields.writeFieldToBuffer(fieldType, fieldValue, buffer, bufferOffset)
    bufferOffset += fieldSize
  }

  return buffer
}

