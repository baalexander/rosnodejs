(function() {


/////////////////////////////////////////////////////////////////////////////
// ros
/////////////////////////////////////////////////////////////////////////////

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

  ros.baseUrl = ''


/////////////////////////////////////////////////////////////////////////////
// ros.Message
/////////////////////////////////////////////////////////////////////////////

  ros.Message = Backbone.Model.extend({
    idAttribute: 'type'
  }
  , {
    // Class properties so ros.Message (or a derivative) can be passed on its
    // own and the attributes inferred
    type: null
  , md5sum: null
  })


/////////////////////////////////////////////////////////////////////////////
// ros.Topic
/////////////////////////////////////////////////////////////////////////////

  ros.Topic = Backbone.Model.extend({
    idAttribute: 'name'
  })


/////////////////////////////////////////////////////////////////////////////
// ros.Nodes
/////////////////////////////////////////////////////////////////////////////

  ros.Nodes = Backbone.Collection.extend({
    model: ros.Node
  })
  ros.nodes = new ros.Nodes()

  ros.createNode = function(attributes, callback) {
    var that = this

    var node = new ros.Node(attributes)
    node.save(null, {
      success: function(data) {
        that.nodes.add(node)
        callback(null, node)
      }
    , error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown)
      }
    })
  }


/////////////////////////////////////////////////////////////////////////////
// ros.Node
/////////////////////////////////////////////////////////////////////////////

  ros.Node = Backbone.Model.extend({

    idAttribute: 'name'
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

  , createPublisher: function(attributes, callback) {
      var that = this
      attributes.nodeId = this.id

      var publisher = new ros.Publisher(attributes)
      publisher.save(null, {
        success: function(data) {
          that.publishers.add(publisher)
          callback(null, publisher)
        }
      , error: function(jqXHR, textStatus, errorThrown) {
          callback(errorThrown)
        }
      })
    }

  , removePublisher: function(publisher) {
      this.publishers.remove(publisher)
      publisher.destroy()
    }

  , createSubscriber: function(attributes, callback) {
      var that = this
      attributes.nodeId = this.id

      var subscriber = new ros.Subscriber(attributes)
      subscriber.save(null, {
        success: function(data) {
          that.subscribers.add(subscriber)
          callback(null, subscriber)
        }
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


/////////////////////////////////////////////////////////////////////////////
// ros.Publisher
/////////////////////////////////////////////////////////////////////////////

  ros.Publisher = Backbone.Model.extend({

    initialize: function(attributes) {
      var that = this

      this.urlRoot = ros.baseUrl + '/nodes/' + this.get('nodeId') + '/publishers'

      if (attributes.topic !== undefined) {
        // If passed in object is not a Topic instance, creates Topic from
        // object attributes
        var topic = null
        if (!(attributes.topic instanceof ros.Topic)) {
          topic = new ros.Topic(attributes.topic)
          this.set({ topic: topic })
        }

        // Sets the Publisher ID to the topic's name
        topic = this.get('topic')
        this.id = topic.get('name')

        // Publishes messages to the server
        if (!server) {
          var namespacedTopic = '/' + topic.get('name')
          var socket = ros.io.connect(namespacedTopic)
          socket.on('connect', function() {
            that.socket = socket
          })
        }
      }

    }

  , publish: function(message, callback) {
      if (this.socket === undefined) {
        var error = new Error('Socket not connected to server')
        callback(error)
      }
      else {
        console.log(message)
        this.socket.emit('message', message)
      }
    }
  })


/////////////////////////////////////////////////////////////////////////////
// ros.Subscriber
/////////////////////////////////////////////////////////////////////////////

  ros.Subscriber = Backbone.Model.extend({

    initialize: function(attributes) {
      var that = this

      this.urlRoot = ros.baseUrl
        + '/nodes/'
        + this.get('nodeId')
        + '/subscribers'

      if (attributes.topic !== undefined) {
        // If passed in object is not a Topic instance, creates Topic from
        // object attributes
        var topic = null
        if (!(attributes.topic instanceof ros.Topic)) {
          topic = new ros.Topic(attributes.topic)
          this.set({ topic: topic })
        }

        // Sets the Subscriber ID to the topic's name
        topic = this.get('topic')
        this.id = topic.get('name')

        // Listens for messages published from the server
        if (!server) {
          var namespacedTopic = '/' + topic.get('name')
          var socket = ros.io.connect(namespacedTopic)
          socket.on('connect', function() {
            that.socket = socket
            socket.on('message', function(message) {
              that.trigger('message', message)
            })
          })
        }
      }
    }

  , subscribe: function(callback) {
      this.bind('message', function(message) {
        callback(null, message)
      })
    }
  })

}).call(this)

