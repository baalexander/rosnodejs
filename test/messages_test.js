var path     = require('path')
, should   = require('should')
, messages = require('../lib/messages')
, ros = require('../lib/ros')
;

describe('Messages', function() {

  describe('parsing', function() {

    it('should error on an unexisting file', function(done) {
      messages.parseMessageFile('UnexistingFile', null,function(error, properties, hash) {
        error.code.should.equal('ENOENT');
        done();
      });
    });

    it('should handle an empty file', function(done) {
      messages.parseMessageFile('/dev/null', null, function(error, details) {
        should.not.exist(error);
        details.fields.length.should.equal(0);
        details.md5.should.equal('d41d8cd98f00b204e9800998ecf8427e');
        done();
      });
    });

    it('should parse a valid message definition file', function(done) {
      var messagePath = path.join(__dirname, 'msg', 'test.msg');
      messages.parseMessageFile(messagePath, null, function(error, details) {
        should.not.exist(error);
        details.fields.length.should.equal(14);

        details.fields[0].should.be.a('object');
        details.fields[0].type.should.equal('bool');
        details.fields[0].name.should.equal('auto_disable_bodies');

        details.fields[7].type.should.equal('uint32');
        details.fields[7].name.should.equal('max_contacts');

        details.fields[11].type.should.equal('int32');
        details.fields[11].name.should.equal('Y');
        details.fields[11].value.should.equal(-123);

        details.fields[12].type.should.equal('string');
        details.fields[12].name.should.equal('FOO');
        details.fields[12].value.should.equal('foo');

        details.fields[13].type.should.equal('string');
        details.fields[13].name.should.equal('EXAMPLE');
        details.fields[13].value.should.equal('"#comments" are ignored, and leading and trailing whitespace removed');
        done();
      });
    });
  });

  describe('creation', function() {

    it('should get a message from the message type', function(done) {
      messages.getMessage('turtlesim/Pose', function(error, Message) {
        Message.messageType.should.equal('turtlesim/Pose');
        Message.packageName.should.equal('turtlesim');
        Message.messageName.should.equal('Pose');
        Message.fields[1].name.should.equal('y');

        var message = new Message();
        message.should.have.property('x');
        message.should.have.property('y');
        message.should.have.property('linear_velocity');
        message.should.have.property('angular_velocity');
        message.should.not.have.property('angularVelocity');
        done();
      });
    });

    it('should get a message defined in a package', function(done) {
      messages.getMessageFromPackage('turtlesim', 'Pose', function(error, Message) {
        Message.messageType.should.equal('turtlesim/Pose');
        Message.packageName.should.equal('turtlesim');
        Message.messageName.should.equal('Pose');
        Message.fields[1].name.should.equal('y');

        var message = new Message();
        message.should.have.property('x');
        message.should.have.property('y');
        message.should.have.property('linear_velocity');
        message.should.have.property('angular_velocity');
        message.should.not.have.property('angularVelocity');
        done();
      });
    });

    it('should get a message defined in a local file', function(done) {
      var filePath = path.join(__dirname, 'msg', 'test.msg');
      messages.getMessageFromFile('test', filePath, function(error, Message) {
        should.not.exist(error);
        Message.messageType.should.equal('test');
        Message.packageName.should.equal('');
        Message.messageName.should.equal('test');
        Message.fields[0].name.should.equal('auto_disable_bodies');
        done();
      });
    });

    it('should get a message containing constants', function(done) {
      messages.getMessageFromPackage('bond', 'Constants', function(error, Message) {
        var message = new Message();
        message.should.have.property('DEFAULT_CONNECT_TIMEOUT');
        message.DEFAULT_CONNECT_TIMEOUT.should.equal(10.0);
        message.DISABLE_HEARTBEAT_TIMEOUT_PARAM.should.equal('/bond_disable_heartbeat_timeout');
        done();
      });
    });

    it('should get a message and initialize with values', function(done) {
      messages.getMessageFromPackage('turtlesim', 'Pose', function(error, Message) {
        var values = {
          y: 55
        , linearVelocity: 3
        }
        var message = new Message(values);
        message.should.have.property('x');
        message.y.should.equal(55);
        message.linearVelocity.should.equal(3);
        done();
      });
    });

    it('should get a message defined in a local file that validates', function(done) {
      var filePath = path.join(__dirname, 'msg', 'test.msg');
      messages.getMessageFromFile('test', filePath, function(error, Message) {
        var message = new Message();
        message.validate(message).should.be.true;
        message.validate(message, true).should.be.true;
        done();
      });
    });

    it('should get a message defined in a local file that validates with initial values', function(done) {
      var filePath = path.join(__dirname, 'msg', 'test.msg');
      messages.getMessageFromFile('test', filePath, function(error, Message) {
        var values = {
          contactMaxCorrectingVel : 'TESTVAL'
        };
        var message = new Message();
        message.validate(message).should.be.true;
        message.validate(message, true).should.be.true;
        done();
      });
    });

    it('should get a message defined in a local file that fails strict mode validation with initial values', function(done) {
      var filePath = path.join(__dirname, 'msg', 'test.msg');
      messages.getMessageFromFile('test', filePath, function(error, Message) {
        var values = {
          newValues: 'TESTVAL'
        }
        var message = new Message(values);
        message.validate(message).should.be.true;
        message.validate(message, false).should.be.true;
        message.validate(message, true).should.be.false;
        done();
      });
    });
  });

  describe('When I parse std_msgs/String file', function(){
    it('should have a valid MD5', function(done){
      ros.types([
        'std_msgs/String'
        ], function(String){
          String.md5.should.equal("992ce8a1687cec8c8bd883ec73ca41d1");
          done();				  
        });
    }); 

  });

  describe('When I parse std_msgs/Time file', function(){
    it('should have a valid MD5', function(done){
      ros.types([
        'std_msgs/Time'
        ], function(String){
          String.md5.should.equal("cd7166c74c552c311fbcc2fe5a7bc289");
          done();				  
        });
    }); 

  });
  describe('When I parse std_msgs/MultiArrayLayout file', function(){
    it('should have a valid MD5', function(done){
      ros.types([
        'std_msgs/MultiArrayLayout'
        ], function(String){
          String.md5.should.equal("0fed2a11c13e11c5571b4e2a995a91a3");
          done();				  
        });
    }); 

  });


});

