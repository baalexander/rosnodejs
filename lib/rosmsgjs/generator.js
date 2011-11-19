var fs         = require('fs')
  , util       = require('util')
  , exec       = require('child_process').exec
  , underscore = require('underscore')
  , fields     = require('../rosnodejs/fields')

var messageGenerator = exports

messageGenerator.template = function(packageName, messages, callback) {
  var packageData = {
    packageName: packageName
  , templatedMessages: []
  }

  fs.readFile(__dirname + '/message_template.js', 'utf8', function(error, messageTemplate) {
    if (error) {
      callback(error)
    }
    else {
      fs.readFile(__dirname + '/inner_message_template.js', 'utf8', function(error, innerMessageTemplate) {
        if (error) {
          callback(error)
        }
        else {
          for (var i = 0; i < messages.length; i++) {
            var message                = messages[i]
              , templatedInnerMessages = ''
            for (var fieldName in message.innerMessages) {
              var innerMessage = message.innerMessages[fieldName]
              templatedInnerMessages += templateInnerMessage(innerMessageTemplate, { fieldName: fieldName, message: innerMessage})
            }
            message.templatedInnerMessages = templatedInnerMessages

            var output      = underscore.template(messageTemplate, message)
            packageData.templatedMessages.push(output)
          }

          fs.readFile(__dirname + '/package_template.js', 'utf8', function(error, packageTemplate) {
            if (error) {
              callback(error)
            }
            else {
              var output = underscore.template(packageTemplate, packageData)
              callback(error, output)
            }
          })
        }
      })
    }
  })
}

function templateInnerMessage(template, data) {
  // Indents any inner messages
  var splitTemplate    = template.split('\n')
    , indentedTemplate = '\n'
  for (var i = 0; i < splitTemplate.length; i++) {
    // Ignore whitespace only lines
    var line = splitTemplate[i]
    if (/\S/.test(line)) {
      indentedTemplate += '      ' + line + '\n'
    }
  }

  // Recursively template each inner message
  var message = data.message
  var templatedInnerMessages = ''
  for (var fieldName in message.innerMessages) {
    var innerMessage     = message.innerMessages[fieldName]
      , innerMessageData = {
          fieldName : fieldName
        , message   : innerMessage
      }
    templatedInnerMessages += templateInnerMessage(indentedTemplate, innerMessageData)
  }
  data.templatedInnerMessages = templatedInnerMessages

  // Template the message, which contains the templated inner messages too
  return underscore.template(template, data)
}

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
  console.log('CREATE FROM: ' + messageType)
  var that = this

  getMessageDefinition(messageType, function(error, definition) {
    that.createFromDefinition(definition, function(error, message) {

      var messageTypeComponents = messageType.split('/')
      message.packageName       = messageTypeComponents[0]
      message.messageName       = messageTypeComponents[1]
      message.attributes.type   = messageType

      getMessageMd5Sum(messageType, function(error, md5sum) {
        if (error) {
          callback(error)
        }
        else {
          message.attributes.md5sum = md5sum
          callback(error, message)
        }
      })
    })
  })
}

messageGenerator.createFromDefinition = function(definition, callback) {
  var message = {
    attributes: {
      fieldOrder: []
    , fieldTypes: {}
    }
  , innerMessages: {}
  }

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
      , fieldType       = fieldComponents[0]
      , fieldName       = fieldComponents[1]
      , fieldValue      = null

    if (fieldName !== undefined) {

      // A constant value was specified for this field
      if (lineComponents.length > 1) {
        var rawFieldValue = lineComponents[1].trim()
        fieldValue = fields.parseField(fieldType, rawFieldValue)
      }

      message.attributes[fieldName] = fieldValue
      message.attributes.fieldTypes[fieldName] = fieldType
      message.attributes.fieldOrder.push(fieldName)
    }
  }

  // Figures out which fields are messages
  var fieldsWithMessageTypes = []
  for (i = 0; i < message.attributes.fieldOrder.length; i++) {
    fieldName = message.attributes.fieldOrder[i]
    fieldType = message.attributes.fieldTypes[fieldName]
    if (fields.isMessageType(fieldType)) {
      if (fieldType === 'Header') {
        fieldType = 'std_msgs/Header'
      }
      fieldsWithMessageTypes.push(fieldName)
    }
  }

  // If no fields are messages, no more work to do
  if (fieldsWithMessageTypes.length === 0) {
    callback(null, message)
  }
  // If there are any fields that are messages, return only after all the
  // message fields have been defined
  else {
    var fetchedInnerMessagesCount = 0

    var createInnerMessage = function(fieldName, fieldType) {
      messageGenerator.createFromMessageType(fieldType, function(error, innerMessage) {
        fetchedInnerMessagesCount++
        message.innerMessages[fieldName] = innerMessage
        if (fetchedInnerMessagesCount === fieldsWithMessageTypes.length) {
          callback(null, message)
        }
      })
    }

    for (i = 0; i < fieldsWithMessageTypes.length; i++) {
      fieldName = fieldsWithMessageTypes[i]
      fieldType = message.attributes.fieldTypes[fieldName]
      createInnerMessage(fieldName, fieldType)
    }
  }
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

/*
 * Removes empty lines and inner message definitions.
 *
 * Example message definition input:
 *   geometry_msgs/Vector3 linear
 *     float64 x
 *     float64 y
 *     float64 z
 *
 * The cleaned up output:
 *   geometry_msgs/Vector3 linear
 */
function cleanText(text) {
  var validLines = []
  var lines = text.split('\n')
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i]
    // Ignores fields for inner message definitions
    if (line[0] !== ' ') {
      // Removes empty lines
      line = line.trim()
      if (line.length > 0) {
        validLines.push(line)
      }

    }
  }
  var cleanedText = validLines.join('\n')

  return cleanedText
}

