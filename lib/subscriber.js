var util   = require('util')
  , events = require('events')
  , http   = require('http')
  , net    = require('net')
  , url    = require('url')
  , ctype  = require('ctype')
  , xmlrpc = require('xmlrpc')
  , master = require('./master')

function Subscriber(topic) {
  if (false === (this instanceof Subscriber)) {
    return new Subscriber(topic);
  }
  this.topic = topic

  // Emits events
  events.EventEmitter.call(this);

  // Creates server and start listening for request
  var uri = this.getUri()
  http.createServer(function (request, response) {

    // When receives data, parse call and emit an event
    request.on('data', function (chunk) {
      console.log(chunk)
    })

  }).listen(uri.port, uri.host)
}
util.inherits(Subscriber, events.EventEmitter)

Subscriber.prototype.unregister = function(topic) {
  this.emit('unregister', topic)
}

Subscriber.prototype.subscribe = function(callback) {

}

Subscriber.prototype.getUri = function() {
  return {
    host : 'localhost'
  , port : 9098
  }
}

Subscriber.prototype.publisherUpdate = function(publishers, callback) {
  for (var i = 0; i < publishers.length; i++) {
    var uriString = publishers[i]
    var uri = url.parse(uriString)
    uri.path = '/'
    console.log(uri)
    var client = xmlrpc.createClient( { host: uri.hostname, port: uri.port, path: uri.path })
    client.call('requestTopic', ['/talker', this.topic.name, [['TCPROS']]], function(error, value) {
      console.log(value)
      var hostParams = value[2]
      var host = hostParams[1]
      var port = hostParams[2]
      var options = { host: host, port: port }
      console.log(options)
      // STOPPED: Need to send the header information in the TCP request
      //var request = http.request(options, function(result) {
      //  console.log('RESPONSE!')
      //  console.log(result)
      //})

      var headers = []
      headers.push({ key: 'callerid', value: '/talker' })
      headers.push({ key: 'topic', value: '/chatter' })
      headers.push({ key: 'md5sum', value: '992ce8a1687cec8c8bd883ec73ca41d1' })
      headers.push({ key: 'type', value: 'std_msgs/String' })

      var totalHeaderLength = 0
      for (var i = 0; i < headers.length; i++) {
        totalHeaderLength += headers[i].key.length
        totalHeaderLength += headers[i].value.length
        totalHeaderLength += 5
      }

      var bufferOffset = 0
      var buffer = new Buffer(totalHeaderLength + 4)
      console.log(totalHeaderLength + 4)
      ctype.wuint32(totalHeaderLength, 'little', buffer, bufferOffset)
      bufferOffset += 4
      for (var i = 0; i < headers.length; i++) {
        console.log('OFFSET: ' + bufferOffset)
        var headerKeyValue = headers[i].key + '=' + headers[i].value
        console.log(headerKeyValue)
        ctype.wuint32(headerKeyValue.length, 'little', buffer, bufferOffset)
        bufferOffset += 4
        bufferOffset += buffer.write(headerKeyValue, bufferOffset, 'ascii')
      }
      console.log(buffer)
      console.log(buffer.toString('ascii'))
      //request.end(buffer)

      var socket = net.createConnection(port, host) 
      socket.on('data', function(data) {
        console.log('RESPONSE: ' + data);
      })
      //socket.write(buffer)
      socket.end(buffer)
    })
  }
  callback(null)
}

module.exports = Subscriber

