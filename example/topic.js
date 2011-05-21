var ros = require('rosnodejs')


// Publisher
setTimeout(function() {
  // Register Node with Master
  ros.createNode('talker')

  // Creates a Publisher for publishing topics
  var publisher = ros.createPublisher('chatter')

  // Creates a String object with the correct properties
  var message = ros.message.createFromPackage('std_msgs', 'String')
  message.data = 'Hello beautiful world!'

  while (ros.ok()) {
    publisher.publish(message)
  }
}, 1)

// Subscriber
// Give it a bit for the publisher to notify Master
setTimeout(function() {
  // Register Node with Master
  ros.createNode('listener')

  // Creates a Subscriber for publishing topics
  var subscriber = ros.createSubscriber('chatter', function(message) {
    G
  })

}, 1000)

//////////////////////////////////////////////////

setTimeout(function() {
  var node = ros.createNode('talker')
  var topic = node.createTopic('chatter')
  var message = ros.message.createFromPackage('std_msgs', 'String')
  message.data = 'Hello again!'

  while (ros.ok()) {
    topic.publish(message)
  }
}, 1)

setTimeout(function() {
  var node = ros.createNode('listener')
  var topic = node.createTopic('chatter')

  topic.subscribe(function(message) {
    console.log(message.data)
  })
  node.spin()
}, 1)

//////////////////////////////////////////////////

setTimeout(function() {
  var node = ros.createNode('talker')
  var message = ros.message.createFromPackage('std_msgs', 'String')
  message.data = 'Hello again!'

  while (ros.ok()) {
    node.topic.publish('chatter', message)
  }
}, 1)

setTimeout(function() {
  var node = ros.createNode('listener')

  node.topic.subscribe('chatter', function(message) {
    console.log(message.data)
  })
  node.spin()
}, 1)

//////////////////////////////////////////////////

// Or just ros.publish() and ros.subscribe
