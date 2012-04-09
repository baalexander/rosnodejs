var should = require('should')
  , ros    = require('../lib/ros')

describe('How to use rosnodejs', function() {

  it('to publish messages', function(done) {
    ros.types([
      'std_msgs/String'
    ], function(String) {
      var node = ros.node('talker');
      node.topics([
        { topic: 'hello_world', messageType: String }
      ], function(helloWorld) {
        console.log(String);
        var message = new String({ data: 'hello world!' });
        helloWorld.publish(message);
        setTimeout(done, 1500);
      });
    });
  });

})
