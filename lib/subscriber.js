var master = require('./master')


function Subscriber(node) {
  if (false === (this instanceof Subscriber)) {
    return new Subscriber(node);
  }

  this.node = node
}

Subscriber.prototype.subscribe = function(topic, callback) {
  this.node.on(topic, callback)

  master.registerSubscriber(this.node.getId(), this.node, topic, 'std_msgs/String', function(error, value) {
    console.log('REGISTER SUBSCRIBER RESPONSE FROM MASTER')
    console.log('ERROR: ' + error)
    console.log('VALUE: ' + value)
  })

  this.node.emit('subscribed', topic)
}

Subscriber.prototype.unregister = function(topic) {
  master.unregisterSubscriber(this.node.getId(), this.node, topic, function(error, value) {
    console.log('UNREGISTER SUBSCRIBER RESPONSE FROM MASTER')
    console.log('ERROR: ' + error)
    console.log('VALUE: ' + value)
  })
  this.node.emit('unpublished', topic)
}

module.exports = Subscriber

