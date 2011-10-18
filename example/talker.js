ros.io = io
ros.createNode({ name: 'talker' }, function(error, node) {
  var publisherParams = {
    topic:   'chatter'
  , Message: std_msgs.Int32
  }

  node.createPublisher(publisherParams, function(error, publisher) {
    var message = new std_msgs.Int32({ data: 12 })

    setTimeout(function() {
      publisher.publish(message, function(error) {
        console.log(error)
      })
    }, 2000)
  })
})

