var fs         = require('fs')
  , util       = require('util')
  , exec       = require('child_process').exec
  , underscore = require('underscore')


var messageGenerator = exports

messageGenerator.createFromPackage = function(packageName, callback) {
  var that = this

  var messageData = {
    packageName: 'std_msgs'
  , messageType: 'String'
  , md5sum: '923adsfsadfsadfsda'
  , fields: {
      data: 'temp'
    , hey: null
    }
  }

  var packageData = {
    packageName: 'std_msgs'
  , messageTypes: []
  }

  fs.readFile('./message_template.js', 'utf8', function(error, template) {
    var output = underscore.template(template, messageData)
    console.log()
    console.log(output)
    packageData.messageTypes.push(output)
    packageData.messageTypes.push(output)
    packageData.messageTypes.push(output)
  })

  fs.readFile('./package_template.js', 'utf8', function(error, template) {
    var output = underscore.template(template, packageData)
    console.log()
    console.log(output)
  })


  // var findAllMessages = 'rosmsg package ' + packageName
  // var child = exec(findAllMessages, function (error, stdout, stderr) {
  //   var messageTypes = stdout.split('\n')
  //   for (var i = 0; i < messageTypes.length; i++) {
  //     var messageType = messageTypes[i]
  //     that.createFromMessageType(messageType)
  //   }
  // })
}

messageGenerator.createFromMessageType = function(messageType, callback) {
  var that = this

  var showMessage = 'rosmsg show ' + messageType 
  var child = exec(showMessage, function (error, stdout, stderr) {
    that.createFromString(stdout)
  })
}

messageGenerator.createFromString = function(message, callback) {
}

//rosmsg package package_name
//rosmsg show package/message
//rosmsg md5 package/message


