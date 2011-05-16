var vows   = require('vows')
  , assert = require('assert')
  , msgs   = require('../lib/msgs.js')

vows.describe('msgs').addBatch({

  'A create message from string call': {
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

