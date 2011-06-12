var ros = require('../lib/ros')

var node = ros.createNode('talker')

var subscriber = node.createSubscriber()
subscriber.subscribe('chatter', function(error, message) {

})

var publisher = node.createPublisher()
publisher.publish('chatter', 'hi!')

publisher.unregister('chatter')
subscriber.unregister('chatter')
