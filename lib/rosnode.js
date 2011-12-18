// Ros.js is the core file for running JavaScript on the web or on a robot. It
// contains the basic models for interfacing with the Robot Operating System,
// including node, publisher, and subscriber.
//
// By default, ros.js communicates using REST and web sockets. Rosnode.js
// extends the prototypes of most of the ros.js models to communicate directly
// with the Robot Operating System using XML-RPC and ROS protocols like TCPROS.
var ros = require('../public/ros')

// Each module will extend the ros.js models for interfacing with ROS.
var node       = require('./node')
  , publisher  = require('./publisher')
  , subscriber = require('./subscriber')

module.exports = ros

