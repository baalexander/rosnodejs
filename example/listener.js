ros.io = io
ros.createNode({ name: 'chatter' }, function(error, node) {
  var subscriberParams = {
    topic:   'chatter'
  , Message: std_msgs.Int32
  }
  node.createSubscriber(subscriberParams, function(error, subscriber) {
    if (error) {
      console.log(error)
    }
    else {
      subscriber.subscribe(function(error, message) {
        console.log('SUBSCRIBE RESPONSE')
        console.log('ERROR: ')
        console.log(error)
        console.log('MESSAGE: ')
        console.log(message)
        console.log('END SUBSCRIBE RESPONSE')
      })
    }
  })
})

