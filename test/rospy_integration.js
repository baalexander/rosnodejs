var exec   = require('child_process').exec
  , path   = require('path')
  , fs     = require('fs')
  , should = require('should')
  , ros    = require('../lib/ros')
  ;

var ROS_PACKAGE_PATH = 'ROS_PACKAGE_PATH=$ROS_PACKAGE_PATH:' + __dirname;
var ROSPY_INTEGRATION_PATH = path.join(__dirname, 'rospy_integration');

describe('Rospy', function() {

  before(function(done) {
    this.timeout(5000);

    // Builds the rospy_integration package
    var buildCommand = [
      'cd ' + ROSPY_INTEGRATION_PATH
    , ROS_PACKAGE_PATH + ' make'
    ].join(';');

    var child = exec(buildCommand, function(error, stdout, stderr) {
      if (error) {
        error.message = stderr || stdout || error.message;
      }
      done(error);
    });
  });

  after(function(done) {
    this.timeout(5000);

    // Cleans the rospy_integration package
    var cleanCommand = [
      'cd ' + ROSPY_INTEGRATION_PATH
    , ROS_PACKAGE_PATH + ' make clean'
    ].join(';');

    var child = exec(cleanCommand, function(error, stdout, stderr) {
      if (error) {
        error.message = stderr || stdout || error.message;
      }
      done(error)
    });
  });

  it('should subscribe to a rosnodejs publisher', function(done) {
    this.timeout(5000);

    ros.types([
      'std_msgs/String'
    ], function(String) {

      var message = new String({ data: 'howdy' });

      // Runs rospy subscriber node
      var runCommand =  ROS_PACKAGE_PATH + ' rosrun rospy_integration subscriber.py';
      var child = exec(runCommand, function(error, stdout, stderr) {
        if (error) {
          error.message = stderr || stdout || error.message;
          done(error);
        }
        else {
          // Retrieves the file outputted by the rospy subscriber
          var outputFile = path.join(ROSPY_INTEGRATION_PATH, 'rospy_subscriber_output.json');
          fs.readFile(outputFile, function (error, json) {
            if (error) {
              done(error);
            }
            else {
              var outputValues = JSON.parse(json);
              outputValues.data.should.equal('howdy');

              fs.unlink(outputFile, function (error) {
                publisher.unpublish();
              });
            }
          });
        }
      });

      var publisher = new ros.topic({
        node        : 'rosnodejs_publisher'
      , topic       : 'rospy_integration_subscribe'
      , messageType : String
      });

      publisher.on('unregistered_publisher', done);

      publisher.publish(message);
    });

  });

});

