
function Subscriber(node) {
  if (false === (this instanceof Subscriber)) {
    return new Subscriber(node);
  }

  this.node = node
}

Subscriber.prototype.subscribe = function(topic, callback) {
  this.node.on(topic, callback)

  this.node.emit('subscribed', topic)
}

module.exports = Subscriber

