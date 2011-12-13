(function() {

  var root = this

  var ros = null
  var geometry_msgs = null
  if (typeof exports !== 'undefined') {
    ros = require('../lib/rosnode')
    geometry_msgs = exports
  }
  else {
    ros = this.ros
    geometry_msgs = root.geometry_msgs = {}
  }


  geometry_msgs.Pose2D = ros.Message.extend({
    defaults: {"fieldOrder":["x","y","theta"],"fieldTypes":{"x":"float64","y":"float64","theta":"float64"},"x":null,"y":null,"theta":null,"type":"geometry_msgs/Pose2D","md5sum":"938fa65709584ad8e77d238529be13b8"}
  , initialize: function(attributes) {
    }
  })


  geometry_msgs.Point32 = ros.Message.extend({
    defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float32","y":"float32","z":"float32"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Point32","md5sum":"cc153912f1453b708d221682bc23d9ac"}
  , initialize: function(attributes) {
    }
  })


  geometry_msgs.Quaternion = ros.Message.extend({
    defaults: {"fieldOrder":["x","y","z","w"],"fieldTypes":{"x":"float64","y":"float64","z":"float64","w":"float64"},"x":null,"y":null,"z":null,"w":null,"type":"geometry_msgs/Quaternion","md5sum":"a779879fadf0160734f906b8c19c7004"}
  , initialize: function(attributes) {
    }
  })


  geometry_msgs.Point = ros.Message.extend({
    defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Point","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
  , initialize: function(attributes) {
    }
  })


  geometry_msgs.Vector3 = ros.Message.extend({
    defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
  , initialize: function(attributes) {
    }
  })


  geometry_msgs.Polygon = ros.Message.extend({
    defaults: {"fieldOrder":["points"],"fieldTypes":{"points":"geometry_msgs/Point32[]"},"points":null,"type":"geometry_msgs/Polygon","md5sum":"cd60a26494a087f577976f0329fa120e"}
  , initialize: function(attributes) {
    }
  })


  geometry_msgs.PoseArray = ros.Message.extend({
    defaults: {"fieldOrder":["header","poses"],"fieldTypes":{"header":"Header","poses":"geometry_msgs/Pose[]"},"header":null,"poses":null,"type":"geometry_msgs/PoseArray","md5sum":"916c28c5764443f268b296bb671b9d97"}
  , initialize: function(attributes) {
      var header = this.get('header')
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = ros.Message.extend({
          defaults: {"fieldOrder":["seq","stamp","frame_id"],"fieldTypes":{"seq":"uint32","stamp":"time","frame_id":"string"},"seq":null,"stamp":null,"frame_id":null,"type":"Header","md5sum":"[std_msgs/Header]: 2176decaecbce78abc3b96ef049fabed"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          header: new headerMessage(header)
        })
      }

    }
  })


  geometry_msgs.QuaternionStamped = ros.Message.extend({
    defaults: {"fieldOrder":["header","quaternion"],"fieldTypes":{"header":"Header","quaternion":"geometry_msgs/Quaternion"},"header":null,"quaternion":null,"type":"geometry_msgs/QuaternionStamped","md5sum":"e57f1e547e0e1fd13504588ffc8334e2"}
  , initialize: function(attributes) {
      var quaternion = this.get('quaternion')
      if (!quaternion || !(quaternion instanceof ros.Message)) {
        var quaternionMessage = ros.Message.extend({
          defaults: {"fieldOrder":["x","y","z","w"],"fieldTypes":{"x":"float64","y":"float64","z":"float64","w":"float64"},"x":null,"y":null,"z":null,"w":null,"type":"geometry_msgs/Quaternion","md5sum":"a779879fadf0160734f906b8c19c7004"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          quaternion: new quaternionMessage(quaternion)
        })
      }

      var header = this.get('header')
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = ros.Message.extend({
          defaults: {"fieldOrder":["seq","stamp","frame_id"],"fieldTypes":{"seq":"uint32","stamp":"time","frame_id":"string"},"seq":null,"stamp":null,"frame_id":null,"type":"Header","md5sum":"[std_msgs/Header]: 2176decaecbce78abc3b96ef049fabed"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          header: new headerMessage(header)
        })
      }

    }
  })


  geometry_msgs.Transform = ros.Message.extend({
    defaults: {"fieldOrder":["translation","rotation"],"fieldTypes":{"translation":"geometry_msgs/Vector3","rotation":"geometry_msgs/Quaternion"},"translation":null,"rotation":null,"type":"geometry_msgs/Transform","md5sum":"ac9eff44abf714214112b05d54a3cf9b"}
  , initialize: function(attributes) {
      var translation = this.get('translation')
      if (!translation || !(translation instanceof ros.Message)) {
        var translationMessage = ros.Message.extend({
          defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          translation: new translationMessage(translation)
        })
      }

      var rotation = this.get('rotation')
      if (!rotation || !(rotation instanceof ros.Message)) {
        var rotationMessage = ros.Message.extend({
          defaults: {"fieldOrder":["x","y","z","w"],"fieldTypes":{"x":"float64","y":"float64","z":"float64","w":"float64"},"x":null,"y":null,"z":null,"w":null,"type":"geometry_msgs/Quaternion","md5sum":"a779879fadf0160734f906b8c19c7004"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          rotation: new rotationMessage(rotation)
        })
      }

    }
  })


  geometry_msgs.PointStamped = ros.Message.extend({
    defaults: {"fieldOrder":["header","point"],"fieldTypes":{"header":"Header","point":"geometry_msgs/Point"},"header":null,"point":null,"type":"geometry_msgs/PointStamped","md5sum":"c63aecb41bfdfd6b7e1fac37c7cbe7bf"}
  , initialize: function(attributes) {
      var header = this.get('header')
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = ros.Message.extend({
          defaults: {"fieldOrder":["seq","stamp","frame_id"],"fieldTypes":{"seq":"uint32","stamp":"time","frame_id":"string"},"seq":null,"stamp":null,"frame_id":null,"type":"Header","md5sum":"[std_msgs/Header]: 2176decaecbce78abc3b96ef049fabed"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          header: new headerMessage(header)
        })
      }

      var point = this.get('point')
      if (!point || !(point instanceof ros.Message)) {
        var pointMessage = ros.Message.extend({
          defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Point","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          point: new pointMessage(point)
        })
      }

    }
  })


  geometry_msgs.PolygonStamped = ros.Message.extend({
    defaults: {"fieldOrder":["header","polygon"],"fieldTypes":{"header":"Header","polygon":"geometry_msgs/Polygon"},"header":null,"polygon":null,"type":"geometry_msgs/PolygonStamped","md5sum":"c6be8f7dc3bee7fe9e8d296070f53340"}
  , initialize: function(attributes) {
      var polygon = this.get('polygon')
      if (!polygon || !(polygon instanceof ros.Message)) {
        var polygonMessage = ros.Message.extend({
          defaults: {"fieldOrder":["points"],"fieldTypes":{"points":"geometry_msgs/Point32[]"},"points":null,"type":"geometry_msgs/Polygon","md5sum":"cd60a26494a087f577976f0329fa120e"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          polygon: new polygonMessage(polygon)
        })
      }

      var header = this.get('header')
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = ros.Message.extend({
          defaults: {"fieldOrder":["seq","stamp","frame_id"],"fieldTypes":{"seq":"uint32","stamp":"time","frame_id":"string"},"seq":null,"stamp":null,"frame_id":null,"type":"Header","md5sum":"[std_msgs/Header]: 2176decaecbce78abc3b96ef049fabed"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          header: new headerMessage(header)
        })
      }

    }
  })


  geometry_msgs.Pose = ros.Message.extend({
    defaults: {"fieldOrder":["position","orientation"],"fieldTypes":{"position":"geometry_msgs/Point","orientation":"geometry_msgs/Quaternion"},"position":null,"orientation":null,"type":"geometry_msgs/Pose","md5sum":"e45d45a5a1ce597b249e23fb30fc871f"}
  , initialize: function(attributes) {
      var position = this.get('position')
      if (!position || !(position instanceof ros.Message)) {
        var positionMessage = ros.Message.extend({
          defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Point","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          position: new positionMessage(position)
        })
      }

      var orientation = this.get('orientation')
      if (!orientation || !(orientation instanceof ros.Message)) {
        var orientationMessage = ros.Message.extend({
          defaults: {"fieldOrder":["x","y","z","w"],"fieldTypes":{"x":"float64","y":"float64","z":"float64","w":"float64"},"x":null,"y":null,"z":null,"w":null,"type":"geometry_msgs/Quaternion","md5sum":"a779879fadf0160734f906b8c19c7004"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          orientation: new orientationMessage(orientation)
        })
      }

    }
  })


  geometry_msgs.Wrench = ros.Message.extend({
    defaults: {"fieldOrder":["force","torque"],"fieldTypes":{"force":"geometry_msgs/Vector3","torque":"geometry_msgs/Vector3"},"force":null,"torque":null,"type":"geometry_msgs/Wrench","md5sum":"4f539cf138b23283b520fd271b567936"}
  , initialize: function(attributes) {
      var torque = this.get('torque')
      if (!torque || !(torque instanceof ros.Message)) {
        var torqueMessage = ros.Message.extend({
          defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          torque: new torqueMessage(torque)
        })
      }

      var force = this.get('force')
      if (!force || !(force instanceof ros.Message)) {
        var forceMessage = ros.Message.extend({
          defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          force: new forceMessage(force)
        })
      }

    }
  })


  geometry_msgs.Twist = ros.Message.extend({
    defaults: {"fieldOrder":["linear","angular"],"fieldTypes":{"linear":"geometry_msgs/Vector3","angular":"geometry_msgs/Vector3"},"linear":null,"angular":null,"type":"geometry_msgs/Twist","md5sum":"9f195f881246fdfa2798d1d3eebca84a"}
  , initialize: function(attributes) {
      var angular = this.get('angular')
      if (!angular || !(angular instanceof ros.Message)) {
        var angularMessage = ros.Message.extend({
          defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          angular: new angularMessage(angular)
        })
      }

      var linear = this.get('linear')
      if (!linear || !(linear instanceof ros.Message)) {
        var linearMessage = ros.Message.extend({
          defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          linear: new linearMessage(linear)
        })
      }

    }
  })


  geometry_msgs.Vector3Stamped = ros.Message.extend({
    defaults: {"fieldOrder":["header","vector"],"fieldTypes":{"header":"Header","vector":"geometry_msgs/Vector3"},"header":null,"vector":null,"type":"geometry_msgs/Vector3Stamped","md5sum":"7b324c7325e683bf02a9b14b01090ec7"}
  , initialize: function(attributes) {
      var header = this.get('header')
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = ros.Message.extend({
          defaults: {"fieldOrder":["seq","stamp","frame_id"],"fieldTypes":{"seq":"uint32","stamp":"time","frame_id":"string"},"seq":null,"stamp":null,"frame_id":null,"type":"Header","md5sum":"[std_msgs/Header]: 2176decaecbce78abc3b96ef049fabed"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          header: new headerMessage(header)
        })
      }

      var vector = this.get('vector')
      if (!vector || !(vector instanceof ros.Message)) {
        var vectorMessage = ros.Message.extend({
          defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          vector: new vectorMessage(vector)
        })
      }

    }
  })


  geometry_msgs.WrenchStamped = ros.Message.extend({
    defaults: {"fieldOrder":["header","wrench"],"fieldTypes":{"header":"Header","wrench":"geometry_msgs/Wrench"},"header":null,"wrench":null,"type":"geometry_msgs/WrenchStamped","md5sum":"d78d3cb249ce23087ade7e7d0c40cfa7"}
  , initialize: function(attributes) {
      var header = this.get('header')
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = ros.Message.extend({
          defaults: {"fieldOrder":["seq","stamp","frame_id"],"fieldTypes":{"seq":"uint32","stamp":"time","frame_id":"string"},"seq":null,"stamp":null,"frame_id":null,"type":"Header","md5sum":"[std_msgs/Header]: 2176decaecbce78abc3b96ef049fabed"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          header: new headerMessage(header)
        })
      }

      var wrench = this.get('wrench')
      if (!wrench || !(wrench instanceof ros.Message)) {
        var wrenchMessage = ros.Message.extend({
          defaults: {"fieldOrder":["force","torque"],"fieldTypes":{"force":"geometry_msgs/Vector3","torque":"geometry_msgs/Vector3"},"force":null,"torque":null,"type":"geometry_msgs/Wrench","md5sum":"4f539cf138b23283b520fd271b567936"}
        , initialize: function(attributes) {
            var force = this.get('force')
            if (!force || !(force instanceof ros.Message)) {
              var forceMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                force: new forceMessage(force)
              })
            }

            var torque = this.get('torque')
            if (!torque || !(torque instanceof ros.Message)) {
              var torqueMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                torque: new torqueMessage(torque)
              })
            }

          }
        })
        this.set({
          wrench: new wrenchMessage(wrench)
        })
      }

    }
  })


  geometry_msgs.TransformStamped = ros.Message.extend({
    defaults: {"fieldOrder":["header","child_frame_id","transform"],"fieldTypes":{"header":"Header","child_frame_id":"string","transform":"geometry_msgs/Transform"},"header":null,"child_frame_id":null,"transform":null,"type":"geometry_msgs/TransformStamped","md5sum":"b5764a33bfeb3588febc2682852579b0"}
  , initialize: function(attributes) {
      var header = this.get('header')
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = ros.Message.extend({
          defaults: {"fieldOrder":["seq","stamp","frame_id"],"fieldTypes":{"seq":"uint32","stamp":"time","frame_id":"string"},"seq":null,"stamp":null,"frame_id":null,"type":"Header","md5sum":"[std_msgs/Header]: 2176decaecbce78abc3b96ef049fabed"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          header: new headerMessage(header)
        })
      }

      var transform = this.get('transform')
      if (!transform || !(transform instanceof ros.Message)) {
        var transformMessage = ros.Message.extend({
          defaults: {"fieldOrder":["translation","rotation"],"fieldTypes":{"translation":"geometry_msgs/Vector3","rotation":"geometry_msgs/Quaternion"},"translation":null,"rotation":null,"type":"geometry_msgs/Transform","md5sum":"ac9eff44abf714214112b05d54a3cf9b"}
        , initialize: function(attributes) {
            var translation = this.get('translation')
            if (!translation || !(translation instanceof ros.Message)) {
              var translationMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                translation: new translationMessage(translation)
              })
            }

            var rotation = this.get('rotation')
            if (!rotation || !(rotation instanceof ros.Message)) {
              var rotationMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z","w"],"fieldTypes":{"x":"float64","y":"float64","z":"float64","w":"float64"},"x":null,"y":null,"z":null,"w":null,"type":"geometry_msgs/Quaternion","md5sum":"a779879fadf0160734f906b8c19c7004"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                rotation: new rotationMessage(rotation)
              })
            }

          }
        })
        this.set({
          transform: new transformMessage(transform)
        })
      }

    }
  })


  geometry_msgs.PoseWithCovariance = ros.Message.extend({
    defaults: {"fieldOrder":["pose","covariance"],"fieldTypes":{"pose":"geometry_msgs/Pose","covariance":"float64[36]"},"pose":null,"covariance":null,"type":"geometry_msgs/PoseWithCovariance","md5sum":"c23e848cf1b7533a8d7c259073a97e6f"}
  , initialize: function(attributes) {
      var pose = this.get('pose')
      if (!pose || !(pose instanceof ros.Message)) {
        var poseMessage = ros.Message.extend({
          defaults: {"fieldOrder":["position","orientation"],"fieldTypes":{"position":"geometry_msgs/Point","orientation":"geometry_msgs/Quaternion"},"position":null,"orientation":null,"type":"geometry_msgs/Pose","md5sum":"e45d45a5a1ce597b249e23fb30fc871f"}
        , initialize: function(attributes) {
            var position = this.get('position')
            if (!position || !(position instanceof ros.Message)) {
              var positionMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Point","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                position: new positionMessage(position)
              })
            }

            var orientation = this.get('orientation')
            if (!orientation || !(orientation instanceof ros.Message)) {
              var orientationMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z","w"],"fieldTypes":{"x":"float64","y":"float64","z":"float64","w":"float64"},"x":null,"y":null,"z":null,"w":null,"type":"geometry_msgs/Quaternion","md5sum":"a779879fadf0160734f906b8c19c7004"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                orientation: new orientationMessage(orientation)
              })
            }

          }
        })
        this.set({
          pose: new poseMessage(pose)
        })
      }

    }
  })


  geometry_msgs.TwistWithCovariance = ros.Message.extend({
    defaults: {"fieldOrder":["twist","covariance"],"fieldTypes":{"twist":"geometry_msgs/Twist","covariance":"float64[36]"},"twist":null,"covariance":null,"type":"geometry_msgs/TwistWithCovariance","md5sum":"1fe8a28e6890a4cc3ae4c3ca5c7d82e6"}
  , initialize: function(attributes) {
      var twist = this.get('twist')
      if (!twist || !(twist instanceof ros.Message)) {
        var twistMessage = ros.Message.extend({
          defaults: {"fieldOrder":["linear","angular"],"fieldTypes":{"linear":"geometry_msgs/Vector3","angular":"geometry_msgs/Vector3"},"linear":null,"angular":null,"type":"geometry_msgs/Twist","md5sum":"9f195f881246fdfa2798d1d3eebca84a"}
        , initialize: function(attributes) {
            var linear = this.get('linear')
            if (!linear || !(linear instanceof ros.Message)) {
              var linearMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                linear: new linearMessage(linear)
              })
            }

            var angular = this.get('angular')
            if (!angular || !(angular instanceof ros.Message)) {
              var angularMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                angular: new angularMessage(angular)
              })
            }

          }
        })
        this.set({
          twist: new twistMessage(twist)
        })
      }

    }
  })


  geometry_msgs.TwistStamped = ros.Message.extend({
    defaults: {"fieldOrder":["header","twist"],"fieldTypes":{"header":"Header","twist":"geometry_msgs/Twist"},"header":null,"twist":null,"type":"geometry_msgs/TwistStamped","md5sum":"98d34b0043a2093cf9d9345ab6eef12e"}
  , initialize: function(attributes) {
      var header = this.get('header')
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = ros.Message.extend({
          defaults: {"fieldOrder":["seq","stamp","frame_id"],"fieldTypes":{"seq":"uint32","stamp":"time","frame_id":"string"},"seq":null,"stamp":null,"frame_id":null,"type":"Header","md5sum":"[std_msgs/Header]: 2176decaecbce78abc3b96ef049fabed"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          header: new headerMessage(header)
        })
      }

      var twist = this.get('twist')
      if (!twist || !(twist instanceof ros.Message)) {
        var twistMessage = ros.Message.extend({
          defaults: {"fieldOrder":["linear","angular"],"fieldTypes":{"linear":"geometry_msgs/Vector3","angular":"geometry_msgs/Vector3"},"linear":null,"angular":null,"type":"geometry_msgs/Twist","md5sum":"9f195f881246fdfa2798d1d3eebca84a"}
        , initialize: function(attributes) {
            var linear = this.get('linear')
            if (!linear || !(linear instanceof ros.Message)) {
              var linearMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                linear: new linearMessage(linear)
              })
            }

            var angular = this.get('angular')
            if (!angular || !(angular instanceof ros.Message)) {
              var angularMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                angular: new angularMessage(angular)
              })
            }

          }
        })
        this.set({
          twist: new twistMessage(twist)
        })
      }

    }
  })


  geometry_msgs.PoseStamped = ros.Message.extend({
    defaults: {"fieldOrder":["header","pose"],"fieldTypes":{"header":"Header","pose":"geometry_msgs/Pose"},"header":null,"pose":null,"type":"geometry_msgs/PoseStamped","md5sum":"d3812c3cbc69362b77dc0b19b345f8f5"}
  , initialize: function(attributes) {
      var header = this.get('header')
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = ros.Message.extend({
          defaults: {"fieldOrder":["seq","stamp","frame_id"],"fieldTypes":{"seq":"uint32","stamp":"time","frame_id":"string"},"seq":null,"stamp":null,"frame_id":null,"type":"Header","md5sum":"[std_msgs/Header]: 2176decaecbce78abc3b96ef049fabed"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          header: new headerMessage(header)
        })
      }

      var pose = this.get('pose')
      if (!pose || !(pose instanceof ros.Message)) {
        var poseMessage = ros.Message.extend({
          defaults: {"fieldOrder":["position","orientation"],"fieldTypes":{"position":"geometry_msgs/Point","orientation":"geometry_msgs/Quaternion"},"position":null,"orientation":null,"type":"geometry_msgs/Pose","md5sum":"e45d45a5a1ce597b249e23fb30fc871f"}
        , initialize: function(attributes) {
            var position = this.get('position')
            if (!position || !(position instanceof ros.Message)) {
              var positionMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Point","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                position: new positionMessage(position)
              })
            }

            var orientation = this.get('orientation')
            if (!orientation || !(orientation instanceof ros.Message)) {
              var orientationMessage = ros.Message.extend({
                defaults: {"fieldOrder":["x","y","z","w"],"fieldTypes":{"x":"float64","y":"float64","z":"float64","w":"float64"},"x":null,"y":null,"z":null,"w":null,"type":"geometry_msgs/Quaternion","md5sum":"a779879fadf0160734f906b8c19c7004"}
              , initialize: function(attributes) {
                }
              })
              this.set({
                orientation: new orientationMessage(orientation)
              })
            }

          }
        })
        this.set({
          pose: new poseMessage(pose)
        })
      }

    }
  })


  geometry_msgs.TwistWithCovarianceStamped = ros.Message.extend({
    defaults: {"fieldOrder":["header","twist"],"fieldTypes":{"header":"Header","twist":"geometry_msgs/TwistWithCovariance"},"header":null,"twist":null,"type":"geometry_msgs/TwistWithCovarianceStamped","md5sum":"8927a1a12fb2607ceea095b2dc440a96"}
  , initialize: function(attributes) {
      var header = this.get('header')
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = ros.Message.extend({
          defaults: {"fieldOrder":["seq","stamp","frame_id"],"fieldTypes":{"seq":"uint32","stamp":"time","frame_id":"string"},"seq":null,"stamp":null,"frame_id":null,"type":"Header","md5sum":"[std_msgs/Header]: 2176decaecbce78abc3b96ef049fabed"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          header: new headerMessage(header)
        })
      }

      var twist = this.get('twist')
      if (!twist || !(twist instanceof ros.Message)) {
        var twistMessage = ros.Message.extend({
          defaults: {"fieldOrder":["twist","covariance"],"fieldTypes":{"twist":"geometry_msgs/Twist","covariance":"float64[36]"},"twist":null,"covariance":null,"type":"geometry_msgs/TwistWithCovariance","md5sum":"1fe8a28e6890a4cc3ae4c3ca5c7d82e6"}
        , initialize: function(attributes) {
            var twist = this.get('twist')
            if (!twist || !(twist instanceof ros.Message)) {
              var twistMessage = ros.Message.extend({
                defaults: {"fieldOrder":["linear","angular"],"fieldTypes":{"linear":"geometry_msgs/Vector3","angular":"geometry_msgs/Vector3"},"linear":null,"angular":null,"type":"geometry_msgs/Twist","md5sum":"9f195f881246fdfa2798d1d3eebca84a"}
              , initialize: function(attributes) {
                  var linear = this.get('linear')
                  if (!linear || !(linear instanceof ros.Message)) {
                    var linearMessage = ros.Message.extend({
                      defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
                    , initialize: function(attributes) {
                      }
                    })
                    this.set({
                      linear: new linearMessage(linear)
                    })
                  }

                  var angular = this.get('angular')
                  if (!angular || !(angular instanceof ros.Message)) {
                    var angularMessage = ros.Message.extend({
                      defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Vector3","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
                    , initialize: function(attributes) {
                      }
                    })
                    this.set({
                      angular: new angularMessage(angular)
                    })
                  }

                }
              })
              this.set({
                twist: new twistMessage(twist)
              })
            }

          }
        })
        this.set({
          twist: new twistMessage(twist)
        })
      }

    }
  })


  geometry_msgs.PoseWithCovarianceStamped = ros.Message.extend({
    defaults: {"fieldOrder":["header","pose"],"fieldTypes":{"header":"Header","pose":"geometry_msgs/PoseWithCovariance"},"header":null,"pose":null,"type":"geometry_msgs/PoseWithCovarianceStamped","md5sum":"953b798c0f514ff060a53a3498ce6246"}
  , initialize: function(attributes) {
      var header = this.get('header')
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = ros.Message.extend({
          defaults: {"fieldOrder":["seq","stamp","frame_id"],"fieldTypes":{"seq":"uint32","stamp":"time","frame_id":"string"},"seq":null,"stamp":null,"frame_id":null,"type":"Header","md5sum":"[std_msgs/Header]: 2176decaecbce78abc3b96ef049fabed"}
        , initialize: function(attributes) {
          }
        })
        this.set({
          header: new headerMessage(header)
        })
      }

      var pose = this.get('pose')
      if (!pose || !(pose instanceof ros.Message)) {
        var poseMessage = ros.Message.extend({
          defaults: {"fieldOrder":["pose","covariance"],"fieldTypes":{"pose":"geometry_msgs/Pose","covariance":"float64[36]"},"pose":null,"covariance":null,"type":"geometry_msgs/PoseWithCovariance","md5sum":"c23e848cf1b7533a8d7c259073a97e6f"}
        , initialize: function(attributes) {
            var pose = this.get('pose')
            if (!pose || !(pose instanceof ros.Message)) {
              var poseMessage = ros.Message.extend({
                defaults: {"fieldOrder":["position","orientation"],"fieldTypes":{"position":"geometry_msgs/Point","orientation":"geometry_msgs/Quaternion"},"position":null,"orientation":null,"type":"geometry_msgs/Pose","md5sum":"e45d45a5a1ce597b249e23fb30fc871f"}
              , initialize: function(attributes) {
                  var position = this.get('position')
                  if (!position || !(position instanceof ros.Message)) {
                    var positionMessage = ros.Message.extend({
                      defaults: {"fieldOrder":["x","y","z"],"fieldTypes":{"x":"float64","y":"float64","z":"float64"},"x":null,"y":null,"z":null,"type":"geometry_msgs/Point","md5sum":"4a842b65f413084dc2b10fb484ea7f17"}
                    , initialize: function(attributes) {
                      }
                    })
                    this.set({
                      position: new positionMessage(position)
                    })
                  }

                  var orientation = this.get('orientation')
                  if (!orientation || !(orientation instanceof ros.Message)) {
                    var orientationMessage = ros.Message.extend({
                      defaults: {"fieldOrder":["x","y","z","w"],"fieldTypes":{"x":"float64","y":"float64","z":"float64","w":"float64"},"x":null,"y":null,"z":null,"w":null,"type":"geometry_msgs/Quaternion","md5sum":"a779879fadf0160734f906b8c19c7004"}
                    , initialize: function(attributes) {
                      }
                    })
                    this.set({
                      orientation: new orientationMessage(orientation)
                    })
                  }

                }
              })
              this.set({
                pose: new poseMessage(pose)
              })
            }

          }
        })
        this.set({
          pose: new poseMessage(pose)
        })
      }

    }
  })



}).call(this)

