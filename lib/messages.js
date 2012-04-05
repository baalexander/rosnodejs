var fs         = require('fs')
, path       = require('path')
, md5        = require('MD5')
, makeError  = require('makeerror')
, async      = require('async')
, packages   = require('./packages')
, fieldsUtil = require('./fields')
;

var messages = exports;

var registry = {};

var InvalidMessageError = exports.InvalidMessageError = makeError(
    'InvalidMessageError',
    "Message {name} is invalid"
    );

var BadMessageFieldError = exports.BadMessageFieldError = function(obj){
  return makeError('BadMessageFieldError',
      "Field {field} does not exist in message {name} definition",
      { proto: InvalidMessageError(obj) })
};

var InvalidTypeMessageFieldError = exports.InvalidTypeMessageFieldError = function(obj){
  return makeError('InvalidTypeMessageFieldError',
      "Field {field} has not the good type",
      { proto: InvalidMessageError(obj) });
};

var OutOfRangeMessageFieldError = exports.OutOfRangeMessageFieldError = function(obj){
  return makeError('OutOfRangeMessageFieldError',
      "Message field {field} with value '{value}' is out of range '{range}' because it is defined as '{type}'",
      { proto: InvalidMessageError(obj) });
};

messages.parseMessageFile = function(fileName,details, callback) {
  details = details ||{};
  fs.readFile(fileName, 'utf8', function(error, content) {
    if (error) {
      return callback(error);
    }
    else {
      details.fields = extractFields(content) || [];
      prepareMD5(details, function(preHash){
        details.md5 = md5(preHash);
        callback(null, details);
      });
    }
  })
};

messages.getMessage = function(messageType, callback) {
  var packageName = getPackageNameFromMessageType(messageType);
  var messageName = getMessageNameFromMessageType(messageType);
  this.getMessageFromPackage(packageName, messageName, callback);
}

messages.getMessageFromPackage = function(packageName, messageName, callback) {
  var that = this;

  var messageType = getMessageType(packageName, messageName);
  var message = getMessageFromRegistry(messageType);
  if (message) {
    callback(null, message);
  }
  else {
    packages.findPackage(packageName, function(error, directory) {
      var filePath = path.join(directory, 'msg', messageName + '.msg');
      that.getMessageFromFile(messageType, filePath, callback);
    });
  }
};

messages.getMessageFromFile = function(messageType, filePath, callback) {
  var message = getMessageFromRegistry(messageType);
  if (message) {
    callback(null, message);
  }
  else {

    var packageName = getPackageNameFromMessageType(messageType)
      , messageName = getMessageNameFromMessageType(messageType);

    var details = {
      messageType : messageType
        , messageName : messageName
        , packageName : packageName
    };

    this.parseMessageFile(filePath,details, function(error, details) {
      if (error) {
        callback(error);
      }
      else {

        message = buildMessageClass(details);
        setMessageInRegistry(messageType, message);

        callback(null, message);
      }
    });
  }
};

function prepareMD5(details, callback){
  var toReturn="";
  if(details && details.fields){
    toReturn +=	details.fields.filter(function(field){ return field.value}).map(function(field){
      return field.type+" "+field.name+"="+field.value;
    }).join("\n");

    var parsedField=[]
      async.forEachSeries(
          details.fields.filter(function(field){ return !field.value})
          , function(field, call){
            if(fieldsUtil.isPrimitive(field.type)){
              parsedField.push(field.type+" "+field.name);
              call();
            }else{
              var packageName = getPackageNameFromMessageType(field.type);
              packageName = packageName || details.packageName; 
              var totalType = fieldsUtil.isPrimitive(field.type) ? field.type : packageName+"/"+field.type;
              messages.getMessage(totalType , function(err, message){
                parsedField.push(message.md5+" "+field.name);
                call(); 
              });
            }}, function(){
              toReturn += parsedField.join("\n");
              return callback(toReturn);
            });
  }else{
    return callback(toReturn);
  }
}

function extractFields(content) {
  var fields = [];

  if (content) {
    var lines = content.split('\n');
    lines.forEach(function(line, index) {
      line = line.trim();

      var lineEqualIndex   = line.indexOf('=')
      , lineCommentIndex = line.indexOf('#')
      ;
    if (lineEqualIndex === -1
      || lineCommentIndex=== -1
      || lineEqualIndex>= lineCommentIndex)
    {
      line = line.replace(/#.*/, '');
    }

    if (line !== '') {
      var firstSpace = line.indexOf(' ')
      , fieldType  = line.substring(0, firstSpace)
      , field      = line.substring(firstSpace + 1)
      , equalIndex = field.indexOf('=')
      , fieldName  = field.trim()
      ;

      if (equalIndex !== -1) {
        fieldName = field.substring(0, equalIndex).trim();
        var constant = field.substring(equalIndex + 1, field.length).trim();
        var parsedConstant = fieldsUtil.parsePrimitive(fieldType, constant);

        fields.push({
          name: fieldName
          , type: fieldType
          , value: parsedConstant
          , index: fields.length
        });
      }
      else {
        fields.push({
          name: fieldName.trim()
          , type: fieldType
          , index: fields.length
        });
      }
    }
    });
  }

  return fields;
};

function camelCase(underscoreWord, lowerCaseFirstLetter) {
  var camelCaseWord = underscoreWord.split('_').map(function(word) {
    return word[0].toUpperCase() + word.slice(1);
  }).join('');

  if (lowerCaseFirstLetter) {
    camelCaseWord = camelCaseWord[0].toLowerCase() + camelCaseWord.slice(1)
  }

  return camelCaseWord;
}

function buildValidator (details) {
  function validator (candidate, strict) {
    return Object.keys(candidate).every(function(prop) {
      var valid = true;
      var exists = false;
      details.fields.forEach(function(field) {
        if (field.name === prop) {
          exists = true;
        }
      });

      if (strict) {
        return exists;
      }
      else {
        return valid;
      }
    });
  }

  validator.name = 'validate' + camelCase(details.messageName);
  return validator;
}

function buildMessageClass(details) {
  function Message(values) {
    if (!(this instanceof Message)) {
      return new Message(init);
    }

    var that = this;

    if (details.fields) {
      details.fields.forEach(function(field) {
        that[field.name] = field.value || null;
      });
    }

    if (values) {
      Object.keys(values).forEach(function(name) {
        that[name] = values[name];
      });
    }
  };

  Message.messageType = Message.prototype.messageType = details.messageType;
  Message.packageName = Message.prototype.packageName = details.packageName;
  Message.messageName = Message.prototype.messageName = details.messageName;
  Message.md5         = Message.prototype.md5         = details.md5;
  Message.fields      = Message.prototype.fields      = details.fields;
  Message.prototype.validate    = buildValidator(details);

  return Message;
}

function getMessageFromRegistry(messageType) {
  return registry[messageType];
}

function setMessageInRegistry(messageType, message) {
  registry[messageType] = message;
}

function getMessageType(packageName, messageName) {
  return packageName ? packageName + '/' + messageName
    : messageName;
}
function getBaseType(arrayType){
  return arrayType.match(/^([^%[]+)/)[0] || arrayType;
}

function getPackageNameFromMessageType(messageType) {
  return messageType.indexOf('/') !== -1 ? messageType.split('/')[0]
    : '';
}

function getMessageNameFromMessageType(messageType) {
  var arrayType= messageType.indexOf('/') !== -1 ? messageType.split('/')[1]
    : messageType;
  return getBaseType(arrayType);
}

