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

TCPROS.prototype.createPublisher = function() {
  var that = this;

  var hostname = environment.getHostname()
  portscanner.findAPortNotInUse(9000, null, hostname, function(error, port) {
    var uriFields = { protocol: 'http', hostname: hostname, port: port }
      , uri       = url.format(uriFields)
      ;

    var server = net.createServer(function(socket) {
      socket.on('data', function(data) {
        var connectionHeader = deserializeConnectionHeader(data);

        var connectionHeaderResponse = {
          callerId : '/' + that.nodeName
        , topic    : '/' + that.topicName
        , type     : that.messageType.messageType
        , md5sum   : that.messageType.md5
        };
        var buffer = serializeConnectionHeader(connectionHeaderResponse);
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

TCPROS.prototype.createSubscriber = function(port, host, subscriber) {
  var that = this;

  this.socket = net.createConnection(port, host)
  this.socket.on('data', function(data) {
    var connectionHeader = deserializeConnectionHeader(data);
    var message = deserializeMessage(data, that.messageType);
    if (message !== null) {
      that.emit('message', message);
    }
  })

  var connectionHeader = {
    callerId : '/' + this.nodeName
  , topic    : '/' + this.topicName
  , type     : this.messageType.messageType
  , md5sum   : this.messageType.md5
  };

  var buffer = serializeConnectionHeader(connectionHeader);
  this.socket.write(buffer)
};

TCPROS.prototype.publish = function(message) {
  var publish = function() {
    var messageBuffer = serializeMessage(message);
    this.socket.write(messageBuffer);
  };

  if (!this.socket) {
    this.once('connect', publish);
  }
  else {
    publish();
  }
};

function deserializeConnectionHeader(buffer) {
  var connectionHeader = {};

  var bufferOffset = 0;
  var headerLength = buffer.readUInt32LE(bufferOffset);
  bufferOffset += 4;
  while (bufferOffset < headerLength) {
    var fieldLength = buffer.readUInt32LE(bufferOffset);
    bufferOffset += 4;
    var fieldStart      = bufferOffset
      , fieldEnd        = fieldStart + fieldLength
      , field           = buffer.toString('utf8', fieldStart, fieldEnd)
      , fieldComponents = field.split('=')
      , fieldName       = fieldComponents[0]
      , fieldValue      = fieldComponents[1]
      ;
    bufferOffset += fieldLength;

    if (fieldName === 'callerid') {
      connectionHeader.callerId = fieldValue;
    }
    else if (fieldName === 'topic') {
      connectionHeader.topic = fieldValue;
    }
    else if (fieldName === 'md5sum') {
      connectionHeader.md5sum = fieldValue;
    }
    else if (fieldName === 'type') {
      connectionHeader.type = fieldValue;
    }
    else if (fieldName === 'message_definition') {
      connectionHeader.message_definition = fieldValue;
    }
    else if (fieldName === 'latching') {
      connectionHeader.latching = parseInt(fieldValue);
    }
  }

  return connectionHeader;
}

function serializeConnectionHeader(connectionHeader) {
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

function serializeMessage(message) {
  var bufferSize   = fieldsUtil.getMessageSize(message)
    , buffer       = new Buffer(bufferSize + 4)
    , bufferOffset = 0
    ;

  buffer.writeUInt32LE(bufferSize, bufferOffset);
  bufferOffset += 4;

  serializeInnerMessage(message, buffer, bufferOffset);

  return buffer;
}

function serializeInnerMessage(message, buffer, bufferOffset) {
  message.fields.forEach(function(field) {
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
          serializeInnerMessage(value, buffer, bufferOffset);
          bufferOffset += fieldsUtil.getMessageSize(value)
        }
      });
    }
    else if (fieldsUtil.isMessage(field.type)) {
      serializeInnerMessage(fieldValue, buffer, bufferOffset)
      bufferOffset += fieldsUtil.getMessageSize(fieldValue)
    }
  });
}

function deserializeMessage(buffer, messageType) {
  var message            = new messageType()
    , headerLength       = 0
    , isConnectionHeader = false
    , messageLength      = buffer.readUInt32LE(0)
    , bufferOffset       = 4

  // If the initial length is less than the buffer, then a connection header was
  // sent first as part of this buffer.
  if (messageLength < buffer.length - bufferOffset) {
    headerLength = messageLength;
    bufferOffset += headerLength;
    messageLength = buffer.readUInt32LE(bufferOffset);
    bufferOffset += 4;
  }
  // Checks if a connection header by looking for required attribute 'type'.
  else {
    var bufferString = buffer.toString('utf8');
    if (bufferString.indexOf('type=') >= 0) {
      isConnectionHeader = true;
      message = null;
    }
  }

  if (!isConnectionHeader) {
    message = deserializeInnerMessage(message, buffer, bufferOffset);
  }

  return message;
}

function deserializeInnerMessage(message, buffer, bufferOffset) {
  message.fields.forEach(function(field) {
    var fieldValue = message[field.name];

    if (fieldsUtil.isPrimitive(field.type)) {
      fieldValue = fieldsUtil.deserializePrimitive(field.type, buffer, bufferOffset)
      bufferOffset += fieldsUtil.getPrimitiveSize(field.type, fieldValue)
    }
    else if (fieldsUtil.isArray(field.type)) {
      var array     = []
        , arraySize = buffer.readUInt32LE(bufferOffset)
        , arrayType = fieldsUtil.getTypeOfArray(field.type)
        ;
      bufferOffset += 4;

      for (var i = 0; i < arraySize; i++) {
        if (fieldsUtil.isPrimitive(arrayFieldType)) {
          var value = fieldsUtil.deserializePrimitive(arrayType, buffer, bufferOffset);
          bufferOffset += fieldsUtil.getPrimitiveSize(arrayType, value);
          array.push(value);
        }
        else if (fieldsUtil.isMessageType(arrayType)) {
          var arrayMessage = new field.messageType();
          arrayMessage = deserializeInnerMessage(arrayMessage, buffer, bufferOffset);
          bufferOffset += fieldsUtil.getMessageSize(arrayMessage);
          array.push(arrayMessage);
        }
      }
      fieldValue = array;
    }
    else if (fieldsUtil.isMessage(field.type)) {
      var innerMessage = new field.messageType();
      fieldValue = deserializeInnerMessage(innerMessage, buffer, bufferOffset);
      bufferOffset += fieldsUtil.getMessageSize(fieldValue);
    }

    message[field.name] = fieldValue;
  });

  return message;
};

module.exports = TCPROS;

