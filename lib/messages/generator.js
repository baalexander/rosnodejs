var fs         = require('fs')
  , util       = require('util')
  , exec       = require('child_process').exec
  , underscore = require('underscore')


var messageGenerator = exports

messageGenerator.createFromPackage = function(packageName, callback) {
  var that = this

  var messages = []
  var createFromMessageTypes = function(messageTypes) {
    for (var i = 0; i < messageTypes.length; i++) {
      var messageType = messageTypes[i]
      that.createFromMessageType(messageType, function(error, message) {
        if (error) {
          callback(error)
        }
        else {
          messages.push(message)
          if (messages.length === messageTypes.length) {
            callback(error, messages)
          }
        }
      })
    }
  }

  getAllMessageTypes(packageName, function(error, messageTypes) {
    if (error) {
      callback(error)
    }
    else {
      createFromMessageTypes(messageTypes)
    }
  })
}

messageGenerator.createFromMessageType = function(messageType, callback) {
  var that = this

  getMessageDefinition(messageType, function(error, definition) {
    that.createFromDefinition(definition, function(error, message) {

      var messageTypeComponents = messageType.split('/')
      message.messageType = messageType
      message.packageName = messageTypeComponents[0]
      message.messageName = messageTypeComponents[1]

      getMessageMd5Sum(messageType, function(error, md5sum) {
        if (error) {
          callback(error)
        }
        else {
          message.md5sum = md5sum
          callback(error, message)
        }
      })
    })
  })
}

messageGenerator.createFromDefinition = function(definition, callback) {
  var message = {}
  message.fields = []

  // Reads message definition line by line, adding property to object
  var lines = definition.split('\n')
  for (var i = 0; i < lines.length; i++) {
    // Line format:
    // type name
    // or
    // type name=value
    var line            = lines[i].trim()
      , lineComponents  = line.split('=', 2)
      , fieldComponents = lineComponents[0].split(' ', 2)
      , field           = { }
    field.type = fieldComponents[0]
    field.name = fieldComponents[1]
    message[field.name] = null

    // No constant was specified
    if (lineComponents.length === 1) {
      message.fields.push(field)
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
      message.fields.push(field)
    }
  }

  callback(null, message)
}

messageGenerator.template = function(packageName, messages, callback) {
  var packageData = {
    packageName: packageName
  , templatedMessages: []
  }

  fs.readFile('./message_template.js', 'utf8', function(error, template) {
    if (error) {
      callback(error)
    }
    else {
      for (var i = 0; i < messages.length; i++) {
        var messageData = messages[i]
        var output      = underscore.template(template, messageData)
        packageData.templatedMessages.push(output)
      }

      fs.readFile('./package_template.js', 'utf8', function(error, template) {
        if (error) {
          callback(error)
        }
        else {
          var output = underscore.template(template, packageData)
          callback(error, output)
        }
      })
    }
  })
}

function getAllMessageTypes(packageName, callback) {
  var packageCommand = 'rosmsg package ' + packageName
  var child = exec(packageCommand, function (error, stdout, stderr) {
    if (error) {
      callback(error)
    }
    else {
      var cleanedOutput = cleanText(stdout)
        , messageTypes  = cleanedOutput.split('\n')
      callback(error, messageTypes)
    }
  })
}

function getMessageDefinition(messageType, callback) {
  var showMessageCommand = 'rosmsg show ' + messageType 
  var child = exec(showMessageCommand, function (error, stdout, stderr) {
    var cleanedOutput = cleanText(stdout)
    callback(error, cleanedOutput)
  })
}

function getMessageMd5Sum(messageType, callback) {
  var md5SumCommand = 'rosmsg md5 ' + messageType
  var child = exec(md5SumCommand, function (error, stdout, stderr) {
    var cleanedOutput = cleanText(stdout)
    callback(error, cleanedOutput)
  })
}

function cleanText(text) {
  // Removes empty lines
  var validLines = []
  var lines = text.split('\n')
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim()
    if (line.length > 0) {
      validLines.push(line)
    }
  }
  var cleanedText = validLines.join('\n')

  return cleanedText
}

