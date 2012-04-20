var exec   = require('child_process').exec
  , should = require('should')
  , ros    = require('../lib/ros')

describe('How to use rosnodejs', function() {

  it('to publish messages', function(done) {
    this.timeout(5000);

    ros.types([
      'std_msgs/String'
    ], function(String) {
      // Uses the ROS command line tool rostopic to echo messages published
      // over the 'publish_example' topic.
      var subscribecommand = 'rostopic'
        + ' echo'
        + ' /publish_example';
      var child = exec(subscribecommand, function(error, stdout, stderr) {
        should.not.exist(error);
      });

      // Creates the topic 'publish_example'
      var publishExample = new ros.topic({
        node        : 'talker'
      , topic       : 'publish_example'
      , messageType : String
      });

      // Sends a std_msgs/String message over the 'publish_example' topic.
      var message = new String({ data: 'howdy' });
      publishExample.publish(message);
      setTimeout(done, 1500);
    });
  });

  it('to subscribe to messages', function(done) {
    this.timeout(5000);

    ros.types([
      'std_msgs/String'
    ], function(String) {
      // Creates the topic 'subscribe_example'
      var subscribeExample = new ros.topic({
        node        : 'listener'
      , topic       : 'subscribe_example'
      , messageType : String
      });

      // Subscribes to the 'subscribe_example' topic
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

