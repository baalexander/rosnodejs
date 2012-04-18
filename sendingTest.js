var exec   = require('child_process').exec
, ros    = require('./lib/ros')

ros.types([
          'std_msgs/String'
], function(String) {
  var node = new ros.node('talker');
  node.topics([
              { topic: 'hello_world', messageType: String }
  ], {mode:"publish"}, function pub(publishExample) {
    var message = new String({ data: 'howdy' });
    console.log("sending ",message);
    publishExample.publish(message, function(){ console.log("emitted");});

    setTimeout(function(){pub(publishExample);}, 2000); 

  });
});

