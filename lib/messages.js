var packages = require('./packages');

var fs = require('fs')
  , md5  =  require('md5');
  , makeError = require('makeerror');

//ToDo move registry + related in another file ?
var registry = {};

//ToDo move errors in another file
var InvalidMessageError = exports.InvalidMessageError = makeError(
  'InvalidMessageError',
  "Message {name} is invalid"
);

var BadMessageFieldError = exports.BadMessageFieldError = makeError(
  'BadMessageFieldError',
  "Field {field} does not exist in message {name} definition",
  { proto: InvalidMessageError() }
);

var InvalidTypeMessageFieldError = exports.InvalidTypeMessageFieldError = makeError(
  'InvalidTypeMessageFieldError',
  "Field {field} has not the good type",
  { proto: InvalidMessageError() }
);

var OutOfRangeMessageFieldError = exports.OutOfRangeMessageFieldError = makeError(
  'OutOfRangeMessageFieldError',
  "Message field {field} with value '{value}' is out of range '{range}' because it is defined as '{type}'",
  { proto: InvalidMessageError() }
);

var validators = {
  
}

function extractProperties (content) {
  return content.split('\n')
    .filter(function(line){return line.trim() != ""})
    .map(function(line, index){
      var property = line.split(/\s/);
      var type = property[0];
      var name = property[1];
      return {name: name, type: type, index:index};
    });
}

function parseMessageFile (filename, callback) {
	fs.readFile(filename, function createMessageFromFile (err, content) {
    if(err) {
      return callback(err);
    }
    var properties = extractProperties(content); //array of properties
    var hash = md5(content);
    callback(null, properties, hash);
  })
}

function getEntriesFromProperties (properties) {
  return properties.map(function getEntries (prop) {return prop.name});
}

function getClassNameFromFile (filename) {
  return filename.split('_').map(function camelCasify (word) {
    return word
      .slice(0,1)
      .toUpperCase()
      + word.slice(1);
  }).join('');
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
  function Klass (properties) {
    // allow for a message klass to be instanciated using new or directly thanks to its name
    if(this ! instanceof Klass)
      return new Klass (properties);
    Object.key(properties).forEach(function copyProperty (name) {
      this[name] = properties[name];
    })
  }
  Klass.name = details.className;
  Klass.prototype.validate = buildValidator(details);
  return Klass;
}

function registerMessageFromFile (filename, /*optional*/package, callback) {
  if(typeof package === "function") {
    package = '';
    callback = package;
  }
  if(!package) {
    package = '';
  }

  parseMessageFile(filename, function onProperties (err, properties, hash) {
    if(err) {
      callback(err);
    }

    var messageId = [package, filename].join('/');

    var className = getClassNameFromFile (filename);

    var details = {
      id: messageId,
      messageName: filename,
      className: className,
      package: package,
      properties: properties,
      entries: getEntriesFromProperties(properties),
      md5: hash
    };

    details.message = buildMessageClass(details);

    registry[messageId] = details;

    callback(null, registry[messageId]);
  })
}