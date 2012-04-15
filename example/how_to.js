var exec   = require('child_process').exec
  , should = require('should')
  , ros    = require('../lib/ros')

describe('How to use rosnodejs', function() {

  it('to publish messages', function(done) {
    this.timeout(5000);

    ros.types([
      'std_msgs/String'
    ], function(String) {
      var node = ros.node('talker');
      node.topics([
        { topic: 'publish_example', messageType: String }
      ], function(publishExample) {
        // Uses the ROS command line tool rostopic to echo messages published
        // over the 'publish_example' topic.
        var subscribeCommand = 'rostopic'
          + ' echo'
          + ' /publish_example';
        var child = exec(subscribeCommand, function(error, stdout, stderr) {
          should.not.exist(error);
        });

        var message = new String({ data: 'howdy' });
        publishExample.publish(message);
        setTimeout(done, 1500);
      });
    });
  });

  it('to subscribe to messages', function(done) {
    this.timeout(5000);

    ros.types([
      'std_msgs/String'
    ], function(String) {
      var node = ros.node('listener');
      node.topics([
        { topic: 'subscribe_example', messageType: String }
      ], function(subscribeExample) {
        subscribeExample.subscribe(function(message) {
          message.data.should.equal('howdy');
          done();
        });

        // Uses rostopic to publish a message on the subscribed to topic.
        var publishCommand = 'rostopic'
          + ' pub'
          + ' /subscribe_example'
          + ' std_msgs/String'
          + ' howdy';
        var child = exec(publishCommand, function(error, stdout, stderr) {
          should.not.exist(error);
        });
      });
    });
  });

});

