var master = require('./master')


function Publisher(node) {
  if (false === (this instanceof Publisher)) {
    return new Publisher(node);
  }

  this.node = node
}

Publisher.prototype.publish = function(topic, message) {
  master.registerPublisher(this.node, topic, message.type, function() {
    console.log('RECEIVED CALLBACK FROM MASTER')
  })
  this.node.emit('published', topic)
}

module.exports = Publisher

