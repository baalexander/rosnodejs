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

