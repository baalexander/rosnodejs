var master = require('./master')


function Publisher(node) {
  if (false === (this instanceof Publisher)) {
    return new Publisher(node);
  }

  this.node = node
}

Publisher.prototype.publish = function(topic, message) {
  master.registerPublisher(this.node, topic, message.type, function(error, value) {
    console.log('RESPONSES FROM MASTER')
    console.log(error)
    console.log(value)
  })
  this.node.emit('published', topic)
}

module.exports = Publisher

