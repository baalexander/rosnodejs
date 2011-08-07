var ros = require('./ros')

ros.Node.prototype.save = function(attributes, options) {
  console.log('ROSNODEJS NODE SAVE')
  options.success()
}

ros.Node.prototype.sync = function(method, model, options) {
  console.log('ROSNODEJS NODE SYNC')
  options.success()
}

ros.Publisher.prototype.save = function(attributes, options) {
  console.log('ROSNODEJS PUBLISHER SAVE')
  options.success()
}

ros.Publisher.prototype.sync = function(method, model, options) {
  console.log('ROSNODEJS PUBLISHER SYNC')
  options.success()
}

module.exports = ros

