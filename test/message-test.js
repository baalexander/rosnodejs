var path     = require('path')
  , should   = require('should')
  , messages = require('../lib/messages')
  ;

describe('Messages', function() {

  describe('parsing', function() {
    it('should error on an unexisting file', function(done) {
      messages.parseMessageFile('UnexistingFile', function(error, properties, hash) {
        error.code.should.equal('ENOENT');
        done();
      });
    });

    it('should handle an empty file', function(done) {
      messages.parseMessageFile('/dev/null', function(error, properties, hash) {
        should.not.exist(error);
        properties.length.should.equal(0);
        hash.should.equal('d41d8cd98f00b204e9800998ecf8427e');
        done();
      });
    });

    it('should parse a valid message definition file', function(done) {
      var messagePath = path.join(__dirname, 'msg', 'test.msg');
      messages.parseMessageFile(messagePath, function(error, properties, hash) {
        should.not.exist(error);
        properties.length.should.equal(14);

        properties[0].should.be.a('object');
        properties[0].type.should.equal('bool');
        properties[0].name.should.equal('auto_disable_bodies');

        properties[7].type.should.equal('uint32');
        properties[7].name.should.equal('max_contacts');

        properties[11].type.should.equal('int32');
        properties[11].name.should.equal('Y');
        properties[11].value.should.equal('-123');

        properties[12].type.should.equal('string');
        properties[12].name.should.equal('FOO');
        properties[12].value.should.equal('foo');

        properties[13].type.should.equal('string');
        properties[13].name.should.equal('EXAMPLE');
        properties[13].value.should.equal('"#comments" are ignored, and leading and trailing whitespace removed');
        done();
      });
    });
  });

  describe('creation', function() {
    it('should get a message defined in a package', function(done) {
      messages.getMessageFromPackage('turtlesim', 'Pose', function(error, Message) {
        Message.id.should.equal('turtlesim/Pose');
        Message.packageName.should.equal('turtlesim');
        Message.messageName.should.equal('Pose');
        Message.fields[1].name.should.equal('y');

        var message = new Message();
        message.should.have.property('x');
        message.should.have.property('y');
        message.should.have.property('linearVelocity');
        message.should.have.property('angularVelocity');
        message.should.not.have.property('angular_velocity');
        done();
      });
    });

    it('should get a message defined in a local file', function(done) {
      var filePath = path.join(__dirname, 'msg', 'test.msg');
      messages.getMessageFromFile('test', filePath, function(error, Message) {
        should.not.exist(error);
        Message.id.should.equal('test');
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

});

