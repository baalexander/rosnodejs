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

module.exports = TCPROS;

