var exec          = require('child_process').exec
  , fs            = require('fs')
  , path          = require('path')
  , should        = require('should')
  , rimraf        = require('rimraf')
  , ros           = require('../lib/rosnode')
  , std_msgs      = require('./std_msgs')
  , geometry_msgs = require('./geometry_msgs')

describe('How to use rosnodejs', function() {

  it('to create a package', function(done) {
    // Software in ROS is organized in packages. A package can be a collection
    // of ROS nodes, data files, even third-party libraries. There are hundreds
    // of packages people have provided for ROS, ranging from object
    // recognition to localization.
    //
    // After installing ROS, creating a new rosnodejs project is similar to
    // creating any new ROS package. ROS provides the `roscreate-pkg` command
    // to begin.
    //
    // For more information:
    //  * Create a package - http://www.ros.org/wiki/ROS/Tutorials/CreatingPackage
    //  * List of packages - http://www.ros.org/browse/list.php

    // Create a ROS package named "how_to".
    var createPackage = 'roscreate-pkg how_to'
    var child = exec(createPackage, function(error, stdout, stderr) {
      should.not.exist(error)

      // The manifest.xml file is a specification file for the package,
      // describing compilation tools, dependencies, authors, and more.
      path.exists('how_to/manifest.xml', function (exists) {
        exists.should.be.true

        // The JavaScript ROS nodes should go in a "lib" or "js" directory in
        // the package. For example, ./how_to/js/listener.js could contain a
        // ROS node named listener.

        // Rosnodejs can be included like any NPM module with:
        // `npm install rosnodejs`.

        // Clean up package. Rimraf is an rm -rf module for node.
        rimraf('how_to', function(error) {
          done(error)
        })
      })
    })
  })

  it('to create a node', function(done) {
    // The Robot Operating System is a graph of nodes. Each node is programmed
    // to perform a task. For example, a node may transmit sensor data from a
    // Kinect (publish a message) while another node listens for Kinect sensor
    // data (subscribes to the messages) and processes that data.
    //
    // Almost all actions performed with rosnodejs will begin by creating a ROS
    // node. These nodes can later be customized to publish or subscribe to
    // messages over topics and then do something interesting with the data.
    //
    // For more information:
    //  * http://www.ros.org/wiki/ROS/Tutorials/UnderstandingNodes

    // Create a node named 'talker' and registers it with ROS Master. ROS Master
    // is the central authority for keeping track of all the nodes in the graph
    // and helps connect the other nodes so they can talk to each other.
    ros.createNode({ name: 'talker' }, function(error, node) {
      // On successfully registering the node, the node object is returned.
      node.should.be.an.instanceof(ros.Node)

      // Node attributes can be retrieved with get().
      node.get('name').should.equal('talker')

      // A node contains a collection of publishers and subscribers. A publisher
      // sends messages for a topic. A subscriber listens to messages for a
      // given topic. The 'talking to' and 'listening to other node' examples go
      // into more detail about publishers and subscribers.
      node.publishers.length.should.equal(0)
      node.subscribers.length.should.equal(0)

      done(error)
    })
  })

  it('to create a message', function() {
    // The message is one of the fundamental medium for nodes to communicate
    // with each other in ROS.
    //
    // A message is derived from a message type, a defined set of data types the
    // message will contain. The message type to message relation can be
    // considered similar to the class to object relation.
    //
    // A ROS package will usually define a set of message types. For example,
    // the std_msgs package defines message types for a set of basic data types,
    // like std_msgs/String and std_msgs/Int32.
    //
    // To make things easier, rosnodejs provides a JavaScript model for
    // representing message objects. Rosnodejs handles serializing and
    // deserializing these messages for communicating with other nodes.
    //
    // The rosmsgjs project creates JavaScript files containing all the message
    // types for a given package.
    //
    // For more information:
    //  * http://www.ros.org/wiki/msg
    //  * https://github.com/baalexander/rosmsgjs

    // Std_msgs is a JavaScript module containing JavaScript objects for all the
    // message types in the std_msgs package. This module was generated from the
    // rosmsgjs project.
    var message = new std_msgs.String()

    // All messages extend the Message object.
    message.should.be.an.instanceof(ros.Message)

    // A message's attributes are accessed with set() and get(). The attribute
    // names correspond to the field names from the message type definition.
    message.set({ data: 'A robot may not injure a human being.' })
    message.get('data').should.equal('A robot may not injure a human being.')

    // All messages have the 'type' property and 'md5sum' property to identify
    // the message type.
    // The type property is the message type.
    message.get('type').should.equal('std_msgs/String')
    // The MD5 sum is the hash of the message fields to verify with other nodes
    // that this is the correction version of the message type.
    message.get('md5sum').should.equal('992ce8a1687cec8c8bd883ec73ca41d1')
  })

  it('to talk to other nodes', function(done) {
    // A node talks to other nodes by publishing messages for a topic. The nodes
    // interested in the messages subscribe to the same topic. A node that
    // publishes messages for a topic is known as a publisher for that topic. A
    // node can be a publisher for one or many topics.
    //
    // In rosnodejs, a node creates a publisher for each topic it wants to
    // publish on.
    //
    // Behind the scenes, a node declares itself as a publisher for a topic by
    // registering itself as a publisher for the topic with ROS Master. ROS
    // Master keeps track of what topic every node is publishing or subscribing
    // to and helps them communicate with one another.

    // The 'keyboard' node will be the node publishing messages.
    ros.createNode({ name: 'keyboard' }, function(error, node) {

      // This node will tell a robot to move forward by publishing the
      // directions.
      //
      // A publisher requires two pieces of information to register itself with
      // ROS Master:
      //  * The topic the messages will be published for (a string value)
      //  * And the message type of the messages being published.
      var publisherParams = {
        // 'cmd_vel' is a common topic used for giving directions to a robot. A
        // publisher for the 'cmd_vel' topic could be a keyboard node, listening
        // to arrow key events and converting those to movement directions.
        topic:   'cmd_vel'
        // A common message type for movement directions is geometry_msgs/Twist.
        // The message type contains the information for linear directions and
        // turns.
      , Message: geometry_msgs.Twist
      }

      // The node registers itself as a publisher for the 'cmd_vel' topic,
      // saying it will publish messages of the geometry_msgs/Twist type.
      node.createPublisher(publisherParams, function(error, publisher) {

        // On successfully registering the publisher with ROS Master, the
        // publisher object is returned.
        publisher.should.be.an.instanceof(ros.Publisher)

        // The movement direction being published tells the robot to move
        // forward with a speed of 1.
        //
        // Geometry_msgs/Twist has two fields, linear and angular, which happen
        // to be messages themselves of type geometry_msgs/Vector3.
        var message = new geometry_msgs.Twist()
        message.set({
          linear: {
            x: 1.0
          , y: 0.0
          , z: 0.0
          }
        , angular: {
            x: 0.0
          , y: 0.0
          , z: 0.0
          }
        })

        // Publishes the message. This will broadcast the movement directions to
        // whatever nodes are subscribing to the 'cmd_vel' topic. The beauty of
        // ROS is that the publisher node deciding which direction the robot
        // should move is decoupled from the node that actually moves the robot.
        publisher.publish(message, function(error) {
          done(error)
        })
      })
    })
  })

  it('to listen to other nodes', function(done) {
    // ROS uses a publish/subscribe method for nodes, where a node will publish
    // messages on a topic and other nodes can subscribe to that topic to
    // receive the messages. A node that subscribes to a topic is knowns as a
    // subscriber.
    //
    // One big advantage of the publish/subscribe method for ROS nodes is the
    // subscriber nodes do not need to care where the messages originated. For
    // example, a node may subscribe to the sensor_msgs/Range message type of
    // topic 'distance_data' to determine if the robot is approaching a wall.
    // The node publishing messages to the 'distance_data' topic could be using
    // an IR sensor or an ultrasound sensor, but the subscribing node does not
    // care, it just needs the distance.
    //
    // In rosnodejs, a node creates a subscriber for each topic it wants to
    // listen to.

    // The 'motor' node will be subscribing to movement direction messages.
    // While the messages will be generic directions, the 'motor' node will
    // interpret the directions and decide how to move the robots motors.
    ros.createNode({ name: 'motor' }, function(error, node) {

      // A subscriber requires two pieces of information to register itself with
      // ROS Master:
      //  * The topic the subscriber is interested in (a string value).
      //  * And the message type of the messages being subscribed to.
      var subscriberParams = {
        // 'cmd_vel' is a common topic used for giving directions to a robot.
        topic:   'cmd_vel'
        // A common message type for movement directions is geometry_msgs/Twist.
      , Message: geometry_msgs.Twist
      }

      // The node registers itself as a subscriber for the 'cmd_vel' topic,
      // letting ROS master and other nodes know it is interested in messages of
      // the geometry_msgs/Twist type.
      node.createSubscriber(subscriberParams, function(error, subscriber) {

        // When messages are published for the 'cmd_vel' topic, the callback for
        // subscribe() will be called with the message object. This callback
        // will be called every time a message is published.
        subscriber.subscribe(function(error, message) {

          message.get('type').should.equal('geometry_msgs/Twist')

          // The geometry_msgs/Twist message type has two fields that are
          // message types too: linear and angular.
          // The linear field contains linear movement directions for the robot.
          var linear = message.get('linear')
          linear.get('type').should.equal('geometry_msgs/Vector3')
          // A value of 1.0 for linear's x implies the robot should move forward
          // at a speed of 1.
          linear.get('x').should.equal(1.0)
          linear.get('y').should.equal(0.0)
          linear.get('z').should.equal(0.0)

          // The angular field contains rotational movement directions for the
          // robot.
          var angular = message.get('angular')
          angular.get('type').should.equal('geometry_msgs/Vector3')
          angular.get('x').should.equal(0.0)
          angular.get('y').should.equal(0.0)
          angular.get('z').should.equal(0.0)

          // Now that a message is received, it is up to the node on what
          // actions to take based on the message data. This 'motor' node could
          // read the message's linear.x value of 1.0 and decide to make the
          // robot move forward.
          //
          // More concretely, if an Arduino was controlling the motors, the
          // Arduino could be connected to the computer running ROS listening
          // for serial commands.  This 'motor' node could then output whatever
          // command the Arduino was expecting to move forward.

          done(error)
        })
      })

      // ROS comes with several command-line tools like rosmsg and rostopic.
      // Rostopic can be used to debug messages by publishing or subscribing to
      // topics. Rostopic is used here to publish a geometry_msgs/Twist message
      // over the topic 'cmd_vel' in order to test the subscribing node.
      var publishCommand = 'rostopic'
        + ' pub'
        + ' /cmd_vel'
        + ' geometry_msgs/Twist'
        + " '{linear:  {x: 1.0, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.0}}'"
      var child = exec(publishCommand, function(error, stdout, stderr) {
        should.not.exist(error)
      })
    })
  })

})
