// Handles sending and receiving messages using the TCPROS transport layer.
// Message data is passed over over TCP/IP sockets.
var EventEmitter = require('events').EventEmitter
  , net          = require('net')
  , url          = require('url')
  , portscanner  = require('portscanner')
  , ros          = require('./rosnode')
  , environment  = require('./environment')
  , fields       = require('./fields')

function TCPROS() {
  if (false === (this instanceof TCPROS)) {
    return new TCPROS()
  }
}
TCPROS.prototype.__proto__ = EventEmitter.prototype

// Creates a TCP server to publish messages on.
TCPROS.prototype.createServer = function(publisher, callback) {
  var that = this

  var hostname = environment.getHostname()
  portscanner.findAPortNotInUse(9000, null, hostname, function(error, port) {
    if (error) {
      callback(error)
    }
    else {
      var uriFields = { protocol: 'http', hostname: hostname, port: port }
        , uri       = url.format(uriFields)

      var server = net.createServer(function(socket) {
        // The subscriber initially sends a Connection Header for routing to the
        // correct publisher. The publisher confirms success by replying with
        // the required fields.
        socket.on('data', function(data) {
          // The subscriber sends a Connection Header for routing to the correct
          // publisher.
          var connectionHeader = getConnectionHeaderFromBuffer(data)

          var nodeId      = '/' + publisher.get('nodeId')
            , topic       = '/' + publisher.get('topic')
            , Message     = publisher.get('Message')
            , message     = new Message()
            , messageType = message.get('type')
            , md5sum      = message.get('md5sum')

          // Confirms a successful connection by passing back the confirmed
          // fields.
          var connectionHeaderResponse = {
            callerId : nodeId
          , topic    : topic
          , type     : messageType
          , md5sum   : md5sum
          }

          var buffer = getBufferFromConnectionHeader(connectionHeaderResponse)
          socket.write(buffer)
        })
        that.socket = socket
      })
      server.on('listening', function() {
        callback(null, uri)
      })
      server.on('connection', function(socket) {

      })
      server.on('close', function() {

      })
      server.on('error', function(error) {
        console.error(error)
      })
      server.listen(port, hostname)
    }
  })
}

// Connects to a TCP server for subscribing to messages on.
TCPROS.prototype.createClient = function(port, host, subscriber) {
  var that = this

  this.socket = net.createConnection(port, host)

  // Receives a message from the publisher.
  this.socket.on('data', function(data) {
    // After the client sends a Connection Header for routing, the server sends
    // a Connection Header back confirming success.
    var connectionHeader = getConnectionHeaderFromBuffer(data)

    var message = getMessageFromBuffer(data, Message)
    if (message !== null) {
      that.emit('message', message)
    }
  })

  // Sends a Connection Header to the socket to route to the correct publisher.
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

// Sends a message over the socket to the client.
TCPROS.prototype.sendMessage = function(message, callback) {
  // A socket may not have been initialized.
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
  var headerLength = buffer.readUInt32LE(bufferOffset)
  bufferOffset += 4
  while (bufferOffset < headerLength) {
    var fieldLength = buffer.readUInt32LE(bufferOffset)
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
  buffer.writeUInt32LE(headerLength, bufferOffset)
  bufferOffset += 4
  for (i = 0; i < headers.length; i++) {
    var headerKeyValue = headers[i].key + '=' + headers[i].value
    buffer.writeUInt32LE(headerKeyValue.length, bufferOffset)
    bufferOffset += 4
    bufferOffset += buffer.write(headerKeyValue, bufferOffset, 'ascii')
  }

  return buffer
}

function getMessageFromBuffer(buffer, Message) {
  var message            = new Message()
    , headerLength       = 0
    , isConnectionHeader = false
    , messageLength      = buffer.readUInt32LE(0)
    , bufferOffset       = 4
    , fieldOrder         = message.get('fieldOrder')
    , fieldTypes         = message.get('fieldTypes')
    , fieldIndex         = 0

  // If the initial length is less than the buffer, than a connection header was
  // sent first as part of this buffer.
  if (messageLength < buffer.length - bufferOffset) {
    headerLength = messageLength
    bufferOffset += headerLength
    messageLength = buffer.readUInt32LE(buffer, 'little', bufferOffset)
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
  buffer.writeUInt32(messageSize, bufferOffset)
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

