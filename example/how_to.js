var should = require('should')
  , ros    = require('../lib/ros')

describe('How to use rosnodejs', function() {

  it('to publish messages', function(done) {
    var topicParams = {
      topic: 'hello_world'
    , messageType: 'std_msgs/String'
    };

    var node = ros.node('talker');
    node.topic(topicParams, function(socket) {
      socket.publish();
      done();
    });
  });

})
