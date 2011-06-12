var master = require('./master')


function Publisher(node) {
  if (false === (this instanceof Publisher)) {
    return new Publisher(node);
  }

  this.node = node
}

Publisher.prototype.publish = function(topic, message) {
  master.registerPublisher(this.node.getId(), this.node, topic, 'std_msgs/String', function(error, value) {
    console.log('REGISTER PUBLISHER  RESPONSE FROM MASTER')
    console.log('ERROR: ' + error)
    console.log('VALUE: ' + value)
  })
  this.node.emit('published', topic)
}

Publisher.prototype.unregister = function(topic) {
  master.unregisterPublisher(this.node.getId(), this.node, topic, function(error, value) {
    console.log('UNREGISTER PUBLISHER RESPONSE FROM MASTER')
    console.log('ERROR: ' + error)
    console.log('VALUE: ' + value)
  })
  this.node.emit('unpublished', topic)
}

module.exports = Publisher

