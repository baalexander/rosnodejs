// The core file for running JavaScript on the web. It contains the basic models
// for interfacing with the Robot Operating System, including node, publisher,
// and subscriber.
//
// Ros.js manages the nodes, publishers, and subscribers the web page is
// interested in via REST calls to the robot. It sends and receives messages to
// the robot using web sockets.
(function() {


  // Initial setup
  // -------------

  var root = this
  var ros  = root.ros = {}
  ros.io = root.io

  // The base URL to send REST requests to. The default is root.
  ros.baseUrl = ''


  // Message
  // -------

  // The Message object will be extended by all ROS messages. For example, the
  // std_msgs/String message will extend Message.
  ros.Message = Backbone.Model.extend({
    idAttribute: 'type'
  , defaults: {
      // The message type, e.g. "std_msgs/String".
    , 'type'   : ''
      // The MD5 sum of the message, as calculated by `rosmsg md5sum`.
    , 'md5sum' : ''
    }
  })


  // Node
  // ----

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
      success: function(model, response) {
        callback(null, model)
      }
    , error: function(model, response) {
        var error = null
        try {
          var errorValues = JSON.parse(response.responseText)
          error = new Error(errorValues.message);
        }
        catch (e) {
          error = new Error('Failed to create Node.')
        }
        callback(error)
      }
    })
  }

  // A node maintains a collection of publishers and subscribers for topics.
  ros.Node = Backbone.Model.extend({

    // Sets the node ID to its name.
    idAttribute: 'name'

    // Sets the REST end point for managing the node.
  , urlRoot : function() {
      return ros.baseUrl + '/nodes'
    }

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
        success: function(model, response) {
          callback(null, publisher)
        }
      , error: function(model, response) {
          var error = null
          try {
            var errorValues = JSON.parse(response.responseText)
            error = new Error(errorValues.message);
          }
          catch (e) {
            error = new Error('Failed to create publisher.')
          }
          callback(error)
        }
      })
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
        success: function(model, response) {
          that.subscribers.add(subscriber)
          callback(null, subscriber)
        }
        // Returns any error from registering the subscriber.
      , error: function(model, response) {
          var error = null
          try {
            var errorValues = JSON.parse(response.responseText)
            error = new Error(errorValues.message);
          }
          catch (e) {
            error = new Error('Failed to create subscriber.')
          }
          callback(error)
        }
      })
    }
  })


  // Publisher
  // ---------

  // The publisher sends messages for a given topic.
  ros.Publisher = Backbone.Model.extend({

    idAttribute: 'topic'

    // The REST end point for managing the publisher.
  , urlRoot : function() {
      return ros.baseUrl
      + '/nodes/'
      + this.get('nodeId')
      + '/publishers'
    }

  , initialize: function(attributes) {
      var that = this

      var topic = this.get('topic')
        , ioUrl = ros.baseUrl + '/' + topic

      this.socket = ros.io.connect(ioUrl)
      this.socket.on('error', function(error) {
        that.trigger('error', error)
      })
    }

  , publish: function(message) {
      this.socket.emit('message', message)
    }
  })


  // Subscriber
  // ---------

  // The subscriber receives messages for a given topic.
  ros.Subscriber = Backbone.Model.extend({

    idAttribute: 'topic'

    // The REST end point for managing the subscriber.
  , urlRoot : function() {
      return ros.baseUrl
      + '/nodes/'
      + this.get('nodeId')
      + '/subscribers'
    }

  , initialize: function(attributes) {
      var that = this

      var topic = this.get('topic')
        , ioUrl = ros.baseUrl + '/' + topic

      this.socket = ros.io.connect(ioUrl)
      this.socket.on('error', function(error) {
        that.trigger('error', error)
      })

      this.socket.on('message', function(message) {
        var rosMessage = new ros.Message(message)
        that.trigger('message', rosMessage)
      })

    }

  , subscribe: function(callback) {
      this.on('message', callback)
    }
  })

}).call(this)

