var fs         = require('fs')
  , path       = require('path')
  , md5        = require('MD5')
  , async      = require('async')
  , packages   = require('./packages')
  , fieldsUtil = require('./fields')
  ;

var messages = exports;

var registry = {};

messages.parseMessageFile = function(fileName, details, callback) {
  details = details || {};
  fs.readFile(fileName, 'utf8', function(error, content) {
    if (error) {
      return callback(error);
    }
    else {
      extractFields(content, details, function(error, constants, fields) {
        if (error) {
          callback(error);
        }
        else {
          details.constants = constants;
          details.fields    = fields;
          details.md5       = calculateMD5(details);
          callback(null, details);
        }
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

    this.parseMessageFile(filePath, details, function(error, details) {
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

function calculateMD5(details) {
  var message = '';

  message += details.constants.map(function(field) {
    return field.type + ' ' + field.name + '=' + field.value;
  }).join('\n');

  message += details.fields.map(function(field) {
    if (field.messageType) {
      return field.messageType.md5 + ' ' + field.name;
    }
    else {
      return field.type + ' ' + field.name;
    }
  }).join('\n');

  return md5(message);
}

function extractFields(content, details, callback) {
  var constants = []
    , fields    = []
    ;

  var parseLine = function(line, callback) {
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

    if (line === '') {
      callback();
    }
    else {
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

        constants.push({
          name        : fieldName
        , type        : fieldType
        , value       : parsedConstant
        , index       : fields.length
        , messageType : null
        });
        callback();
      }
      else {
        if (fieldsUtil.isPrimitive(fieldType)) {
          fields.push({
            name        : fieldName.trim()
          , type        : fieldType
          , index       : fields.length
          , messageType : null
          });
          callback();
        }
        else if (fieldsUtil.isArray(fieldType)) {
          var arrayType = fieldsUtil.getTypeOfArray(fieldType);
          if (fieldsUtil.isMessage(arrayType)) {
            fieldType = normalizeMessageType(fieldType, details.packageName);
            arrayType = normalizeMessageType(arrayType, details.packageName);
            messages.getMessage(arrayType, function(error, messageType) {
              fields.push({
                name        : fieldName.trim()
              , type        : fieldType
              , index       : fields.length
              , messageType : messageType
              });
              callback();
            });
          }
          else {
            fields.push({
              name        : fieldName.trim()
            , type        : fieldType
            , index       : fields.length
            , messageType : null
            });
            callback();
          }
        }
        else if (fieldsUtil.isMessage(fieldType)) {
          fieldType = normalizeMessageType(fieldType, details.packageName);
          messages.getMessage(fieldType, function(error, messageType) {
            fields.push({
              name        : fieldName.trim()
            , type        : fieldType
            , index       : fields.length
            , messageType : messageType
            });
            callback();
          });
        }
      }
    }
  }

  var lines = content.split('\n');
  async.forEachSeries(lines, parseLine, function(error) {
    if (error) {
      callback(error);
    }
    else {
      callback(null, constants, fields);
    }
  });
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
    return Object.keys(candidate).every(function(property) {
      var valid = true;
      var exists = false;

      details.constants.forEach(function(field) {
        if (field.name === property) {
          exists = true;
        }
      });
      if (!exists) {
        details.fields.forEach(function(field) {
          if (field.name === property) {
            exists = true;
          }
        });
      }

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

    if (details.constants) {
      details.constants.forEach(function(field) {
        that[field.name] = field.value || null;
      });
    }
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
  Message.constants   = Message.prototype.constants   = details.constants;
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

function getPackageNameFromMessageType(messageType) {
  return messageType.indexOf('/') !== -1 ? messageType.split('/')[0]
    : '';
}

var isNormalizedMessageType = /.*\/.*$/;
function normalizeMessageType(messageType, packageName) {
  var normalizedMessageType = messageType;
  if (messageType.match(isNormalizedMessageType) === null) {
    normalizedMessageType = getMessageType(packageName, messageType);
  }

  return normalizedMessageType;
}

function getMessageNameFromMessageType(messageType) {
  return messageType.indexOf('/') !== -1 ? messageType.split('/')[1]
                                         : messageType;
}

