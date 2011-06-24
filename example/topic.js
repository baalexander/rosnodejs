var ros    = require('../lib/ros')
var msgs   = require('../lib/msgs')

msgs.createFromPackage('std_msgs', 'String', function(){})

/*var master = ros.getMaster()
var node   = ros.createNode('talker')

var subscriber = node.createSubscriber()
subscriber.subscribe('chatter', function(error, message) {

})

var publisher = node.createPublisher()
publisher.publish('chatter', 'hi!')

master.getSystemState('/test', function(error, value) {
  console.log('SYSTEM STATE:')
  console.log(value)
})

master.lookupNode('/test', 'talker', function(error, value) {
  console.log('LOOKUP NODE:')
  console.log(value)
})*/

//publisher.unregister('chatter')
//subscriber.unregister('chatter')

