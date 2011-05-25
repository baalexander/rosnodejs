var Node = require('./node')

var ros = exports

ros.createNode = function(name) {
  return new Node(name)
}

