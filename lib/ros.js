var Node   = require('./node')
  , master = require('./master')

var ros = exports

ros.createNode = function(name) {
  return new Node(name)
}

ros.getMaster = function() {
  return master;
}

