// A set of functions for checking, reading, and writing ROS message fields,
// including built-in fields, array fields, and message fields.
var fields = exports

// An array of all the ROS Message primitive types.
fields.primitiveTypes = [
  'char'
, 'byte'
, 'bool'
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
, 'time'
, 'duration'
]

// Checks if the field is a built-in type.
//
// Examples: bool, string, and duration.
fields.isPrimitiveType = function(fieldType) {
  return (fields.primitiveTypes.indexOf(fieldType) >= 0)
}

// Checks if the field is an array.
//
// Examples: int8[] and geometry_msgs.Twist[6]
fields.isArray = function(fieldType) {
  // Looks for [] at the end. Can contain a number inside like float64[32].
  var regex = /.*\[*\]$/
  return (fieldType.match(regex) !== null)
}

// Checks if the field is a message type.
//
// Examples: std_msgs/String and geometry_msgs/Twist
fields.isMessageType = function(fieldType) {
  // Is considered a message type if not a primitive and not an array
  return !this.isPrimitiveType(fieldType) && !this.isArray(fieldType)
}

// Returns the field type for the array.
//
// Example: std_msgs/String[] returns std_msgs/String.
fields.getFieldTypeOfArray = function(arrayType) {
  return arrayType.split('[')[0]
}

// Converts the string value of a field to its JavaScript data type.
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

// Reads a primitive field from the buffer.
fields.readFieldFromBuffer = function(fieldType, buffer, bufferOffset) {
  var fieldValue = null

  if (fieldType === 'bool') {
    fieldValue = buffer.readUInt8(bufferOffset)
  }
  else if (fieldType === 'int8') {
    fieldValue = buffer.readInt8(bufferOffset)
  }
  else if (fieldType === 'uint8') {
    fieldValue = buffer.readUInt8(bufferOffset)
  }
  else if (fieldType === 'int16') {
    fieldValue = buffer.readInt16LE(bufferOffset)
  }
  else if (fieldType === 'uint16') {
    fieldValue = buffer.readUInt16LE(bufferOffset)
  }
  else if (fieldType === 'int32') {
    fieldValue = buffer.readInt32LE(bufferOffset)
  }
  else if (fieldType === 'uint32') {
    fieldValue = buffer.readUInt32LE(bufferOffset)
  }
  else if (fieldType === 'int64') {
    throwUnsupportedInt64Exception()
  }
  else if (fieldType === 'uint64') {
    throwUnsupportedInt64Exception()
  }
  else if (fieldType === 'float32') {
    fieldValue = buffer.readFloatLE(bufferOffset)
  }
  else if (fieldType === 'float64') {
    fieldValue = buffer.readDoubleLE(bufferOffset)
  }
  else if (fieldType === 'string') {
    var fieldLength = buffer.readUInt32LE(bufferOffset)
      , fieldStart  = bufferOffset + 4
      , fieldEnd    = fieldStart + fieldLength

    fieldValue = buffer.toString('utf8', fieldStart, fieldEnd)
  }

  return fieldValue
}

// Writes a primitive field to the buffer.
fields.writeFieldToBuffer = function(fieldType, fieldValue, buffer, bufferOffset) {
  if (fieldType === 'bool') {
    buffer.writeUInt8(fieldValue, bufferOffset)
  }
  else if (fieldType === 'int8') {
    buffer.writeInt8(fieldValue, bufferOffset)
  }
  else if (fieldType === 'uint8') {
    buffer.writeUInt8(fieldValue, bufferOffset)
  }
  else if (fieldType === 'int16') {
    buffer.writeInt16LE(fieldValue, bufferOffset)
  }
  else if (fieldType === 'uint16') {
    buffer.writeUInt16LE(fieldValue, bufferOffset)
  }
  else if (fieldType === 'int32') {
    buffer.writeInt32LE(fieldValue, bufferOffset)
  }
  else if (fieldType === 'uint32') {
    buffer.writeUInt32LE(fieldValue, bufferOffset)
  }
  else if (fieldType === 'int64') {
    throwUnsupportedInt64Exception()
  }
  else if (fieldType === 'uint64') {
    throwUnsupportedInt64Exception()
  }
  else if (fieldType === 'float32') {
    buffer.writeFloatLE(fieldValue, bufferOffset)
  }
  else if (fieldType === 'float64') {
    buffer.writeDoubleLE(fieldValue, bufferOffset)
  }
  else if (fieldType === 'string') {
    buffer.writeUInt32LE(fieldValue.length, bufferOffset)
    bufferOffset += 4
    buffer.write(fieldValue, bufferOffset, 'ascii')
  }
}

// Returns the size of a field in bytes. Includes primitive, array, and message
// type fields.
fields.getFieldSize = function(fieldType, fieldValue) {
  var fieldSize = 0

  if (this.isPrimitiveType(fieldType)) {
    return getPrimitiveFieldSize(fieldType, fieldValue)
  }
  else if (this.isArray(fieldType)) {
    return getArraySize(fieldType, fieldValue)
  }
  else if (this.isMessageType(fieldType)) {
    return getMessageSize(fieldValue)
  }

  return fieldSize
}

// Returns the size of a built-in field in bytes.
function getPrimitiveFieldSize(fieldType, fieldValue) {
  var fieldSize = 0

  if (fieldType === 'char') {
    fieldSize = 1
  }
  else if (fieldType === 'byte') {
    fieldSize = 1
  }
  else if (fieldType === 'bool') {
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
  else if (fieldType === 'time') {
    fieldSize = 8
  }
  else if (fieldType === 'duration') {
    fieldSize = 8
  }

  return fieldSize
}

// Returns the size of an array field in bytes.
function getArraySize(arrayType, array) {
  var arraySize      = 4
    , arrayFieldType = fields.getFieldTypeOfArray(arrayType)

  for (var i = 0; i < array.length; i++) {
    var value = array[i]
    arraySize += fields.getFieldSize(arrayFieldType, value)
  }

  return arraySize
}

// Returns the size of a message type field in bytes. This includes any inner
// messages in the calculation too.
function getMessageSize(message) {
  var messageSize = 0
    , fieldOrder  = message.get('fields')
    , fieldTypes  = message.get('fieldTypes')

  for (var fieldIndex = 0; fieldIndex < fieldOrder.length; fieldIndex++) {
    var fieldName  = fieldOrder[fieldIndex]
      , fieldType  = fieldTypes[fieldName]
      , fieldValue = message.get(fieldName)
      , fieldSize  = fields.getFieldSize(fieldType, fieldValue)

    messageSize += fieldSize
  }

  return messageSize
}

// 64-bit integers are not supported at this time.
function throwUnsupportedInt64Exception() {
  var error = new Error('int64 and uint64 are currently unsupported field types. See https://github.com/baalexander/rosnodejs/issues/2')
  throw error
}

