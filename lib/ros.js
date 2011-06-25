var Node     = require('./node')
  , master   = require('./master')
  , messages = require('./messages')

var ros = exports

ros.messages = messages

ros.createNode = function(name) {
  return new Node(name)
}

ros.getMaster = function() {
  return master;
}

