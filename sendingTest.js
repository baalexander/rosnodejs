var exec   = require('child_process').exec
, ros    = require('./lib/ros')

ros.types([
          'std_msgs/String'
], function(String) {
  var topic = new ros.topic(
    { topic: 'hello_world', messageType: String ,node:'talker'}
  ); 

  function pub(publishExample) {
    var message = new String({ data: 'howdy' });
    console.log("sending ",message);
    publishExample.publish(message, function(){ console.log("emitted");});
  };

  setInterval(function(){pub(topic);}, 2000); 

});

