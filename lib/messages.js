var fs         = require('fs')
  , path       = require('path')
  , md5        = require('MD5')
  , makeError  = require('makeerror')
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

messages.parseMessageFile = function(fileName, callback) {
  fs.readFile(fileName, 'utf8', function(error, content) {
    if (error) {
      return callback(error);
    }
    else {
      var fields = extractFields(content) || [];
      var hash = md5(content);
      callback(null, fields, hash);
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
    this.parseMessageFile(filePath, function(error, fields, hash) {
      if (error) {
        callback(error);
      }
      else {
        var packageName = getPackageNameFromMessageType(messageType)
          , messageName = getMessageNameFromMessageType(messageType)
          ;

        var details = {
          messageType : messageType
        , messageName : messageName
        , packageName : packageName
        , fields      : fields
        , md5         : hash
        };
        message = buildMessageClass(details);
        setMessageInRegistry(messageType, message);

        callback(null, message);
      }
    });
  }
};

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
           var parsedConstant = fieldsUtil.parseField(fieldType, constant);

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

  Message.messageType = details.messageType;
  Message.packageName = details.packageName;
  Message.messageName = details.messageName;
  Message.md5         = details.md5;
  Message.fields      = details.fields;
  Message.prototype.validate = buildValidator(details);
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

function getPackageNameFromMessageType(messageType) {
  return messageType.indexOf('/') !== -1 ? messageType.split('/')[0]
                                       : '';
}

function getMessageNameFromMessageType(messageType) {
  return messageType.indexOf('/') !== -1 ? messageType.split('/')[1]
                                       : messageType;
}

