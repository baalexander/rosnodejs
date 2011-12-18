// The core file for running JavaScript on the web or on a robot. It contains
// the basic models for interfacing with the Robot Operating System, including
// node, publisher, and subscriber.
// 
// When run in the browser, ros.js manages the nodes, publishers, and
// subscribers the web page is interested in via REST calls to the robot. It
// also sends and receives messages to the robot using web sockets.
//
// When run on the robot using Node.js, ros.js' functionality is extended to
// interact with the Robot Operating System directly, using XML-RPC and ROS
// specific protocols like TCPROS.

(function() {


  // Initial setup
  // -------------

  // Creates a module compatible with Node.js and the web browser.
  var root     = this
    , server   = false
    , ros      = null

  if (typeof exports !== 'undefined') {
    server   = true
    ros      = exports
    Backbone = require('backbone')
  }
  else {
    ros = root.ros = {}
  }

  // The base URL to send REST requests to. The default is root.
  ros.baseUrl = ''


  // Message
  // -------

  // The Message object will be extended by all ROS messages. For example, the
  // std_msgs/String message will extend Message.
  ros.Message = Backbone.Model.extend({
    idAttribute: 'type'
  , defaults: {
      // The order of the fields, as listed in the message file definition.
      'fieldOrder' : []
      // The message type, e.g. "std_msgs/String".
    , 'type'       : ''
      // The MD5 sum of the message, as calculated by `rosmsg md5sum`.
    , 'md5sum'     : ''
    }
  })


  // Node
  // ----

  // Manages all nodes instantiated through this session. Mainly for updating or
  // removing a node.
  ros.Nodes = Backbone.Collection.extend({
    model: ros.Node
  })
  ros.nodes = new ros.Nodes()

  // Creates a node and returns the created node in the callback or an error if
  // the node creation failed.
  //
  // Node attributes include:
  //  * name - The node name.
  ros.createNode = function(attributes, callback) {
    var that = this

    var node = new ros.Node(attributes)

    // Makes a REST call to the server with the node attributes.
    node.save(null, {
      // Adds the node to the list and returns the created node.
      success: function(data) {
        that.nodes.add(node)
        callback(null, node)
      }
      // Returns the error encountered when saving the node.
    , error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown)
      }
    })
  }

  // A node maintains a collection of publishers and subscribers for topics.
  ros.Node = Backbone.Model.extend({

    // Sets the node ID to its name.
    idAttribute: 'name'
    // Sets the REST end point for managing the node.
  , urlRoot    : ros.baseUrl + '/nodes'

  , initialize: function(attributes, options) {
      if (!this.publishers) {
        this.publishers = new this.Publishers()
      }
      if (!this.subscribers) {
        this.subscribers = new this.Subscribers()
      }
    }

  , Publishers: Backbone.Collection.extend({
      model: ros.Publisher
    })

  , Subscribers : Backbone.Collection.extend({
      model: ros.Subscriber
    })

    // Creates a publisher for a given topic. Returns the publisher in the
    // callback after successfully registering it or an error if registering the
    // publisher failed.
    //
    // Publisher attributes include:
    //  * topic   - The topic name.
    //  * Message - The message type being published. This is the uninitialized
    //    Message model, like std_msgs.Header or geometry_msgs.Twist.
  , createPublisher: function(attributes, callback) {
      var that = this
      attributes.nodeId = this.id

      // Makes a REST call to the robot with the publisher attributes.
      var publisher = new ros.Publisher(attributes)
      publisher.save(null, {
        // On success, adds the publisher to the node's list and returns the
        // publisher in the callback.
        success: function(data) {
          that.publishers.add(publisher)
          callback(null, publisher)
        }
        // Returns any error from registering the publisher.
      , error: function(jqXHR, textStatus, errorThrown) {
          callback(errorThrown)
        }
      })
    }

  , removePublisher: function(publisher) {
      this.publishers.remove(publisher)
      publisher.destroy()
    }

    // Creates a subscriber for a given topic. Returns the subscriber in the
    // callback after successfully registering it or an error if registering the
    // subscriber failed.
    //
    // Subscriber attributes include:
    //  * topic   - The topic name.
    //  * Message - The message type being subscribed to. This is the
    //    uninitialized Message model, like std_msgs.Header or
    //    geometry_msgs.Twist.
  , createSubscriber: function(attributes, callback) {
      var that = this
      attributes.nodeId = this.id

      // Makes a REST call to the robot with the subscriber attributes.
      var subscriber = new ros.Subscriber(attributes)
      subscriber.save(null, {
        // On success, adds the subscriber to the node's list and returns the
        // subscriber in the callback.
        success: function(data) {
          that.subscribers.add(subscriber)
          callback(null, subscriber)
        }
        // Returns any error from registering the subscriber.
      , error: function(jqXHR, textStatus, errorThrown) {
          callback(errorThrown)
        }
      })
    }

  , removeSubscriber: function(subscriber) {
      this.subscribers.remove(subscriber)
      subscriber.destroy()
    }
  })


  // Publisher
  // ---------

  // The publisher sends messages for a given topic.
  ros.Publisher = Backbone.Model.extend({

    defaults: {
      // The default ROS protocol for communicating with other nodes.
      protocol: 'TCPROS'
    }

  , initialize: function(attributes) {
      var that = this

      // The REST end point for managing the publisher.
      this.urlRoot = ros.baseUrl
        + '/nodes/'
        + this.get('nodeId')
        + '/publishers'

      // Creates the message type from the uninitialized Message model.
      var Message = this.get('Message')
      if (Message) {
        var message     = new Message()
          , messageType = message.get('type')
        this.set({ messageType: messageType })
      }

      var topic = this.get('topic')
      if (topic) {
        // Sets the publisher ID to the topic's name
        this.id = topic

        // Opens up a web socket using socket.io to publish messages on
        if (!server) {
          var namespacedTopic = '/' + topic
          var socket = ros.io.connect(namespacedTopic)
          socket.on('connect', function() {
            that.socket = socket
          })
        }
      }

    }

    // Publishes a message to the robot using web sockets
  , publish: function(message, callback) {
      if (this.socket === undefined) {
        var error = new Error('Socket not connected to server')
        callback(error)
      }
      else {
        this.socket.emit('message', message)
      }
    }
  })


  // Subscriber
  // ---------

  // The subscriber receives messages for a given topic.
  ros.Subscriber = Backbone.Model.extend({

    defaults: {
      // The default ROS protocol for communicating with other nodes.
      protocol: 'TCPROS'
    }

  , initialize: function(attributes) {
      var that = this

      // The REST end point for managing the subscriber.
      this.urlRoot = ros.baseUrl
        + '/nodes/'
        + this.get('nodeId')
        + '/subscribers'

      // Creates the message type from the uninitialized Message model.
      var Message = this.get('Message')
      if (Message) {
        var message     = new Message()
          , messageType = message.get('type')
        this.set({ messageType: messageType })
      }

      var topic = this.get('topic')
      if (topic) {
        // Sets the subscriber ID to the topic's name.
        this.id = topic

        // Listens for messages published from the robot. Messages are received
        // over a web socket using socket.io.
        if (!server) {
          var namespacedTopic = '/' + topic
          var socket = ros.io.connect(namespacedTopic)
          socket.on('connect', function() {
            that.socket = socket

            // When a  message is received over the web socket, emits an event
            // with the message data for others to handle (like the subscribe
            // function).
            socket.on('message', function(message) {
              that.trigger('message', message)
            })
          })
        }
      }
    }

    // When a message is received from the server, calls back with the message
    // object. This can happen multiple times.
  , subscribe: function(callback) {
      // Knows a message is received by listening for the event.
      this.bind('message', function(message) {
        callback(null, message)
      })
    }
  })

}).call(this)

