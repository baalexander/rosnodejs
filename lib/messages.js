var packages = require('./packages');

var fs = require('fs')
  , md5  =  require('MD5')
  , makeError = require('makeerror');

//ToDo move registry + related in another file ?
var registry = {};

//ToDo move errors in another file
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

var validators = {
  
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
          , constant   = null
          ;

        if (equalIndex !== -1) {
           fieldName = field.substring(0, equalIndex).trim();
           constant  = field.substring(equalIndex + 1, field.length).trim();
           fields.push({
             name: fieldName
           , type: fieldType
           , value: constant
           , index: fields.length + 1
           });
        }
        else {
          fields.push({
            name: fieldName.trim()
          , type: fieldType
          , index: fields.length+1
          });
        }
      }
    });
  }

  return fields;
};

exports.parseMessageFile = function(filename, callback) {
  fs.readFile(filename, 'utf8', function(error, content) {
    if (error) {
      return callback(error);
    }
    else {
      var fields = extractFields(content) || []; //array of properties
      var hash = md5(content);
      callback(null, fields, hash);
    }
  })
};

function getEntriesFromFields(fields) {
  return fields.map(function(field) {
    return getJSFieldName(field)
  });
}

function camelCase(underscoreWord, lowerCaseFirstLetter) {
  var camelCaseWord = underscoreWord.split('_').map(function(word) {
    return word[0].toUpperCase() + word.slice(1);
  }).join('');

  if (lowerCaseFirstLetter) {
    camelCaseWord = camelCaseWord[0].toLowerCase() + camelCaseWord.slice(1)
  }

  return camelCaseWord;
}

function getClassNameFromFile(fileName) {
  return camelCase(fileName);
}

function getJSFieldName(field) {
  var fieldName = ''
  if (field.value !== undefined) {
    fieldName = field.name;
  }
  else {
    fieldName = camelCase(field.name, true);
  }

  return fieldName;
}

function buildValidator (details) {
  // validates an object for being a valid message according to details.
  // if strict is true, no other enumerable key is allowed in candidate to be validated,
  // but allows partial messages
  function validator (candidate, /*optional*/strict) {
    return Object.keys(candidate).every(function validateProperty (prop) {
      var valid = true;
      var exist = !!~details.entries.indexOf(prop); // checks if prop is in the entries array
      if(strict) {
        return exist;
      }
      //FIXME ensure type!
      return valid;
    })
  }
  validator.name = "validate" + details.className; // a nice name for the validation function for debugging
  return validator;
}

function buildMessageClass (details) {
  function Klass (init) {
    // allow for a message klass to be instanciated using new or directly thanks to its name
    if( ! (this instanceof Klass))  
      return new Klass (init);
    var self=this;
    if(details.properties){
      details.properties.forEach(function initProperty (propertie) {
        self[getJSFieldName(propertie)] = propertie.value || "";
      })
    }

    if(init){
      Object.keys(init).forEach(function copyProperty (name) {
        self[name] = init[name];
      })
    }
  };
  Klass.name = details.className;
  Klass.prototype.validate = buildValidator(details);
  return Klass;
}

exports.registerMessageFromFile = function(fileName, packageName, callback) {
  var that = this;

  if (typeof packageName === "function") {
    callback = packageName;
    packageName = '';
  }
  if (!packageName) {
    packageName = '';
  }

  var next = function(error, directory) {
    var fullPath = directory;
    fullPath += '/msg/'
    fullPath +=  fileName
    fullPath += ".msg"

    that.parseMessageFile(fullPath, function(error, fields, hash) {
      if (error) {
        callback(error);
      }
      else {
        var messageId = packageName !== '' ? [packageName, fileName].join('/') : fileName
          , className = getClassNameFromFile(fileName)
          , entries   = getEntriesFromFields(fields)
          ;

        var details = {
          id: messageId
        , messageName: fileName
        , className: className
        , package: packageName
        , properties: fields
        , entries: entries
        , md5: hash
        };
        details.message = buildMessageClass(details);
        registry[messageId] = details;

        callback(null, details);
      }
    });
  };

  if (packageName !== '') {
    packages.findPackage(packageName, next);
  }
  else{
    next(null, "./");
  }
}

exports.createNewMessageFromFile = function(filename, package, init, callback) {
 this.registerMessageFromFile(filename ,package , function(err, details){
  if(err)
    return callback(err, null);
  var Klass = buildMessageClass(details);
  callback(null , new Klass(init));
 } )
}

