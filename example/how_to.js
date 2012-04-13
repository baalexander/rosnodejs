var should = require('should')
  , ros    = require('../lib/ros')

describe('How to use rosnodejs', function() {

  // it('to publish messages', function(done) {
  //   ros.types([
  //     'std_msgs/String'
  //   ], function(String) {
  //     var node = ros.node('talker');
  //     node.topics([
  //       { topic: 'hello_world', messageType: String }
  //     ], function(helloWorld) {
  //       var message = new String({ data: 'howdy' });
  //       helloWorld.publish(message);
  //       setTimeout(done, 1500);
  //     });
  //   });
  // });

  it('to subscribe to messages', function(done) {
    ros.types([
      'std_msgs/String'
    ], function(String) {
      var node = ros.node('talker');
      node.topics([
        { topic: 'hello_world', messageType: String }
      ], function(helloWorld) {
        helloWorld.subscribe(function(message) {
          message.data.should.equal('howdy');
          done()
        });
      });
    });
  });

});

