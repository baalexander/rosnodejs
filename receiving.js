var exec   = require('child_process').exec
, ros    = require('./lib/ros')


ros.types([
    'std_msgs/String'
    ], function(String) {
      var node = ros.node('receiver');
      node.topics([
        { topic: 'hello_world', messageType: String }
        ], function(subscribeExample) {
          subscribeExample.subscribe(function(message) {
            console.log("New data receigned:" , message);
          });

        });
    });

