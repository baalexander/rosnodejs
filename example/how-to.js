var should = require('should')

var ros           = require('../lib/rosnode')
  , std_msgs      = require('./std_msgs')
  , geometry_msgs = require('./geometry_msgs')

describe('How to use rosnodejs', function() {

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

    // The 'talker' node will be the node publishing messages.
    ros.createNode({ name: 'keyboard_node' }, function(error, node) {

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
    done()
  })

})
