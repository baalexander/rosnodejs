var vows   = require('vows')
  , assert = require('assert')
  , msgs   = require('../lib/msgs.js')

vows.describe('msgs').addBatch({
  'A createMessageFromFile call': {
    'with test file': {
      topic: function() {
        msgs.createFromFile(__dirname + '/test.msg', this.callback)
      }
    , 'contains the properties and values': function(error, message) {
        assert.deepEqual(message, { field1: null, anInt: null, CONSTANT1: 128, CONSTANT2: 'foo bar' })
        assert.strictEqual(message.CONSTANT1, 128)
      }
    }
  }

, 'A createMessageFromString call': {
    'with constant': {
      topic: function() {
        msgs.createFromString('string data=foo', this.callback)
      }
    , 'contains the property and value': function(error, message) {
        assert.deepEqual(message, { data: 'foo' })
      }
    }
  , 'with field': {
      topic: function() {
        msgs.createFromString('string data', this.callback)
      }
    , 'contains the property': function(error, message) {
        assert.deepEqual(message, { data: null })
      }
    }
  , 'with multiple fields': {
      topic: function() {
        msgs.createFromString('string data\nstring data2', this.callback)
      }
    , 'contains the properties': function(error, message) {
        assert.deepEqual(message, { data: null, data2: null })
      }
    }

  }

}).export(module)

