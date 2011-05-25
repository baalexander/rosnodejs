
function Publisher(node) {
  if (false === (this instanceof Publisher)) {
    return new Publisher(node);
  }

  this.node = node
}

Publisher.prototype.publish = function(topic, message) {
  this.node.emit('published', topic)
}

module.exports = Publisher

