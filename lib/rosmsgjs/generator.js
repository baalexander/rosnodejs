// Generates browser and Node.js compatible JavaScript models from ROS message
// definitions. Can process all the message definitions for a package or a
// single message definition.
var fs         = require('fs')
  , util       = require('util')
  , exec       = require('child_process').exec
  , underscore = require('underscore')
  , fields     = require('../rosnodejs/fields')

var messageGenerator = exports

// Given a list of message definitions, returns the browser and
// Node.js compatible JavaScript models as a string.
//
// Parameters:
//  * packageName - the package name all the messages belong to.
//  * messages    - array of message definitions. The array can be created from
//    `createFromPackage`.
messageGenerator.template = function(packageName, messages, callback) {
  // Contains all the themed messages and package data for outputting the final
  // package.
  var packageData = {
    packageName: packageName
  , templatedMessages: []
  }

  // Reads the template file for outputting a message model.
  fs.readFile(__dirname + '/message_template.js', 'utf8', function(error, messageTemplate) {
    if (error) {
      callback(error)
    }
    else {
      // Reads the template file for outputting any inner messages.
      fs.readFile(__dirname + '/inner_message_template.js', 'utf8', function(error, innerMessageTemplate) {
        if (error) {
          callback(error)
        }
        else {
          // Some messages may contain fields that are message types. These
          // message type fields are themed before the rest of the message can
          // be themed.
          for (var i = 0; i < messages.length; i++) {
            var message                = messages[i]
              , templatedInnerMessages = ''
            for (var fieldName in message.innerMessages) {
              var innerMessage = message.innerMessages[fieldName]
              templatedInnerMessages += templateInnerMessage(innerMessageTemplate, { fieldName: fieldName, message: innerMessage})
            }
            message.templatedInnerMessages = templatedInnerMessages

            // The message is themed.
            var output      = underscore.template(messageTemplate, message)

            // The themed message's output is added to the package data for
            // theming the entire package later.
            packageData.templatedMessages.push(output)
          }

          // Reads the template file for outputting all the message models as a
          // package.
          fs.readFile(__dirname + '/package_template.js', 'utf8', function(error, packageTemplate) {
            if (error) {
              callback(error)
            }
            else {
              // Combines all message outputs into a package output.
              var output = underscore.template(packageTemplate, packageData)
              callback(error, output)
            }
          })
        }
      })
    }
  })
}

// Templates the message type field of a parent message.
function templateInnerMessage(template, data) {

  // Indents any inner messages for prettiness.
  var splitTemplate    = template.split('\n')
    , indentedTemplate = '\n'
  for (var i = 0; i < splitTemplate.length; i++) {
    // Ignore whitespace only lines.
    var line = splitTemplate[i]
    if (/\S/.test(line)) {
      indentedTemplate += '      ' + line + '\n'
    }
  }

  // Recursively template each message type fields of this message type (and so
  // on).
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

  // Template the message, which contains the recursively templated inner
  // messages too.
  return underscore.template(template, data)
}

// Processes all the message definitions for a package and returns the processed
// messages in the callback.
messageGenerator.createFromPackage = function(packageName, callback) {
  var that = this

  getAllMessageTypes(packageName, function(error, messageTypes) {
    if (error) {
      callback(error)
    }
    else {
      messageGenerator.createFromMessageTypes(messageTypes)
    }
  })
}

// Processes all the message definitions for the passed in message types and
// returns the processed messages in the callback.
messageGenerator.createFromMessageTypes = function(messageTypes, callback) {
  var messages = []
  for (var i = 0; i < messageTypes.length; i++) {
    var messageType = messageTypes[i]
    // Process the message type.
    messageGenerator.createFromMessageType(messageType, function(error, message) {
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

// Process the message definition for a given message type and return the
// processed message in the callback. The processed message structure provides a
// format that's easier to theme for output.
messageGenerator.createFromMessageType = function(messageType, callback) {
  var that = this

  getMessageDefinition(messageType, function(error, definition) {
    that.createFromDefinition(definition, function(error, message) {

      // Begin processing the message definition.
      var messageTypeComponents = messageType.split('/')
      message.packageName       = messageTypeComponents[0]
      message.messageName       = messageTypeComponents[1]
      message.attributes.type   = messageType

      // Adds the MD5 sum for the message.
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

// Parses the message definition and builds up the basic structure for a
// processed message object.
messageGenerator.createFromDefinition = function(definition, callback) {
  var message = {
    attributes: {
      fieldOrder: []
    , fieldTypes: {}
    }
  , innerMessages: {}
  }

  // Reads message definition line by line, adding property to object.
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

      // If a constant value was specified on that line, uses the constant as
      // the field value.
      if (lineComponents.length > 1) {
        var rawFieldValue = lineComponents[1].trim()
        fieldValue = fields.parseField(fieldType, rawFieldValue)
      }

      message.attributes[fieldName] = fieldValue
      message.attributes.fieldTypes[fieldName] = fieldType
      message.attributes.fieldOrder.push(fieldName)
    }
  }

  // Figures out which fields are message types.
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

  // If no fields are message types, there is no more work to do.
  if (fieldsWithMessageTypes.length === 0) {
    callback(null, message)
  }
  // If any fields are message types, return only after all those fields'
  // messages have been defined.
  else {
    var fetchedInnerMessagesCount = 0

    // Process the messages from the message type fields.
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

// Fetch all the message types defined in a package.
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

// Get the message definition verbatim from the message file.
function getMessageDefinition(messageType, callback) {
  var showMessageCommand = 'rosmsg show ' + messageType
  var child = exec(showMessageCommand, function (error, stdout, stderr) {
    var cleanedOutput = cleanText(stdout)
    callback(error, cleanedOutput)
  })
}

// Calculate the MD5 sum of a message type.
function getMessageMd5Sum(messageType, callback) {
  var md5SumCommand = 'rosmsg md5 ' + messageType
  var child = exec(md5SumCommand, function (error, stdout, stderr) {
    var cleanedOutput = cleanText(stdout)
    callback(error, cleanedOutput)
  })
}

// Removes empty lines and inner message definitions.

// Example message definition input:
//   geometry_msgs/Vector3 linear
//     float64 x
//     float64 y
//     float64 z

// The cleaned up output:
//   geometry_msgs/Vector3 linear
function cleanText(text) {
  var validLines = []
  var lines = text.split('\n')
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i]
    // Ignores fields for inner message definitions.
    if (line[0] !== ' ') {
      // Removes empty lines.
      line = line.trim()
      if (line.length > 0) {
        validLines.push(line)
      }

    }
  }
  var cleanedText = validLines.join('\n')

  return cleanedText
}

