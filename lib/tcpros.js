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

  while (fieldIndex < fieldOrder.length && !isConnectionHeader) {
    var fieldName  = fieldOrder[fieldIndex]
      , fieldType  = fieldTypes[fieldName]
      , fieldValue = null
      , fieldSize  = getFieldSize(fieldType)
    fieldIndex++

    if (fieldType === 'bool') {
      fieldValue = ctype.ruint8(buffer, 'little', bufferOffset)
    }
    else if (fieldType === 'int8') {
      fieldValue = ctype.rsint8(buffer, 'little', bufferOffset)
    }
    else if (fieldType === 'uint8') {
      fieldValue = ctype.ruint8(buffer, 'little', bufferOffset)
    }
    else if (fieldType === 'int16') {
      fieldValue = ctype.rsint16(buffer, 'little', bufferOffset)
    }
    else if (fieldType === 'uint16') {
      fieldValue = ctype.ruint16(buffer, 'little', bufferOffset)
    }
    else if (fieldType === 'int32') {
      fieldValue = ctype.rsint32(buffer, 'little', bufferOffset)
    }
    else if (fieldType === 'uint32') {
      fieldValue = ctype.ruint32(buffer, 'little', bufferOffset)
    }
    else if (fieldType === 'int64') {
      fieldValue = ctype.rsint64(buffer, 'little', bufferOffset)
    }
    else if (fieldType === 'uint64') {
      fieldValue = ctype.ruint64(buffer, 'little', bufferOffset)
    }
    else if (fieldType === 'float32') {
      fieldValue = ctype.rfloat(buffer, 'little', bufferOffset)
    }
    else if (fieldType === 'float64') {
      fieldValue = ctype.rdouble(buffer, 'little', bufferOffset)
    }
    else if (fieldType === 'string') {
      var fieldLength = ctype.ruint32(buffer, 'little', bufferOffset)
        , fieldStart  = bufferOffset + 4
        , fieldEnd    = fieldStart + fieldLength

      fieldValue = buffer.toString('utf8', fieldStart, fieldEnd)
      fieldSize  = getFieldSize(fieldType, fieldValue)
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
    , messageSize = 0

  console.log(fieldTypes)

  // Calculates the Buffer size
  for (var i = 0; i < fieldOrder.length; i++) {
    var fieldName  = fieldOrder[i]
      , fieldType  = fieldTypes[fieldName]
      , fieldValue = message.get(fieldName)
      , fieldSize  = getFieldSize(fieldType, fieldValue)

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
    fieldSize  = getFieldSize(fieldType, fieldValue)
    console.log('NAME:' + fieldName + 'TYPE:' + fieldType + 'VALUE:' + fieldValue + 'SIZE:' + fieldSize)

    if (fieldType === 'bool') {
      ctype.wuint8(fieldValue, 'little', buffer, bufferOffset)
      bufferOffset += fieldSize
    }
    else if (fieldType === 'int8') {
      ctype.wsint8(fieldValue, 'little', buffer, bufferOffset)
      bufferOffset += fieldSize
    }
    else if (fieldType === 'uint8') {
      ctype.wuint8(fieldValue, 'little', buffer, bufferOffset)
      bufferOffset += fieldSize
    }
    else if (fieldType === 'int16') {
      ctype.wsint16(fieldValue, 'little', buffer, bufferOffset)
      bufferOffset += fieldSize
    }
    else if (fieldType === 'uint16') {
      ctype.wuint16(fieldValue, 'little', buffer, bufferOffset)
      bufferOffset += fieldSize
    }
    else if (fieldType === 'int32') {
      ctype.wsint32(fieldValue, 'little', buffer, bufferOffset)
      bufferOffset += fieldSize
    }
    else if (fieldType === 'uint32') {
      ctype.wuint32(fieldValue, 'little', buffer, bufferOffset)
      bufferOffset += fieldSize
    }
    else if (fieldType === 'int64') {
      ctype.wsint64(fieldValue, 'little', buffer, bufferOffset)
      bufferOffset += fieldSize
    }
    else if (fieldType === 'uint64') {
      ctype.wuint64(fieldValue, 'little', buffer, bufferOffset)
      bufferOffset += fieldSize
    }
    else if (fieldType === 'float32') {
      ctype.wfloat(fieldValue, 'little', buffer, bufferOffset)
      bufferOffset += fieldSize
    }
    else if (fieldType === 'float64') {
      ctype.wdouble(fieldValue, 'little', buffer, bufferOffset)
      bufferOffset += fieldSize
    }
    else if (fieldType === 'string') {
      ctype.wuint32(fieldValue.length, 'little', buffer, bufferOffset)
      bufferOffset += 4
      bufferOffset += buffer.write(fieldValue, bufferOffset, 'ascii')
    }
  }

  return buffer
}

function getFieldSize(fieldType, fieldValue) {
  var fieldSize = 0

  if (fieldType === 'bool') {
    fieldSize = 1
  }
  else if (fieldType === 'int8') {
    fieldSize = 1
  }
  else if (fieldType === 'uint8') {
    fieldSize = 1
  }
  else if (fieldType === 'int16') {
    fieldSize = 2
  }
  else if (fieldType === 'uint16') {
    fieldSize = 2
  }
  else if (fieldType === 'int32') {
    fieldSize = 4
  }
  else if (fieldType === 'uint32') {
    fieldSize = 4
  }
  else if (fieldType === 'int64') {
    fieldSize = 8
  }
  else if (fieldType === 'uint64') {
    fieldSize = 8
  }
  else if (fieldType === 'float32') {
    fieldSize = 4
  }
  else if (fieldType === 'float64') {
    fieldSize = 8
  }
  else if (fieldType === 'string') {
    if (fieldValue !== undefined) {
      fieldSize = fieldValue.length + 4
    }
  }

  return fieldSize
}

