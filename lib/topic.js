var url           = require('url')
  , EventEmitter2 = require('eventemitter2').EventEmitter2
  , portscanner   = require('portscanner')
  , xmlrpc        = require('xmlrpc')
  , async         = require('async')
  , environment   = require('./environment')
  , master        = require('./master')
  , TCPROS        = require('./tcpros')
  ;

function Topic(options) {
  if ((this instanceof Topic) === false) {
    return new Topic(options);
  }

  options = options || {};
  this.node                 = options.node;
  this.topic                = options.topic;
  this.messageType          = options.messageType;
  this.mode                 = options.mode || "all";
  this.uri                  = null;
  this.registeredPublisher  = false;
  this.registeredSubscriber = false;
  this.protocols = {};

  this.createSlaveServer();
}
Topic.prototype.__proto__ = EventEmitter2.prototype;

Topic.prototype.getUri = function(callback) {
  if (this.uri) {
    callback(this.uri);
  }
  else {
    this.on('connection', function(uri) {
      callback(uri);
    });
  }
};

Topic.prototype.createSlaveServer = function() {
  var that = this;

  var hostname = environment.getHostname();
  portscanner.findAPortNotInUse(9000, null, hostname, function(error, port) {
    var uriFields = { protocol: 'http', hostname: hostname, port: port }
      , uri       = url.format(uriFields)
      , server    = xmlrpc.createServer(uri)
      ;

    that.uri = uri;
    server.on('requestTopic', that.requestTopic.bind(that));
    server.on('publisherUpdate', that.publisherUpdate.bind(that));

    that.emit('connection', uri);
  });

  if(this.mode=="all"||this.mode=="publish"){
    this._registerPublisher();
  }
};

Topic.prototype._registerPublisher=function(){
  var that=this;
  
  this.getUri(function(uri) {
    var masterParams = {
      callerId    : that.node
      , callerUri   : uri
      , topic       : that.topic
      , messageType : that.messageType.messageType
    };
    master.registerPublisher(masterParams, function(error) {
      if (error) {
        that.emit('error', error);
      }
    });
  });
};

Topic.prototype.requestTopic = function(error, params, callback) {
  console.log("topic requested");
  var that      = this
  , callerId  = params[0]
  , topic     = params[1]
  , protocols = params[2]
  , protocol;

  if (topic.length > 0 && topic.charAt(0) === '/') {
    topic = topic.substr(1, topic.length - 1);
  }


  var protocolListening=function(uri){
    console.log("Uri ", uri);
    var statusCode     = 1
    , statusMessage  = 'ready on ' + uri
    , uriFields      = url.parse(uri)
    , hostname       = uriFields.hostname
    , port           = parseInt(uriFields.port)
    , protocolParams = ['TCPROS', hostname, port]
    ;
    callback(null, [statusCode, statusMessage, protocolParams]);
  };



  if(!this.protocols['TCPROS']){
    protocol = new TCPROS({
      node        : this.node
      , topic       : this.topic
      , messageType : this.messageType
    });
    protocol.on('listening', function(uri) {
      that.protocols['TCPROS']={protocol:protocol, uri:uri};
      that.emit('publisher_ready', protocol);
      protocolListening(uri);
    });
    protocol.createPublisher();
  }else{
    protocolListening(that.protocols['TCPROS'].uri); 
  }

};

Topic.prototype.publisherUpdate = function(error, params, callback) {
  var that       = this
  , callerId   = params[0]
  , topic      = params[1]
  , publishers = params[2]
  ;

  if (topic.length > 0 && topic.charAt(0) === '/') {
    topic = topic.substr(1, topic.length - 1);
  }

  publishers.forEach(function(publisherUri) {
    var client    = xmlrpc.createClient(publisherUri)
    , protocols = [['TCPROS']]
    , params    = [that.node, that.topic, protocols]
    ;

    client.methodCall('requestTopic', params, function(error, value) {
      var hostParams = value[2]
      , protocol   = hostParams[0]
      , host       = hostParams[1]
      , port       = hostParams[2]
      ;

      if (protocol === 'TCPROS') {
        that.protocol = new TCPROS({
          node        : that.node
          , topic       : that.topic
          , messageType : that.messageType
        });

        that.protocol.on('message', function(message) {
          that.emit('message', message);
        });

        that.protocol.createSubscriber(port, host);
      }
    });
  });
};

Topic.prototype.publish = function(message) {
  var that = this;
  console.log("publish on topic");
  for( i in this.protocols){
    console.log("looping for each");
    this.protocols[i].protocol.publish(message);
  }
}

Topic.prototype.subscribe = function(callback) {
  var that = this;

  this.on('message', callback);

  if (!this.protocol) {
    this.getUri(function(uri) {
      var masterParams = {
        callerId    : that.node
        , callerUri   : uri
        , topic       : that.topic
        , messageType : that.messageType.messageType
      };
      master.registerSubscriber(masterParams, function(error) {
        if (error) {
          that.emit('error', error);
        }
      });
    });
  }
};

module.exports = Topic;

