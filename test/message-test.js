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

  describe('registry', function() {
    it('should register a message defined in a local message file', function(done) {
      messages.registerMessageFromFile('test', function(error, message) {
        should.not.exist(error);
        message.id.should.equal('test');
        message.messageName.should.equal('test');
        message.className.should.equal('Test');
        message.properties[0].name.should.equal('auto_disable_bodies');
        done();
      });
    });

    it('should register a message defined in a package\'s message file', function(done) {
      messages.registerMessageFromFile('Pose', 'turtlesim', function(error, message) {
        message.id.should.equal('turtlesim/Pose');
        message.messageName.should.equal('Pose');
        message.className.should.equal('Pose');
        message.properties[0].name.should.equal('x');
        done();
      });
    });
  });

  describe('creation', function() {
    it('should initialize a message defined in a package', function(done) {
      messages.createNewMessageFromFile('Pose', 'turtlesim', null, function(error, message) {
        message.should.have.property('x');
        message.should.have.property('y');
        message.should.have.property('linearVelocity');
        message.should.have.property('angularVelocity');
        message.should.not.have.property('angular_velocity');
        done();
      });
    });

    it('should initialize a message containing constants', function(done) {
      messages.createNewMessageFromFile('Constants', 'bond', null, function(error, message) {
        message.should.have.property('DEFAULT_CONNECT_TIMEOUT');
        message.DEFAULT_CONNECT_TIMEOUT.should.equal(10.0);
        message.DISABLE_HEARTBEAT_TIMEOUT_PARAM.should.equal('/bond_disable_heartbeat_timeout');
        done();
      });
    });

    it('should initialize a message with initial values', function(done) {
      var values = {
        y: 55
      , linearVelocity: 3
      }
      messages.createNewMessageFromFile('Pose', 'turtlesim', values, function(error, message) {
        message.should.have.property('x');
        message.y.should.equal(55);
        message.linearVelocity.should.equal(3);
        done();
      });
    });

    it('should initialize a valid message defined in a local file', function(done) {
      messages.createNewMessageFromFile('test', '', null,  function(error, message) {
        message.validate(message).should.be.true;
        message.validate(message, true).should.be.true;
        done();
      });
    });

    it('should initialize a valid message with initial values', function(done) {
      var values = {
        contactMaxCorrectingVel : 'TESTVAL'
      }
      messages.createNewMessageFromFile('test', '', values, function(error, message) {
        message.validate(message).should.be.true;
        message.validate(message, true).should.be.true;
        done();
      });
    });

    it('should initialize a valid message that fails strict mode with initial values', function(done) {
      var values = {
        newValues: 'TESTVAL'
      }
      messages.createNewMessageFromFile('test', '', values, function(error, message) {
        message.validate(message).should.be.true;
        message.validate(message, false).should.be.true;
        message.validate(message, true).should.be.false;
        done();
      });
    });
  });

});

