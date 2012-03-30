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

function throwUnsupportedInt64Exception() {
  var error = new Error('int64 and uint64 are currently unsupported field types. See https://github.com/baalexander/rosnodejs/issues/2')
  throw error
}

