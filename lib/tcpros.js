var net           = require('net')
  , url           = require('url')
  , EventEmitter2 = require('eventemitter2').EventEmitter2
  , portscanner   = require('portscanner')
  , environment   = require('./environment')
  , fieldsUtil    = require('./fields')
  ;

function TCPROS(nodeName, topicName, messageType) {
  if ((this instanceof TCPROS) === false) {
    return new TCPROS();
  }

  this.nodeName = nodeName;
  this.topicName = topicName;
  this.messageType = messageType;
}
TCPROS.prototype.__proto__ = EventEmitter2.prototype;

TCPROS.prototype.listen = function() {
  var that = this;

  var hostname = environment.getHostname()
  portscanner.findAPortNotInUse(9000, null, hostname, function(error, port) {
    var uriFields = { protocol: 'http', hostname: hostname, port: port }
      , uri       = url.format(uriFields)
      ;

    var server = net.createServer(function(socket) {
      socket.on('data', function(data) {
        var connectionHeader = getConnectionHeaderFromBuffer(data);

        var connectionHeaderResponse = {
          callerId : '/' + that.nodeName
        , topic    : '/' + that.topicName
        , type     : that.messageType.messageType
        , md5sum   : that.messageType.md5
        };
        var buffer = getBufferFromConnectionHeader(connectionHeaderResponse);
        socket.write(buffer);

        that.socket = socket;
        that.emit('connect');
      });
    });

    server.on('listening', function() {
      that.emit('listening', uri);
    });

    server.on('error', function(error) {
      that.emit('error', error);
    });

    server.listen(port, hostname);
  });
};

// TCPROS.prototype.createClient = function(port, host, subscriber) {
//   var that = this

//   this.socket = net.createConnection(port, host)
//   this.socket.on('data', function(data) {
//     var connectionHeader = getConnectionHeaderFromBuffer(data)

//     var message = getMessageFromBuffer(data, Message)
//     if (message !== null) {
//       that.emit('message', message)
//     }
//   })

//   // Sends a Connection Header to the socket to route to the correct publisher.
//   var nodeId      = '/' + subscriber.get('nodeId')
//     , topic       = '/' + subscriber.get('topic')
//     , Message     = subscriber.get('Message')
//     , message     = new Message()
//     , messageType = message.get('type')
//     , md5sum      = message.get('md5sum')

//   var connectionHeader = {
//     callerId : nodeId
//   , topic    : topic
//   , type     : messageType
//   , md5sum   : md5sum
//   }

//   var buffer = getBufferFromConnectionHeader(connectionHeader)
//   this.socket.write(buffer)
// }

TCPROS.prototype.publish = function(message) {
  var publish = function() {
    var messageBuffer = getBufferFromMessage(message);
    this.socket.write(messageBuffer);
  };

  if (!this.socket) {
    this.once('connect', publish);
  }
  else {
    publish();
  }
};

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

  return connectionHeader;
}

function getBufferFromConnectionHeader(connectionHeader) {
  var headers = [];

  var callerId = connectionHeader.callerId;
  if (callerId !== undefined) {
    headers.push({ key: 'callerid', value: callerId });
  }
  var topic = connectionHeader.topic;
  if (topic !== undefined) {
    headers.push({ key: 'topic', value: topic });
  }
  var type = connectionHeader.type;
  if (type !== undefined) {
    headers.push({ key: 'type', value: type });
  }
  var md5sum = connectionHeader.md5sum;
  if (md5sum !== undefined) {
    headers.push({ key: 'md5sum', value: md5sum });
  }

  var headerLength = 0;
  headers.forEach(function(header) {
    headerLength += header.key.length;
    headerLength += header.value.length;
    headerLength += 1;
    headerLength += 4;
  });

  var buffer       = new Buffer(headerLength + 4)
    , bufferOffset = 0
    ;
  buffer.writeUInt32LE(headerLength, bufferOffset);
  bufferOffset += 4;
  headers.forEach(function(header) {
    var headerKeyValue = header.key + '=' + header.value;
    buffer.writeUInt32LE(headerKeyValue.length, bufferOffset);
    bufferOffset += 4;
    bufferOffset += buffer.write(headerKeyValue, bufferOffset, 'ascii');
  });

  return buffer;
}

function getBufferFromMessage(message) {
  var bufferSize   = fieldsUtil.getMessageSize(message)
    , buffer       = new Buffer(bufferSize + 4)
    , bufferOffset = 0
    ;

  buffer.writeUInt32LE(bufferSize, bufferOffset);
  bufferOffset += 4;

  populateBufferFromMessage(message, buffer, bufferOffset);

  return buffer;
}

