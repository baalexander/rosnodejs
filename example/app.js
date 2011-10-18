var rosserver = require('../lib/rosserver')
  , std_msgs  = require('std_msgs')

rosserver.packages = {
  std_msgs: std_msgs
}

rosserver.statics = [__dirname + '/', __dirname + '/node_modules/']

rosserver.start(3000)

