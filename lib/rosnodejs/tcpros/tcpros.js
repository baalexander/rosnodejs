var EventEmitter  = require('events').EventEmitter
  , net           = require('net')
  , url           = require('url')
  , ctype         = require('ctype')
  , portscanner   = require('portscanner')
  , ros           = require('../rosnode')
  , environment   = require('../environment')
  , fields        = require('../messages/fields')

function TCPROS() {
  if (false === (this instanceof TCPROS)) {
    return new TCPROS()
  }
}
TCPROS.prototype.__proto__ = EventEmitter.prototype

TCPROS.prototype.createServer = function(port, hostname, publisher, callback) {
  var that = this

  hostname = hostname || environment.getHostname()
  portscanner.findAPortNotInUse(9000, 9050, hostname, function(error, port) {
    if (error) {
      callback(error)
    }
    else {
      var uriFields = { protocol: 'http', hostname: hostname, port: port }
        , uri       = url.format(uriFields)

      console.log('URIY! ' + uri)
      var server = net.createServer(function(socket) {
        console.log('SOCKET INITIATED')
        socket.on('data', function(data) {
          console.log('SOCKET CONNECTING')
          var connectionHeader = getConnectionHeaderFromBuffer(data)

          var nodeId      = '/' + publisher.get('nodeId')
            , topic       = '/' + publisher.get('topic')
            , Message     = publisher.get('Message')
            , message     = new Message()
            , messageType = message.get('type')
            , md5sum      = message.get('md5sum')

          var connectionHeader = {
            callerId : nodeId
          , topic    : topic
          , type     : messageType
          , md5sum   : md5sum
          }

          var buffer = getBufferFromConnectionHeader(connectionHeader)
          socket.write(buffer)
        })
        that.socket = socket
      })
      server.on('listening', function() {
        console.log('IS LISTENING')
        console.log('URI: ' + uri)
        callback(null, uri)
      })
      server.on('connection', function(socket) {
        console.log('CONNECTION BEGAN')
      })
      server.on('close', function() {
        console.log('CONNECTION CLOSE')
      })
      server.on('error', function(error) {
        console.log('CONNECTION ERROR')
        console.log(error)
      })
      console.log('LISTENING ON PORT: ' + port + ' HOSTNAME: ' + hostname)
      server.listen(port, hostname)
    }
  })
}

TCPROS.prototype.createClient = function(port, host, subscriber) {
  var that = this

  this.socket = net.createConnection(port, host)

  this.socket.on('data', function(data) {
    var connectionHeader = getConnectionHeaderFromBuffer(data)
    console.log(connectionHeader)
    var message = getMessageFromBuffer(data, Message)
    if (message !== null) {
      that.emit('message', message)
    }
  })

  var nodeId      = '/' + subscriber.get('nodeId')
    , topic       = '/' + subscriber.get('topic')
    , Message     = subscriber.get('Message')
    , message     = new Message()
    , messageType = message.get('type')
    , md5sum      = message.get('md5sum')

  var connectionHeader = {
    callerId : nodeId
  , topic    : topic
  , type     : messageType
  , md5sum   : md5sum
  }

  var buffer = getBufferFromConnectionHeader(connectionHeader)
  this.socket.write(buffer)
}

TCPROS.prototype.sendMessage = function(message, callback) {
  if (this.socket) {
    var messageBuffer = getBufferFromMessage(message)
    this.socket.write(messageBuffer)
    callback()
  }
  else {
    var error = new Error('Connection to socket not established.')
    callback(error)
  }
}

function getPublishBuffer(connectionHeader) {
  var headerBuffer  = this.getBufferFromConnectionHeader(connectionHeader)
    , messageBuffer = this.getBufferFromMessage(connectionHeader.message)
    , bufferLength  = headerBuffer.length + messageBuffer.length
    , buffer        = new Buffer(bufferLength)

  headerBuffer.copy(buffer, 0, 0, headerBuffer.length)
  messageBuffer.copy(buffer, headerBuffer.length, 0, messageBuffer.length)

  return buffer
}

function getConnectionHeaderFromBuffer(buffer) {
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

function getBufferFromConnectionHeader(connectionHeader) {
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

function getMessageFromBuffer(buffer, Message) {
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

function getBufferFromMessage(message) {
  var fieldOrder  = message.get('fieldOrder')
    , fieldTypes  = message.get('fieldTypes')
    , messageSize = 0

  // Calculates the Buffer size
  for (var i = 0; i < fieldOrder.length; i++) {
    var fieldName  = fieldOrder[i]
      , fieldType  = fieldTypes[fieldName]
      , fieldValue = message.get(fieldName)
      , fieldSize  = fields.getFieldSize(fieldType, fieldValue)

    messageSize += fieldSize
  }

  var buffer       = new Buffer(messageSize + 4)
    , bufferOffset = 0
  ctype.wuint32(messageSize, 'little', buffer, bufferOffset)
  bufferOffset += 4

  populateBufferFromMessage(message, buffer, bufferOffset)

  return buffer
}

function populateBufferFromMessage(message, buffer, bufferOffset) {
  var fieldOrder  = message.get('fieldOrder')
    , fieldTypes  = message.get('fieldTypes')

  // Populates the buffer with message content
  for (var i = 0; i < fieldOrder.length; i++) {
    var fieldName  = fieldOrder[i]
      , fieldType  = fieldTypes[fieldName]
      , fieldValue = message.get(fieldName)
      , fieldSize  = fields.getFieldSize(fieldType, fieldValue)

    if (fields.isPrimitiveType(fieldType)) {
      fields.writeFieldToBuffer(fieldType, fieldValue, buffer, bufferOffset)
    }
    else if (fields.isArray(fieldType)) {

    }
    else if (fields.isMessageType(fieldType)) {
      populateBufferFromMessage(fieldValue, buffer, bufferOffset)
    }

    bufferOffset += fieldSize
  }
}

module.exports = TCPROS

