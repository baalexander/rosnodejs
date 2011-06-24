var fs = require('fs')

var environment = exports

environment.getRosRoot = function() {
  return process.env.ROS_ROOT
}

environment.getRosMasterUri = function() {
  return process.env.ROS_MASTER_URI
}

environment.getRosPackagePaths = function() {
  var packagePath = process.env.ROS_PACKAGE_PATH
  var packagePaths = packagePath.split(':')
  return packagePaths
}

environment.getRosPackagePath = function(rosPackage, callback) {
  var rosPackagePath = null
  var packagePaths = []
  packagePaths.push(this.getRosRoot())
  packagePaths.concat(this.getRosPackagePaths())
  for (var i = 0; i < packagePaths.length && rosPackagePath === null; i++) {
    var packagePath = packagePaths[i]
    findDirectory(packagePath, rosPackage, function(error, rosPackagePath) {
      callback(null, rosPackagePath)
    })
  }
}

function findDirectory(directory, directoryNameToFind, callback) {
  var foundDirectoryPath = null
  fs.readdir(directory, function(error, files) {
    if (files !== undefined) {
      for (var i = 0; i < files.length && foundDirectoryPath === null; i++) {
        var fileName = files[i]
        var filePath = directory + '/' + fileName
        var stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
          if (fileName === directoryNameToFind) {
            foundDirectoryPath = filePath
            callback(null, foundDirectoryPath)
          }
          else {
            findDirectory(filePath, directoryNameToFind, callback)
          }
        }
      }
    }
  })
}

