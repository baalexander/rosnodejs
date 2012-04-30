var exec   = require('child_process').exec
, ros    = require('./lib/ros')

ros.types([
          'std_msgs/String'
], function(String) {
  var topic = ros.topic({ topic: 'hello_world', 
                        messageType: String , 
                        node:'receiver',
                        mode: 'subscribe'});

                        topic.subscribe(function(message) {
                          console.log("New data receigned:" , message);
                        });

});

