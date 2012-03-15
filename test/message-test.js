var assert = require('assert'),
    messages = require('../lib/messages');

var tests = {
    'When I ask for unexisting file to be parse' : function(next){
        var then="I got a UnexistingFile error";
        
        messages.parseMessageFile("UnexistingFile", function(err, properties, hash) {
            assert.equal(err.code , 'ENOENT')
            next(then);
        });
    },
    'When I ask for an empty file to be parse' : function(next){
        var then="thereis no error";
        
        messages.parseMessageFile("/dev/null", function(err, properties, hash) {

            assert.equal(err , null);
            assert.equal(properties.length , 0);
            assert.equal(hash,'d41d8cd98f00b204e9800998ecf8427e');
            next(then);
        });
    },
    'When I ask for a valid file to be parse' : function(next){
        var then="the files is correctly parsed"
        
        messages.parseMessageFile("./msg/test.msg", function(err, properties, hash) {
            assert.equal(err , null);
            assert.equal(properties.length , 14);
            assert.equal(typeof properties[0], 'object');
            
            assert.equal(properties[0].type , "bool");
            assert.equal(properties[0].name , "auto_disable_bodies");

            assert.equal(properties[7].type , "uint32");
            assert.equal(properties[7].name , "max_contacts");

            assert.equal(properties[11].type , "int32");
            assert.equal(properties[11].name , "Y");
            assert.equal(properties[11].value , "-123");

            assert.equal(properties[12].type , "string");
            assert.equal(properties[12].name , "FOO");
            assert.equal(properties[12].value , "foo");

            assert.equal(properties[13].type , "string");
            assert.equal(properties[13].name , "EXAMPLE");
            assert.equal(properties[13].value , '"#comments" are ignored, and leading and trailing whitespace removed');
            next(then);
        });
    },
    'When I ask registration of message from local file' : function(next){
        var then="The file is correctly readed and parsed";
      
        messages.registerMessageFromFile("test", function(err, messages) {

            assert.equal( messages.id , "test");
            assert.equal( messages.messageName , "test");
            assert.equal( messages.className , "Test");
            assert.equal( messages.properties[0].name , "auto_disable_bodies");
            next(then);
        });
    },
    'When I ask registration of message from packaged file' : function(next){
        then="I get the good properties"

        messages.registerMessageFromFile("Pose","turtlesim", function(err, messages) {
            assert.equal( messages.id , "turtlesim/Pose");
            assert.equal( messages.messageName , "Pose");
            assert.equal( messages.className , "Pose");
            assert.equal( messages.properties[0].name , "x");
            next(then);
        });
    },
    'When I ask for a Object build from a packaged message definition': function(next){
        var then = 'The returned object is initlaized with the object parameter';

        messages.createNewMessageFromFile("Pose","turtlesim", null,function(err, ObjectMessage) {
            assert.notEqual(ObjectMessage.x ,undefined);
            assert.notEqual(ObjectMessage.y ,undefined);
            assert.notEqual(ObjectMessage.linearVelocity ,undefined , "linearVelocity is undefined");
            assert.notEqual(ObjectMessage.angularVelocity ,undefined , "angularVelocity is undefined");
            assert.equal(ObjectMessage.angular_velocity ,undefined , "angular_velocity is not undefined");
            next(then);
        });
    },
    'When I ask for a Object build from a packaged message definition with constantes': function(next){
        var then = 'Constants are correctly initialized';

        messages.createNewMessageFromFile("Constants","bond", null, function(err, ObjectMessage) {
            assert.notEqual(ObjectMessage.DEFAULT_CONNECT_TIMEOUT, undefined);
            assert.equal(ObjectMessage.DEFAULT_CONNECT_TIMEOUT, 10);
            assert.equal(ObjectMessage.DISABLE_HEARTBEAT_TIMEOUT_PARAM , '/bond_disable_heartbeat_timeout');
            next(then);
        });
    },
    'When I ask for a Object build from a packaged message definition with init values': function(next){
        var then = 'Init values are correctly added';

        messages.createNewMessageFromFile("Pose","turtlesim", {y:55, linearVelocity:3}, function(err, ObjectMessage) {
            console.log(ObjectMessage);
            assert.notEqual(ObjectMessage.x ,undefined);
            assert.equal(ObjectMessage.y ,55);  
            assert.equal(ObjectMessage.linearVelocity ,3 );
            next(then);
        });
    },
    'When I ask an object  build from message from local file' : function(next){
        var then="The created object is valid in all mode";
        
        messages.createNewMessageFromFile("test","" , null ,  function(err, ObjectMessage) {
            console.log(ObjectMessage);
            assert.equal(ObjectMessage.validate(ObjectMessage), true);
            assert.equal(ObjectMessage.validate(ObjectMessage, true), true);
            next(then);
        });
    },
    'When I ask an object  build from message from local file with init valid' : function(next){
        var then="The created object is valid";
        
        messages.createNewMessageFromFile("test","" , {contactMaxCorrectingVel:"TESTVAL"} ,  function(err, ObjectMessage) {
            assert.equal(ObjectMessage.validate(ObjectMessage), true);
            assert.equal(ObjectMessage.validate(ObjectMessage, true), true);
            next(then);
        });
    },
    'When I ask an object  build from message from local file with init adding some valued' : function(next){
        var then="The created object is not valid in strict mode";
        
        messages.createNewMessageFromFile("test","" , {newValues:"TESTVAL"} ,  function(err, ObjectMessage) {
            assert.equal(ObjectMessage.validate(ObjectMessage), true);
            assert.equal(ObjectMessage.validate(ObjectMessage, false), true);
            next(then);
        });
    }
};

var testArray=[];
var testName=[];
for(var test in tests){
    testArray.push(tests[test]);
    testName.push(test);
}
var testIndex=0;
var timeout;
var nextTest=function(message){
    if(timeout)
        clearTimeout(timeout);
   
if(testIndex>0){
       console.log("\033[32m\t"+(message || "It works")+"\033[39m");
}
    if(testArray.length>testIndex){
        console.log(testName[testIndex]);
        timeout= setTimeout(function(){ assert.fail("<5000" , ">5000" , "The test is too long")} , 5000); 
        testArray[testIndex++](nextTest);
    }
};
nextTest();