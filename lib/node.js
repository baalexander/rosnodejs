var util      = require('util')
  , events    = require('events')
  , Publisher = require('./publisher')

function Node(name) {
  if (false === (this instanceof Node)) {
    return new Node(name);
  }

  this.name = name

  events.EventEmitter.call(this);
}
util.inherits(Node, events.EventEmitter)

Node.prototype.createPublisher = function() {
  console.log(this)
  return new Publisher(this)
}

module.exports = Node

