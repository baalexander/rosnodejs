var url           = require('url')
, EventEmitter2 = require('eventemitter2').EventEmitter2
, xmlrpc        = require('xmlrpc')
, async        = require('async')
, TCPROS        = require('./tcpros')
;

var Topic = (function(){

  var protocols = [];

  function Topic(nodeName, topicName, messageType, callback) {
    if ((this instanceof Topic) === false) {
      return new Topic(nodeName, topicName, messageType);
    }

    this.nodeName = nodeName;
    this.topicName = topicName;
    this.messageType = messageType;
    this.registeredPublisher = false;
    this.registeredSubscriber = false;

    return callback(null,this);
  }

  Topic.prototype.__proto__ = EventEmitter2.prototype;

  Topic.prototype.publish = function(message, callback) {
    async.forEach(protocols , function(protocol, callback){
      protocol.publish(message, callback); 
    } , callback);
  }

  Topic.prototype.subscribe = function(callback) {
    this.on('message', callback);

    if (!this.registeredSubscriber) {
      this.once('selectedProtocol', function() {
        this.registeredPublisher = true;
        this.protocol.publish(message);
      });
    }
  }

  Topic.prototype.selectProtocol = function(protocols) {
    this.selectTCPROS();
  }

  Topic.prototype.selectTCPROS = function() {
    var that = this;
    var protocol = new TCPROS(this.nodeName, this.topicName, this.messageType);
    protocol.on('listening', function(uri) {
      var statusCode     = 1
      , statusMessage  = 'ready on ' + uri
      , uriFields      = url.parse(uri)
      , hostname       = uriFields.hostname
      , port           = parseInt(uriFields.port)
      , protocolParams = ['TCPROS', hostname, port]
      ;

      that.emit('selectedProtocol', [statusCode, statusMessage, protocolParams]);
    });

    protocol.createPublisher(function(){
      protocols.push(protocol); 
    });
  }

  Topic.prototype.publisherUpdate = function(publisherUri) {
    var that      = this
    , client    = xmlrpc.createClient(publisherUri)
    , protocols = [['TCPROS']]
    , params    = [this.nodeName, this.topicName, protocols]
    ;

    client.methodCall('requestTopic', params, function(error, value) {
      var hostParams = value[2]
      , protocol   = hostParams[0]
      , host       = hostParams[1]
      , port       = hostParams[2]
      ;

      if (protocol === 'TCPROS') {
        that.protocol = new TCPROS(that.nodeName, that.topicName, that.messageType);

        that.protocol.on('message', function(message) {
          that.emit('message', message);
        });

        that.protocol.createSubscriber(port, host);
      }
    });
  };

  return Topic;
}());

module.exports = Topic;

