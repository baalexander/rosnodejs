var ctype = require('ctype')

var fields = exports

fields.primitiveTypes = [
  'bool'
, 'int8'
, 'uint8'
, 'int16'
, 'uint16'
, 'int32'
, 'uint32'
, 'int64'
, 'uint64'
, 'float32'
, 'float64'
, 'string'
]

fields.isPrimitiveType = function(fieldType) {
  return (fields.primitiveTypes.indexOf(fieldType) >= 0)
}

fields.isArray = function(fieldType) {
  // Looks for [] at the end. Can contain a number inside like float64[32].
  var regex = /.*\[*\]$/
  return (fieldType.match(regex) !== null)
}

fields.isMessageType = function(fieldType) {
  // Is considered a message type if not a primitive and not an array
  return !this.isPrimitiveType(fieldType) && !this.isArray(fieldType)
}

fields.parseField = function(fieldType, fieldValue) {
  var parsedValue = fieldValue

  if (fieldType === 'bool') {
    if (fieldValue === '1') {
      parsedValue = true
    }
    else {
      parsedValue = false
    }
  }
  else if (fieldType === 'int8') {
    parsedValue = parseInt(fieldValue)
  }
  else if (fieldType === 'uint8') {
    parsedValue = parseInt(fieldValue)
    parsedValue = Math.abs(parsedValue)
  }
  else if (fieldType === 'int16') {
    parsedValue = parseInt(fieldValue)
  }
  else if (fieldType === 'uint16') {
    parsedValue = parseInt(fieldValue)
    parsedValue = Math.abs(parsedValue)
  }
  else if (fieldType === 'int32') {
    parsedValue = parseInt(fieldValue)
  }
  else if (fieldType === 'uint32') {
    parsedValue = parseInt(fieldValue)
    parsedValue = Math.abs(parsedValue)
  }
  else if (fieldType === 'int64') {
    throwUnsupportedInt64Exception()
  }
  else if (fieldType === 'uint64') {
    throwUnsupportedInt64Exception()
  }
  else if (fieldType === 'float32') {
    parsedValue = parseFloat(fieldValue)
  }
  else if (fieldType === 'float64') {
    parsedValue = parseFloat(fieldValue)
  }

  return parsedValue
}

fields.readFieldFromBuffer = function(fieldType, buffer, bufferOffset) {
  var fieldValue = null

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
    throwUnsupportedInt64Exception()
  }
  else if (fieldType === 'uint64') {
    throwUnsupportedInt64Exception()
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
  }

  return fieldValue
}

fields.writeFieldToBuffer = function(fieldType, fieldValue, buffer, bufferOffset) {
  if (fieldType === 'bool') {
    ctype.wuint8(fieldValue, 'little', buffer, bufferOffset)
  }
  else if (fieldType === 'int8') {
    ctype.wsint8(fieldValue, 'little', buffer, bufferOffset)
  }
  else if (fieldType === 'uint8') {
    ctype.wuint8(fieldValue, 'little', buffer, bufferOffset)
  }
  else if (fieldType === 'int16') {
    ctype.wsint16(fieldValue, 'little', buffer, bufferOffset)
  }
  else if (fieldType === 'uint16') {
    ctype.wuint16(fieldValue, 'little', buffer, bufferOffset)
  }
  else if (fieldType === 'int32') {
    ctype.wsint32(fieldValue, 'little', buffer, bufferOffset)
  }
  else if (fieldType === 'uint32') {
    ctype.wuint32(fieldValue, 'little', buffer, bufferOffset)
  }
  else if (fieldType === 'int64') {
    throwUnsupportedInt64Exception()
  }
  else if (fieldType === 'uint64') {
    throwUnsupportedInt64Exception()
  }
  else if (fieldType === 'float32') {
    ctype.wfloat(fieldValue, 'little', buffer, bufferOffset)
  }
  else if (fieldType === 'float64') {
    ctype.wdouble(fieldValue, 'little', buffer, bufferOffset)
  }
  else if (fieldType === 'string') {
    ctype.wuint32(fieldValue.length, 'little', buffer, bufferOffset)
    bufferOffset += 4
    buffer.write(fieldValue, bufferOffset, 'ascii')
  }
}

fields.getFieldSize = function(fieldType, fieldValue) {
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

function throwUnsupportedInt64Exception() {
  var error = new Error('int64 and uint64 are currently unsupported field types. See https://github.com/baalexander/rosnodejs/issues/2')
  throw error
}


