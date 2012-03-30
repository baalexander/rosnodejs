var should = require('should')
  , fields = require('../lib/fields')
  ;

describe('Fields', function() {

  describe('types', function() {

    it('should identify primitive types', function() {
      fields.isPrimitiveType('bool').should.be.true;
      fields.isPrimitiveType('int8').should.be.true;
      fields.isPrimitiveType('uint8').should.be.true;
      fields.isPrimitiveType('int16').should.be.true;
      fields.isPrimitiveType('uint16').should.be.true;
      fields.isPrimitiveType('int32').should.be.true;
      fields.isPrimitiveType('uint32').should.be.true;
      fields.isPrimitiveType('float32').should.be.true;
      fields.isPrimitiveType('float64').should.be.true;
      fields.isPrimitiveType('string').should.be.true;

      fields.isPrimitiveType('bool[]').should.be.false;
      fields.isPrimitiveType('float32[]').should.be.false;
      fields.isPrimitiveType('float64[]').should.be.false;
      fields.isPrimitiveType('float64[36]').should.be.false;
      fields.isPrimitiveType('std_msgs/String[]').should.be.false;

      fields.isPrimitiveType('std_msgs/String').should.be.false;
      fields.isPrimitiveType('Header').should.be.false;
      fields.isPrimitiveType('geometry_msgs/Twist').should.be.false;
      fields.isPrimitiveType('Point32').should.be.false;
      fields.isPrimitiveType('String').should.be.false;
    });

    it('should identify arrays', function() {
      fields.isArray('bool[]').should.be.true;
      fields.isArray('int8[]').should.be.true;
      fields.isArray('float32[]').should.be.true;
      fields.isArray('float64[36]').should.be.true;
      fields.isArray('std_msgs/String[]').should.be.true;
      fields.isArray('geometry_msgs/Twist[]').should.be.true;
      fields.isArray('Point32[]').should.be.true;

      fields.isArray('bool').should.be.false;
      fields.isArray('float32').should.be.false;
      fields.isArray('std_msgs/String').should.be.false
      fields.isArray('Header').should.be.false
      fields.isArray('Point32').should.be.false
    });

    it('should identify message types', function() {
      fields.isMessageType('std_msgs/String').should.be.true;
      fields.isMessageType('geometry_msgs/String').should.be.true;
      fields.isMessageType('String').should.be.true;
      fields.isMessageType('Header').should.be.true;
      fields.isMessageType('Point32').should.be.true;

      fields.isMessageType('bool').should.be.false;
      fields.isMessageType('float32').should.be.false;
      fields.isMessageType('string').should.be.false;
      fields.isMessageType('bool[]').should.be.false;
      fields.isMessageType('float32[]').should.be.false;
      fields.isMessageType('float64[36]').should.be.false;
      fields.isMessageType('std_msgs/String[]').should.be.false;
      fields.isMessageType('Point32[]').should.be.false;
    });

  });

});

