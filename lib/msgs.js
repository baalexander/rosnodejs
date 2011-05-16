var _string = require('underscore.string')
  , fs      = require('fs')

var msgs = exports

// Take file name? Or package and message?
msgs.createFromFile = function(filename, callback) {
  fs.readFile(filename, function (error, data) {
    createFromString(data, callback)
  })
}

msgs.createFromString = function(string, callback) {
  var message = {}

  // Reads message definition line by line, adding property to object
  var lines = string.split('\n')
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i]
    var fields = line.split(' ', 2)
    if (fields.length > 1) {
      var fieldType = fields[0]
      var fieldName = _string.trim(fields[1])

      // If an '=', then a constant value is being assigned
      if (_string.includes(fieldName, '=')) {
        constantValues = fieldName.split('=', 2)
        if (constantValues.length > 1) {
          message[constantValues[0]] = constantValues[1]
        }
      }
      // Create property only
      else {
        message[fieldName] = null
      }
    }
  }

  callback(null, message)
}