function populateBufferFromMessage(message, buffer, bufferOffset) {
  var fields = message.fields;

  fields.forEach(function(field) {
    var fieldValue = message[field.name];

    if (fieldsUtil.isPrimitive(field.type)) {
      fieldsUtil.serializePrimitive(field.type, fieldValue, buffer, bufferOffset);
      bufferOffset += fieldsUtil.getPrimitiveSize(field.type, fieldValue);
    }
    else if (fieldsUtil.isArray(field.type)) {
      buffer.writeUInt32LE(fieldValue.length, bufferOffset);
      bufferOffset += 4;

      var arrayType = fieldsUtil.getTypeOfArray(field.type);
      fieldValue.forEach(function(value) {
        if (fieldsUtil.isPrimitive(arrayType)) {
          fieldsUtil.serializePrimitive(arrayType, value, buffer, bufferOffset);
          bufferOffset += fieldsUtil.getPrimitiveSize(arrayType, value);
        }
        else if (fieldsUtil.isMessage(arrayType)) {
          populateBufferFromMessage(value, buffer, bufferOffset);
          bufferOffset += fieldsUtil.getMessageSize(value)
        }
      });
    }
    else if (fieldsUtil.isMessage(field.type)) {
      populateBufferFromMessage(fieldValue, buffer, bufferOffset)
      bufferOffset += fieldsUtil.getMessageSize(fieldValue)
    }
  });
}

// function deserializeMessage(buffer) {
//   var message            = new this.messageType()
//     , headerLength       = 0
//     , isConnectionHeader = false
//     , messageLength      = buffer.readUInt32LE(0)
//     , bufferOffset       = 4

//   // If the initial length is less than the buffer, than a connection header was
//   // sent first as part of this buffer.
//   if (messageLength < buffer.length - bufferOffset) {
//     headerLength = messageLength;
//     bufferOffset += headerLength;
//     messageLength = buffer.readUInt32LE(bufferOffset);
//     bufferOffset += 4;
//   }
//   // Checks if a connection header by looking for required attribute 'type'.
//   else {
//     var bufferString = buffer.toString('utf8');
//     if (bufferString.indexOf('type=') >= 0) {
//       isConnectionHeader = true;
//       message = null;
//     }
//   }

//   if (!isConnectionHeader) {
//     message = populateMessageFromBuffer(message, buffer, bufferOffset);
//   }

//   return message
// }

// function populateMessageFromBuffer(message, buffer, bufferOffset) {
//   var fields = message.fields;

//   fields.forEach(function(field) {
//     var fieldValue = message[field.name];

//     // If the field is a constant, do not read from buffer.
//     if (fieldValue === null || fieldValue instanceof Object) {

//       if (fieldsUtil.isPrimitive(field.type)) {
//         fieldValue = fieldsUtil.deserializePrimitive(field.type, buffer, bufferOffset)
//         bufferOffset += fieldsUtil.getPrimitiveSize(field.type, fieldValue)
//       }
//       else if (fieldsUtil.isArray(field.type)) {
//         var array     = []
//           , arraySize = buffer.readUInt32LE(bufferOffset)
//           , arrayType = fieldsUtil.getTypeOfArray(field.type)
//           ;
//         bufferOffset += 4;

//         for (var i = 0; i < arraySize; i++) {
//           if (fieldsUtil.isPrimitive(arrayFieldType)) {
//             var value = fieldsUtil.deserializePrimitive(arrayType, buffer, bufferOffset);
//             bufferOffset += fieldsUtil.getPrimitiveSize(arrayType, value);
//             array.push(value);
//           }
//           // STOPPED
//           // Inner messages are not defined. They should either be defined
//           // dynamically here or in messages.
//           // Leaning towards message.js bringing in sub messages too.
//           else if (fieldsUtil.isMessageType(arrayType)) {
//             var ArrayMessage = message.getMessageForField(fieldName)
//               , arrayMessage = new ArrayMessage()
//             arrayMessage = populateMessageFromBuffer(arrayMessage, buffer, bufferOffset);
//             bufferOffset += fieldsUtil.getMessageSize(arrayType, arrayMessage);
//             array.push(arrayMessage);
//           }
//         }

//         fieldValue = array
//       }
//       else if (fields.isMessage(field.type)) {
//         var innerMessage = message.get(fieldName)
//         fieldValue = populateMessageFromBuffer(innerMessage, buffer, bufferOffset)
//         bufferOffset += fields.getFieldSize(fieldType, fieldValue)
//       }

//       var messageParam = {};
//       messageParam[fieldName] = fieldValue;
//       message.set(messageParam);
//     }
//   }

//   return message;
// }

module.exports = TCPROS;

