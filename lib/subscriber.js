var master = require('./master')


function Subscriber(topic, node) {
  if (false === (this instanceof Subscriber)) {
    return new Subscriber(topic, node);
  }

  this.topic = topic
  this.node  = node

  // For bookkeeping, let Node know topic being subscribed
  this.node.emit('subscribing', topic)

  // Register Subscriber with Master
  master.registerSubscriber(this.node.getId(), this.node, this.topic, function(error, value) {
    console.log('REGISTER SUBSCRIBER RESPONSE FROM MASTER')
    console.log('ERROR: ' + error)
    console.log('VALUE: ' + value)
  })

  this.node = node
}

Subscriber.prototype.unregister = function(topic) {
  // Unregister Subscriber with Master
  master.unregisterSubscriber(this.node.getId(), this.node, this.topic, function(error, value) {
    console.log('UNREGISTER SUBSCRIBER RESPONSE FROM MASTER')
    console.log('ERROR: ' + error)
    console.log('VALUE: ' + value)
  })

  // For bookkeeping, let Node know topic not being subscribed anymore
  this.node.emit('stopped_subscribing', topic)
}

Subscriber.prototype.subscribe = function(callback) {

}

module.exports = Subscriber

