var _string = require('underscore.string')
  , fs      = require('fs')

var msgs = exports

msgs.createFromPackage = function(rosPackage, type, callback) {
  // Get the list of ROS packages/stack directories
  // Iterate through each directory (and subdirectories) looking for the package
  // Create file name based off package and msgs/<type>.msg

  var fileName = ''

  this.createFromFile(fileName, callback)
}

msgs.createFromFile = function(fileName, callback) {
  fs.readFile(fileName, 'utf8', function (error, data) {
    if (error) {
      callback(error, null)
    }
    else {
      msgs.createFromString(data, callback)
    }
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
        // Converts from String to type specified by message
        var fieldValue = _string.trim(fieldComponents[1])
        var parsedValue = fieldValue;
        if (fieldType.indexOf('int') >= 0) {
          parsedValue = parseInt(fieldValue)
        }
        else if (fieldType.indexOf('float') >= 0) {
          parsedValue = parseFloat(fieldValue)
        }
        else if (fieldType === 'bool') {
          if (fieldValue === '1') {
            parsedValue = true
          }
          else {
            parsedValue = false
          }
        }
        message[fieldName] = parsedValue
      }
    }
  }

  callback(null, message)
}
