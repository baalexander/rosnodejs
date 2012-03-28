var should = require('should')
  , ros    = require('../lib/ros')

describe('How to use rosnodejs', function() {

  it('to publish messages', function(done) {
    var node = ros.node('talker');
    node.topics([
      { topic: 'hello_world', messageType: 'std_msgs/String' }
    ], function(helloWorld) {
      helloWorld.publish();
      setTimeout(done, 1500);
    });
  });

})
