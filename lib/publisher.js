
function Publisher(node) {
  console.log(node)
  this.node = node
}

Publisher.prototype.publish = function(topic, message) {
  console.log(this.node.name)
  console.log('node: ' + this.node + ' topic: ' + topic + ' message: ' + message)
}

module.exports = Publisher

