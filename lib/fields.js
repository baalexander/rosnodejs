var fields = exports;

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
];

fields.isPrimitiveType = function(fieldType) {
  return (fields.primitiveTypes.indexOf(fieldType) >= 0);
}

var isArrayRegex = /.*\[*\]$/;
fields.isArray = function(fieldType) {
  return (fieldType.match(isArrayRegex) !== null);
}

fields.isMessageType = function(fieldType) {
  return !this.isPrimitiveType(fieldType) && !this.isArray(fieldType);
}

fields.parseField = function(fieldType, fieldValue) {
  var parsedValue = fieldValue;

  if (fieldType === 'bool') {
    parsedValue = (fieldValue === '1')
  }
  else if (fieldType === 'int8') {
    parsedValue = parseInt(fieldValue);
  }
  else if (fieldType === 'uint8') {
    parsedValue = parseInt(fieldValue);
    parsedValue = Math.abs(parsedValue);
  }
  else if (fieldType === 'int16') {
    parsedValue = parseInt(fieldValue);
  }
  else if (fieldType === 'uint16') {
    parsedValue = parseInt(fieldValue);
    parsedValue = Math.abs(parsedValue);
  }
  else if (fieldType === 'int32') {
    parsedValue = parseInt(fieldValue);
  }
  else if (fieldType === 'uint32') {
    parsedValue = parseInt(fieldValue);
    parsedValue = Math.abs(parsedValue);
  }
  else if (fieldType === 'int64') {
    throwUnsupportedInt64Exception();
  }
  else if (fieldType === 'uint64') {
    throwUnsupportedInt64Exception();
  }
  else if (fieldType === 'float32') {
    parsedValue = parseFloat(fieldValue);
  }
  else if (fieldType === 'float64') {
    parsedValue = parseFloat(fieldValue);
  }

  return parsedValue;
}

function throwUnsupportedInt64Exception() {
  var error = new Error('int64 and uint64 are currently unsupported field types. See https://github.com/baalexander/rosnodejs/issues/2');
  throw error;
}

