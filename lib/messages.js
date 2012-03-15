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

function extractProperties (content) {
  var nextArray=[];
  if(content){
    var nextArray=[];
    var _tmpArray = content.split('\n');
    _tmpArray.forEach(function(line, index){

    var equalLocation = line.indexOf("=");
    var commentLocation = line.indexOf("#");
    if(equalLocation!==-1 && commentLocation!==-1 && equalLocation<commentLocation){}else{
      line = line.replace(/#.*/,"");
    }
  
      if(line.trim() != ""){
        var firstspace= line.indexOf(" ");

        var type = line.substring(0,firstspace);
        var cst  = line.substring(firstspace+1);
        var equalIndex = cst.indexOf("=") ;
        var name , cstValue ;
        if(equalIndex!==-1){
           name = cst.substring(0 , equalIndex).trim();
           cstValue = cst.substring(equalIndex+1 , cst.length).trim();
           nextArray.push({name: name, type: type, value:cstValue, index:nextArray.length+1});
        }else{
          name = cst;
          nextArray.push({name: name.trim(), type: type, index:nextArray.length+1});  
        }
      }
    });
  }
  return nextArray;
};

var parseMessageFile = exports.parseMessageFile = function parseMessageFile (filename, callback) {
	fs.readFile(filename, "utf8" , function createMessageFromFile (err, content) {
    if(err) {
      return callback(err);
    }
    var properties = extractProperties(content) || []; //array of properties
    var hash = md5(content);

    callback(null, properties, hash);
  })
};

function getEntriesFromProperties (properties) {
  return properties.map(function getEntries (prop) { return getJSPropertiesName(prop)});
}

function getClassNameFromFile (filename) {
  return filename.split('_').map(function camelCasify (word) {
    return word
      .slice(0,1)
      .toUpperCase()
      + word.slice(1);
  }).join('');
}


function getJSPropertiesName (propertie) {
  if(propertie.value !== undefined)
    return propertie.name;

  var splited = propertie.name.split('_');
  return [splited[0] , splited.slice(1).map(function camelCasify (word) {
    return word
      .slice(0,1)
      .toUpperCase()
      + word.slice(1);
  }).join('')].join('');
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
        self[getJSPropertiesName(propertie)] = propertie.value || "";
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

var registerMessageFromFile = exports.registerMessageFromFile = function registerMessageFromFile (filename, /*optional*/package, callback) {
var fullpath;
  if(typeof package === "function") {
    callback = package;
    package = '';
  }
  if(!package) {
    package = '';
  }

  fullpath = package!=='' ? package+"/" : '' ;
  fullpath += 'msg/'
  fullpath +=  filename
  fullpath += ".msg"
 

var next = function(err, directory){
  var fullpath=directory;
  fullpath += '/msg/'
  fullpath +=  filename
  fullpath += ".msg"

  parseMessageFile(fullpath, function onProperties (err, properties, hash) {
    if(err) {
      callback(err);
    }

    var messageId = package!== '' ? [package, filename].join('/') : filename;

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
};

if(package!==''){
  packages.findPackage(package, next);
}
else{
  next(null, "./");
}
}


var createNewMessageFromFile = exports.createNewMessageFromFile = function createNewMessageFromFile(filename, package, init,callback){
 registerMessageFromFile(filename ,package , function(err, details){
  if(err)
    return callback(err, null);
  var Klass = buildMessageClass(details);
  callback(null , new Klass(init));
 } )
}