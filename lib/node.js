var url           = require('url')
, EventEmitter2 = require('eventemitter2').EventEmitter2
, portscanner   = require('portscanner')
, xmlrpc        = require('xmlrpc')
, async        = require('async')
, environment   = require('./environment')
, master        = require('./master')
, Topic         = require('./topic');

var node = (function(){

  function node(name) {
    if ((this instanceof node) === false) {
      return new node(name);
    }

    this.name = name;
    this.sockets = [];

    this.createSlaveServer();
  };
  node.prototype.__proto__ = EventEmitter2.prototype;

  node.prototype.topics = function(topics, options ,callback) {
    var that = this;

    if(typeof options=='function'){
      callback=options;
      options = null;
    }
    options = options || {};
    options._events = [];

    if(options.mode === "publish" || options.mode === "all" ){
      options._events.push("registerPublisher");
    }
    if(options.mode ==="subscribe" || options.mode === "all"){
      options._events.push("registerSubscriber");
    }

    var sockets = [];

    async.forEach(topics, function(topic, callback){
      console.log("creating new topic : ", topic.topic);
      new Topic(that.name, topic.topic, topic.messageType, function(err, socket){
        sockets.push(socket);
        that.sockets[topic.topic] = socket;

        var eventsHandler={};
        var registerPublisher = function(callback){
          that.getUri(function(uri) {
            var masterParams = {
              callerId    : that.name
              , callerUri   : uri
              , topic       : topic.topic
              , messageType : topic.messageType
            };
            master.registerPublisher(masterParams, function(error) {
              if (error) {
                that.emit('error', error);
              }
              if(callback){callback();}
            });
          });
        };
        var registerSubscriber = function(callback){
          that.getUri(function(uri) {
            var masterParams = {
              callerId    : that.name
              , callerUri   : uri
              , topic       : topic.topic
              , messageType : topic.messageType
            };
            master.registerSubscriber(masterParams, function(error) {
              if (error) {
                that.emit('error', error);
              }
              if(callback){callback();}

            });
          });
        };

        eventsHandler["registerPublisher"] = registerPublisher;
        eventsHandler["registerSubscriber"] = registerSubscriber;

        socket.on('registerPublisher',registerPublisher);
        socket.on('registerSubscriber',registerSubscriber);

        async.forEach(options._events, function(event, callback){
          eventsHandler[event](callback);
        }, callback);
      });

    }, function(){
      callback.apply(this, sockets);
    });
  }

  node.prototype.getUri = function(callback) {
    if (this.uri) {
      callback(this.uri);
    }
    else {
      this.on('connection', function(uri) {
        callback(uri);
      });
    }
  };

  node.prototype.createSlaveServer = function() {
    var that = this;

    var hostname = environment.getHostname();
    portscanner.findAPortNotInUse(9000, null, hostname, function(error, port) {
      var uriFields = { protocol: 'http', hostname: hostname, port: port }
      , uri       = url.format(uriFields)
      , server    = xmlrpc.createServer(uri);

      that.uri = uri;
      server.on('requestTopic', that.requestTopic.bind(that));
      server.on('publisherUpdate', that.publisherUpdate.bind(that));

      that.emit('connection', uri);
    });
  };

  node.prototype.requestTopic = function(error, params, callback) {
    var callerId  = params[0]
    , topic     = params[1]
    , protocols = params[2]
    , that = this
    ;

    if (topic.length > 0 && topic.charAt(0) === '/') {
      topic = topic.substr(1, topic.length - 1);
    }
    console.log("requested topic", topic);
    var socket = this.sockets[topic];
    console.log("socket", socket);
    if (socket) {
      if(that.sockets[topic.topic]){
        callback(null, that.sockets[topic.topic]);
      }else{
        socket.once('selectedProtocol', function(protocol) {
          console.log("selectec Protocol called");
          that.sockets[topic.topic] = protocol;
          callback(null, protocol);
        });
        socket.selectProtocol(protocols);
      }
    }
  };

  node.prototype.publisherUpdate = function(error, params, callback) {
    var callerId   = params[0]
    , topic      = params[1]
    , publishers = params[2]
    ;

    if (topic.length > 0 && topic.charAt(0) === '/') {
      topic = topic.substr(1, topic.length - 1);
    }

    var socket = this.sockets[topic];
    publishers.forEach(function(publisherUri) {
      socket.publisherUpdate(publisherUri);
    });
  };

  return node}());

  module.exports = node;

