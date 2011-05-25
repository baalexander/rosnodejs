var ros = require('../lib/ros')

var node = ros.createNode('talker')
console.log(node)

var publisher = node.createPublisher()
publisher.publish('chatter', 'hi!')

