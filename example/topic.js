var ros = require('../lib/ros')

var node = ros.createNode('talker')

var subscriber = node.createSubscriber()
subscriber.subscribe('chatter', function(message) {
  console.log('SUBSCRIBEDMESSAGE: ' + message)
})

var publisher = node.createPublisher()
publisher.publish('chatter', 'hi!')

