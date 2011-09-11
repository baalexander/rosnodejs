var _string     = require('underscore.string')
  , fs          = require('fs')
  , crypto      = require('crypto')
  , environment = require('./environment')

var msgs = exports

msgs.createFromType = function(type, callback) {
  var that = this

  var typeComponents = type.split('/')
  var rosPackage = typeComponents[0]
  var name = typeComponents[1]

  // Create file name based off package and msgs/<type>.msg
  environment.getRosPackagePath(rosPackage, function(error, packagePath) {
    var filePath = packagePath + '/msg/' + name + '.msg'
    that.createFromFile(filePath, function(error, message) {
      if (message !== null) {
        message.specification.type = type
      }
      callback(error, message)
    })
  })
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
  message.specification = { }
  message.specification.type = null
  message.specification.md5sum = null
  message.specification.fields = []
  message.specification.constants = []

  // Reads message definition line by line, adding property to object
  var lines = string.split('\n')
  for (var i = 0; i < lines.length; i++) {
    // Ignores empty lines
    var line = _string.trim(lines[i])
    if (line.length > 0) {
      // Line format:
      // type name
      // or
      // type name=value
      var lineComponents = line.split('=', 2)
      var fieldComponents = lineComponents[0].split(' ', 2)
      var field = { }
      field.type = fieldComponents[0]
      field.name = fieldComponents[1]
      message[field.name] = null

      // No constant was specified
      if (lineComponents.length === 1) {
        message.specification.fields.push(field)
      }
      // A constant value was specified for this field
      else if (lineComponents.length > 1) {
        // Converts from String to type specified by message
        field.value = _string.trim(lineComponents[1])
        if (field.type.indexOf('int') >= 0) {
          field.value = parseInt(field.value)
        }
        else if (field.type.indexOf('float') >= 0) {
          field.value = parseFloat(field.value)
        }
        else if (field.type === 'bool') {
          if (field.value === '1') {
            field.value = true
          }
          else {
            field.value = false
          }
        }

        message[field.name] = field.value
        message.specification.constants.push(field)
      }
    }
  }

  var hash = this.calculateMd5ForMessage(message)
  message.specification.md5sum = hash

  callback(null, message)
}

msgs.calculateMd5ForMessage = function(message) {
  // The ROS message versioning protocol specifies combining all the constant
  // field definitions, followed by the non-constant field definitions, then
  // hashing them all together.
  var allFields = []
  for (var i = 0; i < message.specification.constants.length; i++) {
    var constant = message.specification.constants[i]
    allFields.push(constant.type + ' ' + constant.name + '=' + constant.value)
  }
  for (var j = 0; j < message.specification.fields.length; j++) {
    var field = message.specification.fields[j]
    allFields.push(field.type + ' ' + field.name)
  }

  // Note that the protocol assumes no newline at the end of the message
  var flattenedMessage = allFields.join('\n')
  console.log(flattenedMessage)
  var md5sum = crypto.createHash('md5')
  md5sum.update(flattenedMessage)
  var hash = md5sum.digest('hex')
  console.log(hash)
  return hash
}

