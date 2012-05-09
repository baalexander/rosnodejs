var url           = require('url')
  , EventEmitter2 = require('eventemitter2').EventEmitter2
  , portscanner   = require('portscanner')
  , xmlrpc        = require('xmlrpc')
  , async         = require('async')
  , environment   = require('./environment')
  , master        = require('./master')
  , TCPROS        = require('./tcpros') ;

function Topic(options) {
  if ((this instanceof Topic) === false) {
    return new Topic(options);
  }

  options = options || {};
  this.node        = options.node;
  this.topic       = options.topic;
  this.messageType = options.messageType;
  this.mode        = options.mode || "all";
  this.uri         = null;
  this.publishers  = {};
  this.subscribers = {};

  this.createSlaveServer();
}
Topic.prototype.__proto__ = EventEmitter2.prototype;

Topic.prototype.publish = function(message) {
  if (!this.hasPublishers()) {
    this.on('publisher_ready', function(publisher) {
      publisher.publish(message);
    });
    this.registerPublisher();
  }
  else {
    for (var uri in this.publishers) {
      var publisher = this.publishers[uri];
      publisher.publish(message);
    }
  }
};

Topic.prototype.registerPublisher = function() {
  var that = this;

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
      else {
        that.emit('registered_publisher');
      }
    });
  });
};

Topic.prototype.unregisterPublisher = function(message) {
  var that = this;

  if (this.hasPublishers()) {
    this.publishers = {};

    this.getUri(function(uri) {
      var masterParams = {
        callerId  : that.node
      , callerUri : uri
      , topic     : that.topic
      };
      master.unregisterPublisher(masterParams, function(error) {
        if (error) {
          that.emit('error', error);
        }
        else {
          that.emit('unregistered_publisher');
        }
      });
    });
  }
};

Topic.prototype.hasPublishers = function() {
  return Object.keys(this.publishers).length > 0;
}

Topic.prototype.subscribe = function(callback) {
  this.on('message', callback);

  if (!this.hasSubscribers()) {
    this.registerSubscriber();
  }
};

Topic.prototype.registerSubscriber = function() {
  var that = this;

  this.getUri(function(uri) {
    var masterParams = {
      callerId    : that.node
    , callerUri   : uri
    , topic       : that.topic
    , messageType : that.messageType.messageType
    };
    master.registerSubscriber(masterParams, function(error, uris) {
      if (error) {
        that.emit('error', error);
      }
      else {
        that.emit('registered_subscriber');
      }
    });
  });
};

Topic.prototype.unregisterSubscriber = function(callback) {
  var that = this;

  if (this.hasSubscribers()) {
    this.subscribers = {};

    this.getUri(function(uri) {
      var masterParams = {
        callerId  : that.node
      , callerUri : uri
      , topic     : that.topic
      };
      master.unregisterSubscriber(masterParams, function(error) {
        if (error) {
          that.emit('error', error);
        }
        else {
          that.emit('unregistered_subscriber');
        }
      });
    });
  }
};

Topic.prototype.hasSubscribers = function() {
  return Object.keys(this.subscribers).length > 0;
}

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


// Slave API
// ---------

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
    server.on('getBusStats', that.getBusStats.bind(that));
    server.on('getBusInfo', that.getBusInfo.bind(that));
    server.on('getMasterUri', that.getMasterUri.bind(that));
    server.on('getPid', that.getPid.bind(that));
    server.on('getSubscriptions', that.getSubscriptions.bind(that));
    server.on('getPublications', that.getPublications.bind(that));

    that.emit('connection', uri);
  });

  if (this.mode === 'all' || this.mode === 'publish') {
    this.registerPublisher();
  }
  if (this.mode === 'all' || this.mode === 'subscribe') {
    this.registerSubscriber();
  }
};

Topic.prototype.requestTopic = function(error, params, callback) {
  var that      = this
    , callerId  = params[0]
    , topic     = params[1]
    , protocols = params[2]
    ;

  if (topic.length > 0 && topic.charAt(0) === '/') {
    topic = topic.substr(1, topic.length - 1);
  }

  var tcpros = new TCPROS({
    node        : this.node
  , topic       : this.topic
  , messageType : this.messageType
  });

  tcpros.on('listening', function(uri) {
    that.publishers[uri] = tcpros;

    tcpros.on('error', function(error) {
      delete that.publishers[uri];
    });

    var statusCode     = 1
      , statusMessage  = 'ready on ' + uri
      , uriFields      = url.parse(uri)
      , hostname       = uriFields.hostname
      , port           = parseInt(uriFields.port)
      , protocolParams = ['TCPROS', hostname, port]
      ;
    callback(null, [statusCode, statusMessage, protocolParams]);
  });

  tcpros.on('connect', function() {
    that.emit('publisher_ready', that);
  });

  tcpros.createPublisher();
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
    if (!that.subscribers.hasOwnProperty(publisherUri)) {
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

        var tcpros = new TCPROS({
          node        : that.node
        , topic       : that.topic
        , messageType : that.messageType
        });
        that.subscribers[publisherUri] = tcpros;

        tcpros.on('message', function(message) {
          that.emit('message', message);
        });

        tcpros.createSubscriber(port, host);
      });
    }
  });

  callback(null, [1, '']);
};

Topic.prototype.getBusStats = function(error, params, callback) {
  var code          = 1
    , statusMessage = ''
    , busStats      = []
    , params        = [code, statusMessage, busStats]
    ;
  callback(null, params);
};

Topic.prototype.getBusInfo = function(error, params, callback) {
  var code          = 1
    , statusMessage = ''
    , busInfo       = []
    , params        = [code, statusMessage, busInfo]
    ;
  callback(null, params);
};

Topic.prototype.getMasterUri = function(error, params, callback) {
  var code          = 1
    , statusMessage = ''
    , masterUri     = environment.getMasterUri()
    , params        = [code, statusMessage, masterUri]
    ;
  callback(null, params);
};

Topic.prototype.getPid = function(error, params, callback) {
  var code          = 1
    , statusMessage = 'Retrieved node PID'
    , pid           = process.pid
    , params        = [code, statusMessage, params]
    ;
  callback(null, params);
};

Topic.prototype.getSubscriptions = function(error, params, callback) {
  var code          = 1
    , statusMessage = ''
    , subscriptions = []
    ;

  if (this.hasSubscribers()) {
    subscriptions.push([this.topic, this.messageType.messageType]);
  }

  callback(null, [code, statusMessage, subscriptions]);
};

Topic.prototype.getPublications = function(error, params, callback) {
  var code          = 1
    , statusMessage = ''
    , publications  = []
    ;

  if (this.hasPublishers()) {
    publications.push([this.topic, this.messageType.messageType]);
  }

  callback(null, [code, statusMessage, publications]);
};

module.exports = Topic;

