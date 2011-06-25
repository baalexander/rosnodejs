var vows     = require('vows')
  , assert   = require('assert')
  , messages = require('../lib/messages')

vows.describe('messages').addBatch({
  'A createFromType call': {
    'with std_msgs/String package': {
      topic: function() {
        messages.createFromType('std_msgs/String', this.callback)
      }
    , 'contains the properties': function(error, message) {
        assert.deepEqual(message, { message_type: 'std_msgs/String', data: null })
      }
    }
  }

, 'A createFromFile call': {
    'with test file': {
      topic: function() {
        messages.createFromFile(__dirname + '/test.msg', this.callback)
      }
    , 'contains the properties and values': function(error, message) {
        assert.deepEqual(message, { message_type: null, field1: null, anInt: null, CONSTANT1: 128, CONSTANT2: 'foo bar' })
        assert.strictEqual(message.CONSTANT1, 128)
      }
    }
  }

, 'A createFromString call': {
    'with constant': {
      topic: function() {
        messages.createFromString('string data=foo', this.callback)
      }
    , 'contains the property and value': function(error, message) {
        assert.deepEqual(message, { message_type: null, data: 'foo' })
      }
    }
  , 'with field': {
      topic: function() {
        messages.createFromString('string data', this.callback)
      }
    , 'contains the property': function(error, message) {
        assert.deepEqual(message, { message_type: null, data: null })
      }
    }
  , 'with multiple fields': {
      topic: function() {
        messages.createFromString('string data\nstring data2', this.callback)
      }
    , 'contains the properties': function(error, message) {
        assert.deepEqual(message, { message_type: null, data: null, data2: null })
      }
    }

  }

}).export(module)

