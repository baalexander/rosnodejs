var util   = require('util')
  , events = require('events')
  , master = require('./master')

function Subscriber(topic) {
  if (false === (this instanceof Subscriber)) {
    return new Subscriber(topic);
  }
  this.topic = topic

  // Emits events
  events.EventEmitter.call(this);

}
util.inherits(Subscriber, events.EventEmitter)

Subscriber.prototype.unregister = function(topic) {

  this.emit('unregister', topic)
}

Subscriber.prototype.subscribe = function(callback) {

}

Subscriber.prototype.publisherUpdate = function(publishers, callback) {
  console.log(publishers)
  callback(null)
}

module.exports = Subscriber

