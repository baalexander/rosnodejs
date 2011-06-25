var ros    = require('../lib/ros')

var master = ros.getMaster()
var node   = ros.createNode('talker')

var topic = { name: 'chatter', type: 'std_msgs/String' }
var subscriber = node.createSubscriber(topic)
subscriber.subscribe('chatter', function(error, message) {
  console.log(message)
})

var publisher = node.createPublisher(topic)
ros.messages.createFromPackage('std_msgs', 'String', function(error, message) {
  message.data = 'hi!'
  console.log(message)
  publisher.publish(message)
})

master.getSystemState('/test', function(error, value) {
  console.log('SYSTEM STATE:')
  console.log(value)
})

master.lookupNode('/test', 'talker', function(error, value) {
  console.log('LOOKUP NODE:')
  console.log(value)
})

//publisher.unregister(topic)
//subscriber.unregister(topic)

