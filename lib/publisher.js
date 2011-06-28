var util   = require('util')
  , events = require('events')
  , master = require('./master')


function Publisher(topic) {
  if (false === (this instanceof Publisher)) {
    return new Publisher(topic);
  }
  this.topic = topic

  // Emits events
  events.EventEmitter.call(this);
}
util.inherits(Publisher, events.EventEmitter)

Publisher.prototype.unregister = function() {
  this.emit('unregister', topic)
}

Publisher.prototype.publish = function(message) {
  this.emit('published', message)
}

module.exports = Publisher

