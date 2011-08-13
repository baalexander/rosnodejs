(function() {

  // Ros Module
  // ---------

  var root = this

  var ros = null
  if (typeof exports !== 'undefined') {
    Backbone = require('backbone')
    ros = exports
  }
  else {
    ros = root.ros = {}
  }

  ros.baseUrl = ''

  // Ros.Message
  // -----------

  ros.Message = Backbone.Model.extend({
    idAttribute: 'type'
  }
  , {
    // Type is a class property so ros.Message (or a derivative) can be passed
    // on its own and the type attribute inferred
    type: null
  })

  // Ros.Topic
  // -----------

  ros.Topic = Backbone.Model.extend({
    idAttribute: 'name'
  })

  // Ros.Nodes
  // ---------

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

  // Ros.Node
  // ---------

  ros.Node = Backbone.Model.extend({

    idAttribute: 'name'
  , urlRoot    : ros.baseUrl + '/nodes'

  , initialize: function(attributes, options) {
      if (!this.publishers) {
        var publishers = new this.Publishers()
        this.publishers = publishers
      }
    }

  , Publishers: Backbone.Collection.extend({
      model: ros.Publisher
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
      return publisher
    }

  , removePublisher: function(publisher) {
      this.publishers.remove(publisher)
      publisher.destroy()
    }
  })

  // Ros.Publisher
  // -------------

  ros.Publisher = Backbone.Model.extend({
    idAttribute : 'topic'

  , initialize: function(attributes) {
      this.urlRoot = ros.baseUrl + '/nodes/' + this.get('nodeId') + '/publishers'
    }

  , publish: function(message) {
      console.log('publish')
    }
  })

}).call(this)

