var environment = require('./environment');
var Walker = require('walker')
  , fs = require('fs')
  , path = require('path')
  , makeError = require('makeerror');

var PackageNotFoundError = exports.PackageNotFoundError = makeError(
  'PackageNotFoundError',
  "ENOTFOUND - Package {package} not found"
);

var packageCache = [];

function walk(directory, symlinks) {
  var noSubDirs = [];
  var stopped = false;
  symlinks = symlinks || [];

  return Walker(directory)
    .filterDir(function(dir, stat) {
      //exclude any subdir to an excluded dir
      return !noSubDirs.some(function(subdir) {
        return !subdir.indexOf(dir); //true if starts with dir
      }) || !stopped;// stops also if end has been emitted
    })
    .on('file', function(file, stat) {
      var shortname = path.basename(file);
      var dir = path.dirname(file);

      if( shortname === 'manifest.xml') {
        this.emit('package', path.basename(dir), dir);
        //there is no subpackages, so ignore anything under this directory
        noSubDirs.concat(dir);
      } else if(shortname === 'rospack_nosubdirs') {
        //explicitely asked to not go into subdirectories, so don't
        noSubDirs.concat(dir);
      }
    })
    .on('symlink', function(symlink, stat) {
      var walker = this;
      fs.readlink(symlink, function(err, link){
        if(err) {
          return; //ignore and stop this branch
        }

        var destination = path.resolve(path.dirname(symlink), link);

        //stores symlinks to avoid circular references
        if(~symlinks.indexOf(destination)){
          //already passed here, just ignore it
          return;
        } else { //not stored yet ? add it
          symlinks.concat(destination);
        }

        fs.stat(destination, function(err, stat){
          if(err) {
            return;
          }
          if(stat.isDirectory()) {//ok, then follow symlink !
            walker.emit('dir', destination, stat);
            return walker.go(destination);
          }
        })
      })
    })
    .on('end', function(){
      stopped = true;
      this.emit = function(){}; //if stopped then we should not emit anything else
    })
}

function findPackageInDirectory(directory, package, callback) {
  var found = false;
  return walk(directory).on('package', function(name, dir) {
    //first, adds the package to the cache

    if(name === package) {
      this.emit('stop'); // will stop any further processing
      found = true;
      callback(null, dir);
    }
  }).on('end', function() {
    if(!found) {
      callback(PackageNotFoundError({package:package}));
    }
  })
}

function findPackageInDirectoryChain(directories, package, callback) {
  if(directories.length<1) {
    return callback(PackageNotFoundError({package:package}));
  }
  return findPackageInDirectory(directories.shift(), package, function onRosRootPackageSearch(err, directory) {
    if(err instanceof PackageNotFoundError) {
      //recursive call, try in next directory
      return findPackageInDirectoryChain(directories, package, callback);
    } else if(err) {
      //unknown error
      return callback(err);
    } else {
      //ok we found it
      return callback(null, directory);
    }
  });
}

//implements the same crawling algorithm as rospack find : http://ros.org/doc/api/rospkg/html/rospack.html
exports.findPackage = function findPackage(package, callback) {
  var directories = [environment.getRosRoot()].concat(environment.getRosPackagePaths());
  return findPackageInDirectoryChain(directories, package, callback);
}
