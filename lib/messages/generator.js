var fs         = require('fs')
  , util       = require('util')
  , exec       = require('child_process').exec
  , underscore = require('underscore')
  , fields     = require('./fields')

var messageGenerator = exports

messageGenerator.template = function(packageName, messages, callback) {
  var packageData = {
    packageName: packageName
  , templatedMessages: []
  }

  fs.readFile(__dirname + '/message_template.js', 'utf8', function(error, template) {
    if (error) {
      callback(error)
    }
    else {
      for (var i = 0; i < messages.length; i++) {
        var messageData = messages[i]
        var output      = underscore.template(template, messageData)
        packageData.templatedMessages.push(output)
      }

      fs.readFile(__dirname + '/package_template.js', 'utf8', function(error, template) {
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

  console.log('GETTING DEFFY')
  getMessageDefinition(messageType, function(error, definition) {
    console.log('CREATE FROM DEFINITION...')
    that.createFromDefinition(definition, function(error, message) {
      console.log('SUCCEED')

      var messageTypeComponents = messageType.split('/')
      message.packageName       = messageTypeComponents[0]
      message.messageName       = messageTypeComponents[1]
      message.attributes.type   = messageType

      getMessageMd5Sum(messageType, function(error, md5sum) {
        if (error) {
          console.log('CALLING BACK WITH ERROR')
          callback(error)
        }
        else {
          message.attributes.md5sum = md5sum
          console.log('CALLING BACK')
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
    , innerMessages: []
    }
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

  var fetchingInnerMessageCount = 0
  console.log(message.attributes.fieldTypes.length)
  for (i = 0; i < message.attributes.fieldOrder.length; i++) {
    fieldName = message.attributes.fieldOrder[i]
    fieldType = message.attributes.fieldTypes[fieldName]
    if (fields.isMessageType(fieldType)) {
      console.log('FIELD IS NOT PRIMITIVE')
      console.log('FIELD TYPE: ' + fieldType)
      fetchingInnerMessageCount++
      if (fieldType === 'Header') {
        fieldType = 'std_msgs/Header'
      }
      console.log('CALLING CREATE FROM MESSAGE TYPE')
      messageGenerator.createFromMessageType(fieldType, function(error, innerMessage) {
        console.log('CREATE FROM MESSAGE TYPE RETURNED')
        message.attributes.innerMessages.push(innerMessage)
        fetchingInnerMessageCount--
      })
    }
  }

  // Wait for all the inner messages to be fetched before returning
  while (fetchingInnerMessageCount > 0) {

  }

  callback(null, message)
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
  console.log('MSG COMMAND: `' + showMessageCommand + '`')
  var child = exec(showMessageCommand, function (error, stdout, stderr) {
    console.log('OUTPUT')
    var cleanedOutput = cleanText(stdout)
    console.log('CLEAN OUTPUT')
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

