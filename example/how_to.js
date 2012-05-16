var exec   = require('child_process').exec
  , should = require('should')
  , ros    = require('../lib/ros')
  ;

describe('How to use rosnodejs', function() {

  it('to publish messages', function(done) {
    this.timeout(5000);

    ros.types([
      'std_msgs/String'
    ], function(String) {

      // Uses the ROS command line tool rostopic to echo messages published
      // over the 'publish_example' topic.
      var subscribeCommand = 'rostopic'
        + ' echo'
        + ' /publish_example'
        + ' -n 1'
        ;
      var child = exec(subscribeCommand, function(error, stdout, stderr) {
        should.not.exist(error);
      });

      // Creates the topic 'publish_example'
      var publisher = new ros.topic({
        node        : 'talker'
      , topic       : 'publish_example'
      , messageType : String
      });

      publisher.on('unregistered_publisher', done);

      // Sends a std_msgs/String message over the 'publish_example' topic.
      var message = new String({ data: 'howdy' });
      publisher.publish(message);

      // Unregister as a publisher for test clean up
      setTimeout(function() {
        publisher.unregisterPublisher();
      }, 1000);
    });
  });

  // it('to subscribe to messages', function(done) {
  //   this.timeout(5000);

  //   ros.types([
  //     'std_msgs/String'
  //   ], function(String) {

  //     // Creates the topic 'subscribe_example'
  //     var subscriber = new ros.topic({
  //       node        : 'listener'
  //     , topic       : 'subscribe_example'
  //     , messageType : String
  //     });

  //     subscriber.on('unregistered_subscriber', done);

  //     // Subscribes to the 'subscribe_example' topic
  //     subscriber.subscribe(function(message) {
  //       message.data.should.equal('howdy');

  //       // Unregister as a subscriber for test cleanup
  //       subscriber.unregisterSubscriber();
  //     });

  //     // Uses rostopic to publish a message on the subscribed to topic.
  //     var publishCommand = 'rostopic'
  //       + ' pub'
  //       + ' /subscribe_example'
  //       + ' std_msgs/String'
  //       + ' howdy'
  //       + ' --once'
  //       ;
  //     var child = exec(publishCommand, function(error, stdout, stderr) {
  //       should.not.exist(error);
  //     });
  //   });
  // });

});

