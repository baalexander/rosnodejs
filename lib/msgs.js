var _string = require('underscore.string')
  , fs      = require('fs')

var msgs = exports

// Take file name? Or package and message?
msgs.createFromFile = function(filename, callback) {
  fs.readFile(filename, 'utf8', function (error, data) {
    msgs.createFromString(data, callback)
  })
}

msgs.createFromString = function(string, callback) {
  var message = {}

  // Reads message definition line by line, adding property to object
  var lines = string.split('\n')
  for (var i = 0; i < lines.length; i++) {
    // Ignores empty lines
    var line = _string.trim(lines[i])
    if (line.length > 0) {
      var fieldComponents = line.split('=', 2)
      var field = fieldComponents[0].split(' ', 2)
      var fieldType = field[0]
      var fieldName = field[1]
      message[fieldName] = null

      // A constant value was specified for this field
      if (fieldComponents.length > 1) {
        var fieldValue = _string.trim(fieldComponents[1])
        message[fieldName] = fieldValue
      }
    }
  }

  callback(null, message)
}
