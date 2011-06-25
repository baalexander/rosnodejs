var master = require('./master')


function Publisher(topic, node) {
  if (false === (this instanceof Publisher)) {
    return new Publisher(topic, node);
  }

  this.topic = topic
  this.node  = node

  // For bookkeeping, let Node know topic being published
  this.node.emit('publishing', topic)

  // Register Publisher with Master
  master.registerPublisher(this.node.getId(), this.node, this.topic, function(error, value) {
    console.log('REGISTER PUBLISHER  RESPONSE FROM MASTER')
    console.log('ERROR: ' + error)
    console.log('VALUE: ' + value)
  })
}

Publisher.prototype.unregister = function() {
  // Unregister Publisher with Master
  master.unregisterPublisher(this.node.getId(), this.node, this.topic, function(error, value) {
    console.log('UNREGISTER PUBLISHER RESPONSE FROM MASTER')
    console.log('ERROR: ' + error)
    console.log('VALUE: ' + value)
  })

  // For bookkeeping, let Node know topic not being published anymore
  this.node.emit('stopped_publishing', topic)
}

Publisher.prototype.publish = function(message) {
  this.node.emit('published', message)
}

module.exports = Publisher

