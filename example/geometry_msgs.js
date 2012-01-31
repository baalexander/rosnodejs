(function() {

  var root = this

  var ros = null
  var geometry_msgs = null
  if (typeof exports !== 'undefined') {
    ros = require('../lib/rosnode')
    geometry_msgs = exports
  }
  else {
    ros = root.ros
    geometry_msgs = root.geometry_msgs = {}
  }


  geometry_msgs.Pose2D = ros.Message.extend({
    defaults: {
      "fields" : ["x","y","theta"]
    , "fieldTypes" : {"x":"float64","y":"float64","theta":"float64"}
    , "x" : null, "y" : null, "theta" : null
    , "type" : "geometry_msgs/Pose2D"
    , "md5sum" : "938fa65709584ad8e77d238529be13b8"
    }
  })


  geometry_msgs.Point = ros.Message.extend({
    defaults: {
      "fields" : ["x","y","z"]
    , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
    , "x" : null, "y" : null, "z" : null
    , "type" : "geometry_msgs/Point"
    , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
    }
  })


  geometry_msgs.Point32 = ros.Message.extend({
    defaults: {
      "fields" : ["x","y","z"]
    , "fieldTypes" : {"x":"float32","y":"float32","z":"float32"}
    , "x" : null, "y" : null, "z" : null
    , "type" : "geometry_msgs/Point32"
    , "md5sum" : "cc153912f1453b708d221682bc23d9ac"
    }
  })


  geometry_msgs.Quaternion = ros.Message.extend({
    defaults: {
      "fields" : ["x","y","z","w"]
    , "fieldTypes" : {"x":"float64","y":"float64","z":"float64","w":"float64"}
    , "x" : null, "y" : null, "z" : null, "w" : null
    , "type" : "geometry_msgs/Quaternion"
    , "md5sum" : "a779879fadf0160734f906b8c19c7004"
    }
  })


  geometry_msgs.Vector3 = ros.Message.extend({
    defaults: {
      "fields" : ["x","y","z"]
    , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
    , "x" : null, "y" : null, "z" : null
    , "type" : "geometry_msgs/Vector3"
    , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
    }
  })


  geometry_msgs.PointStamped = ros.Message.extend({
    defaults: {
      "fields" : ["header","point"]
    , "fieldTypes" : {"header":"std_msgs/Header","point":"geometry_msgs/Point"}
    , "header" : null, "point" : null
    , "type" : "geometry_msgs/PointStamped"
    , "md5sum" : "c63aecb41bfdfd6b7e1fac37c7cbe7bf"
    }
  , initialize: function(attributes) {
      var header = this.get("header")
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = this.getMessageForField("header")
        this.set({
          header: new headerMessage(header)
        })
      }
      var point = this.get("point")
      if (!point || !(point instanceof ros.Message)) {
        var pointMessage = this.getMessageForField("point")
        this.set({
          point: new pointMessage(point)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "header") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["seq","stamp","frame_id"]
          , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
          , "seq" : null, "stamp" : null, "frame_id" : null
          , "type" : "std_msgs/Header"
          , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
          }
        })
      }
      else if (fieldName === "point") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z"]
          , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
          , "x" : null, "y" : null, "z" : null
          , "type" : "geometry_msgs/Point"
          , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.Twist = ros.Message.extend({
    defaults: {
      "fields" : ["linear","angular"]
    , "fieldTypes" : {"linear":"geometry_msgs/Vector3","angular":"geometry_msgs/Vector3"}
    , "linear" : null, "angular" : null
    , "type" : "geometry_msgs/Twist"
    , "md5sum" : "9f195f881246fdfa2798d1d3eebca84a"
    }
  , initialize: function(attributes) {
      var linear = this.get("linear")
      if (!linear || !(linear instanceof ros.Message)) {
        var linearMessage = this.getMessageForField("linear")
        this.set({
          linear: new linearMessage(linear)
        })
      }
      var angular = this.get("angular")
      if (!angular || !(angular instanceof ros.Message)) {
        var angularMessage = this.getMessageForField("angular")
        this.set({
          angular: new angularMessage(angular)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "linear") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z"]
          , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
          , "x" : null, "y" : null, "z" : null
          , "type" : "geometry_msgs/Vector3"
          , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
          }
        })
      }
      else if (fieldName === "angular") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z"]
          , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
          , "x" : null, "y" : null, "z" : null
          , "type" : "geometry_msgs/Vector3"
          , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.QuaternionStamped = ros.Message.extend({
    defaults: {
      "fields" : ["header","quaternion"]
    , "fieldTypes" : {"header":"std_msgs/Header","quaternion":"geometry_msgs/Quaternion"}
    , "header" : null, "quaternion" : null
    , "type" : "geometry_msgs/QuaternionStamped"
    , "md5sum" : "e57f1e547e0e1fd13504588ffc8334e2"
    }
  , initialize: function(attributes) {
      var header = this.get("header")
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = this.getMessageForField("header")
        this.set({
          header: new headerMessage(header)
        })
      }
      var quaternion = this.get("quaternion")
      if (!quaternion || !(quaternion instanceof ros.Message)) {
        var quaternionMessage = this.getMessageForField("quaternion")
        this.set({
          quaternion: new quaternionMessage(quaternion)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "header") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["seq","stamp","frame_id"]
          , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
          , "seq" : null, "stamp" : null, "frame_id" : null
          , "type" : "std_msgs/Header"
          , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
          }
        })
      }
      else if (fieldName === "quaternion") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z","w"]
          , "fieldTypes" : {"x":"float64","y":"float64","z":"float64","w":"float64"}
          , "x" : null, "y" : null, "z" : null, "w" : null
          , "type" : "geometry_msgs/Quaternion"
          , "md5sum" : "a779879fadf0160734f906b8c19c7004"
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.Vector3Stamped = ros.Message.extend({
    defaults: {
      "fields" : ["header","vector"]
    , "fieldTypes" : {"header":"std_msgs/Header","vector":"geometry_msgs/Vector3"}
    , "header" : null, "vector" : null
    , "type" : "geometry_msgs/Vector3Stamped"
    , "md5sum" : "7b324c7325e683bf02a9b14b01090ec7"
    }
  , initialize: function(attributes) {
      var header = this.get("header")
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = this.getMessageForField("header")
        this.set({
          header: new headerMessage(header)
        })
      }
      var vector = this.get("vector")
      if (!vector || !(vector instanceof ros.Message)) {
        var vectorMessage = this.getMessageForField("vector")
        this.set({
          vector: new vectorMessage(vector)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "header") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["seq","stamp","frame_id"]
          , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
          , "seq" : null, "stamp" : null, "frame_id" : null
          , "type" : "std_msgs/Header"
          , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
          }
        })
      }
      else if (fieldName === "vector") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z"]
          , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
          , "x" : null, "y" : null, "z" : null
          , "type" : "geometry_msgs/Vector3"
          , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.Pose = ros.Message.extend({
    defaults: {
      "fields" : ["position","orientation"]
    , "fieldTypes" : {"position":"geometry_msgs/Point","orientation":"geometry_msgs/Quaternion"}
    , "position" : null, "orientation" : null
    , "type" : "geometry_msgs/Pose"
    , "md5sum" : "e45d45a5a1ce597b249e23fb30fc871f"
    }
  , initialize: function(attributes) {
      var position = this.get("position")
      if (!position || !(position instanceof ros.Message)) {
        var positionMessage = this.getMessageForField("position")
        this.set({
          position: new positionMessage(position)
        })
      }
      var orientation = this.get("orientation")
      if (!orientation || !(orientation instanceof ros.Message)) {
        var orientationMessage = this.getMessageForField("orientation")
        this.set({
          orientation: new orientationMessage(orientation)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "position") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z"]
          , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
          , "x" : null, "y" : null, "z" : null
          , "type" : "geometry_msgs/Point"
          , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
          }
        })
      }
      else if (fieldName === "orientation") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z","w"]
          , "fieldTypes" : {"x":"float64","y":"float64","z":"float64","w":"float64"}
          , "x" : null, "y" : null, "z" : null, "w" : null
          , "type" : "geometry_msgs/Quaternion"
          , "md5sum" : "a779879fadf0160734f906b8c19c7004"
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.Wrench = ros.Message.extend({
    defaults: {
      "fields" : ["force","torque"]
    , "fieldTypes" : {"force":"geometry_msgs/Vector3","torque":"geometry_msgs/Vector3"}
    , "force" : null, "torque" : null
    , "type" : "geometry_msgs/Wrench"
    , "md5sum" : "4f539cf138b23283b520fd271b567936"
    }
  , initialize: function(attributes) {
      var force = this.get("force")
      if (!force || !(force instanceof ros.Message)) {
        var forceMessage = this.getMessageForField("force")
        this.set({
          force: new forceMessage(force)
        })
      }
      var torque = this.get("torque")
      if (!torque || !(torque instanceof ros.Message)) {
        var torqueMessage = this.getMessageForField("torque")
        this.set({
          torque: new torqueMessage(torque)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "force") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z"]
          , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
          , "x" : null, "y" : null, "z" : null
          , "type" : "geometry_msgs/Vector3"
          , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
          }
        })
      }
      else if (fieldName === "torque") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z"]
          , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
          , "x" : null, "y" : null, "z" : null
          , "type" : "geometry_msgs/Vector3"
          , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.Polygon = ros.Message.extend({
    defaults: {
      "fields" : ["points"]
    , "fieldTypes" : {"points":"geometry_msgs/Point32[]"}
    , "points" : []
    , "type" : "geometry_msgs/Polygon"
    , "md5sum" : "cd60a26494a087f577976f0329fa120e"
    }
  , initialize: function(attributes) {
      var points = this.get("points")
      if (points instanceof Array) {
        var pointsArray = []
        for (var pointsIndex = 0; pointsIndex < points.length; pointsIndex++) {
          var pointsValue = points[pointsIndex]
          if (!(pointsValue instanceof ros.Message)) {
            var pointsMessage = this.getMessageForField("points")
            pointsArray.push(new pointsMessage(pointsValue))
          }
        }
        if (pointsArray.length > 0) {
          this.set({
            points: pointsArray
          })
        }
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "points") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z"]
          , "fieldTypes" : {"x":"float32","y":"float32","z":"float32"}
          , "x" : null, "y" : null, "z" : null
          , "type" : "geometry_msgs/Point32"
          , "md5sum" : "cc153912f1453b708d221682bc23d9ac"
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.Transform = ros.Message.extend({
    defaults: {
      "fields" : ["translation","rotation"]
    , "fieldTypes" : {"translation":"geometry_msgs/Vector3","rotation":"geometry_msgs/Quaternion"}
    , "translation" : null, "rotation" : null
    , "type" : "geometry_msgs/Transform"
    , "md5sum" : "ac9eff44abf714214112b05d54a3cf9b"
    }
  , initialize: function(attributes) {
      var translation = this.get("translation")
      if (!translation || !(translation instanceof ros.Message)) {
        var translationMessage = this.getMessageForField("translation")
        this.set({
          translation: new translationMessage(translation)
        })
      }
      var rotation = this.get("rotation")
      if (!rotation || !(rotation instanceof ros.Message)) {
        var rotationMessage = this.getMessageForField("rotation")
        this.set({
          rotation: new rotationMessage(rotation)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "translation") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z"]
          , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
          , "x" : null, "y" : null, "z" : null
          , "type" : "geometry_msgs/Vector3"
          , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
          }
        })
      }
      else if (fieldName === "rotation") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["x","y","z","w"]
          , "fieldTypes" : {"x":"float64","y":"float64","z":"float64","w":"float64"}
          , "x" : null, "y" : null, "z" : null, "w" : null
          , "type" : "geometry_msgs/Quaternion"
          , "md5sum" : "a779879fadf0160734f906b8c19c7004"
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.PolygonStamped = ros.Message.extend({
    defaults: {
      "fields" : ["header","polygon"]
    , "fieldTypes" : {"header":"std_msgs/Header","polygon":"geometry_msgs/Polygon"}
    , "header" : null, "polygon" : null
    , "type" : "geometry_msgs/PolygonStamped"
    , "md5sum" : "c6be8f7dc3bee7fe9e8d296070f53340"
    }
  , initialize: function(attributes) {
      var header = this.get("header")
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = this.getMessageForField("header")
        this.set({
          header: new headerMessage(header)
        })
      }
      var polygon = this.get("polygon")
      if (!polygon || !(polygon instanceof ros.Message)) {
        var polygonMessage = this.getMessageForField("polygon")
        this.set({
          polygon: new polygonMessage(polygon)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "header") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["seq","stamp","frame_id"]
          , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
          , "seq" : null, "stamp" : null, "frame_id" : null
          , "type" : "std_msgs/Header"
          , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
          }
        })
      }
      else if (fieldName === "polygon") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["points"]
          , "fieldTypes" : {"points":"geometry_msgs/Point32[]"}
          , "points" : []
          , "type" : "geometry_msgs/Polygon"
          , "md5sum" : "cd60a26494a087f577976f0329fa120e"
          }
        , initialize: function(attributes) {
            var points = this.get("points")
            if (points instanceof Array) {
              var pointsArray = []
              for (var pointsIndex = 0; pointsIndex < points.length; pointsIndex++) {
                var pointsValue = points[pointsIndex]
                if (!(pointsValue instanceof ros.Message)) {
                  var pointsMessage = this.getMessageForField("points")
                  pointsArray.push(new pointsMessage(pointsValue))
                }
              }
              if (pointsArray.length > 0) {
                this.set({
                  points: pointsArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "points") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z"]
                , "fieldTypes" : {"x":"float32","y":"float32","z":"float32"}
                , "x" : null, "y" : null, "z" : null
                , "type" : "geometry_msgs/Point32"
                , "md5sum" : "cc153912f1453b708d221682bc23d9ac"
                }
              })
            }
            return Message
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.TransformStamped = ros.Message.extend({
    defaults: {
      "fields" : ["header","child_frame_id","transform"]
    , "fieldTypes" : {"header":"std_msgs/Header","child_frame_id":"string","transform":"geometry_msgs/Transform"}
    , "header" : null, "child_frame_id" : null, "transform" : null
    , "type" : "geometry_msgs/TransformStamped"
    , "md5sum" : "b5764a33bfeb3588febc2682852579b0"
    }
  , initialize: function(attributes) {
      var header = this.get("header")
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = this.getMessageForField("header")
        this.set({
          header: new headerMessage(header)
        })
      }
      var transform = this.get("transform")
      if (!transform || !(transform instanceof ros.Message)) {
        var transformMessage = this.getMessageForField("transform")
        this.set({
          transform: new transformMessage(transform)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "header") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["seq","stamp","frame_id"]
          , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
          , "seq" : null, "stamp" : null, "frame_id" : null
          , "type" : "std_msgs/Header"
          , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
          }
        })
      }
      else if (fieldName === "transform") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["translation","rotation"]
          , "fieldTypes" : {"translation":"geometry_msgs/Vector3","rotation":"geometry_msgs/Quaternion"}
          , "translation" : null, "rotation" : null
          , "type" : "geometry_msgs/Transform"
          , "md5sum" : "ac9eff44abf714214112b05d54a3cf9b"
          }
        , initialize: function(attributes) {
            var translation = this.get("translation")
            if (!translation || !(translation instanceof ros.Message)) {
              var translationMessage = this.getMessageForField("translation")
              this.set({
                translation: new translationMessage(translation)
              })
            }
            var rotation = this.get("rotation")
            if (!rotation || !(rotation instanceof ros.Message)) {
              var rotationMessage = this.getMessageForField("rotation")
              this.set({
                rotation: new rotationMessage(rotation)
              })
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "translation") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                , "x" : null, "y" : null, "z" : null
                , "type" : "geometry_msgs/Vector3"
                , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                }
              })
            }
            else if (fieldName === "rotation") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z","w"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64","w":"float64"}
                , "x" : null, "y" : null, "z" : null, "w" : null
                , "type" : "geometry_msgs/Quaternion"
                , "md5sum" : "a779879fadf0160734f906b8c19c7004"
                }
              })
            }
            return Message
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.TwistStamped = ros.Message.extend({
    defaults: {
      "fields" : ["header","twist"]
    , "fieldTypes" : {"header":"std_msgs/Header","twist":"geometry_msgs/Twist"}
    , "header" : null, "twist" : null
    , "type" : "geometry_msgs/TwistStamped"
    , "md5sum" : "98d34b0043a2093cf9d9345ab6eef12e"
    }
  , initialize: function(attributes) {
      var header = this.get("header")
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = this.getMessageForField("header")
        this.set({
          header: new headerMessage(header)
        })
      }
      var twist = this.get("twist")
      if (!twist || !(twist instanceof ros.Message)) {
        var twistMessage = this.getMessageForField("twist")
        this.set({
          twist: new twistMessage(twist)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "header") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["seq","stamp","frame_id"]
          , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
          , "seq" : null, "stamp" : null, "frame_id" : null
          , "type" : "std_msgs/Header"
          , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
          }
        })
      }
      else if (fieldName === "twist") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["linear","angular"]
          , "fieldTypes" : {"linear":"geometry_msgs/Vector3","angular":"geometry_msgs/Vector3"}
          , "linear" : null, "angular" : null
          , "type" : "geometry_msgs/Twist"
          , "md5sum" : "9f195f881246fdfa2798d1d3eebca84a"
          }
        , initialize: function(attributes) {
            var linear = this.get("linear")
            if (!linear || !(linear instanceof ros.Message)) {
              var linearMessage = this.getMessageForField("linear")
              this.set({
                linear: new linearMessage(linear)
              })
            }
            var angular = this.get("angular")
            if (!angular || !(angular instanceof ros.Message)) {
              var angularMessage = this.getMessageForField("angular")
              this.set({
                angular: new angularMessage(angular)
              })
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "linear") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                , "x" : null, "y" : null, "z" : null
                , "type" : "geometry_msgs/Vector3"
                , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                }
              })
            }
            else if (fieldName === "angular") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                , "x" : null, "y" : null, "z" : null
                , "type" : "geometry_msgs/Vector3"
                , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                }
              })
            }
            return Message
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.WrenchStamped = ros.Message.extend({
    defaults: {
      "fields" : ["header","wrench"]
    , "fieldTypes" : {"header":"std_msgs/Header","wrench":"geometry_msgs/Wrench"}
    , "header" : null, "wrench" : null
    , "type" : "geometry_msgs/WrenchStamped"
    , "md5sum" : "d78d3cb249ce23087ade7e7d0c40cfa7"
    }
  , initialize: function(attributes) {
      var header = this.get("header")
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = this.getMessageForField("header")
        this.set({
          header: new headerMessage(header)
        })
      }
      var wrench = this.get("wrench")
      if (!wrench || !(wrench instanceof ros.Message)) {
        var wrenchMessage = this.getMessageForField("wrench")
        this.set({
          wrench: new wrenchMessage(wrench)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "header") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["seq","stamp","frame_id"]
          , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
          , "seq" : null, "stamp" : null, "frame_id" : null
          , "type" : "std_msgs/Header"
          , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
          }
        })
      }
      else if (fieldName === "wrench") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["force","torque"]
          , "fieldTypes" : {"force":"geometry_msgs/Vector3","torque":"geometry_msgs/Vector3"}
          , "force" : null, "torque" : null
          , "type" : "geometry_msgs/Wrench"
          , "md5sum" : "4f539cf138b23283b520fd271b567936"
          }
        , initialize: function(attributes) {
            var force = this.get("force")
            if (!force || !(force instanceof ros.Message)) {
              var forceMessage = this.getMessageForField("force")
              this.set({
                force: new forceMessage(force)
              })
            }
            var torque = this.get("torque")
            if (!torque || !(torque instanceof ros.Message)) {
              var torqueMessage = this.getMessageForField("torque")
              this.set({
                torque: new torqueMessage(torque)
              })
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "force") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                , "x" : null, "y" : null, "z" : null
                , "type" : "geometry_msgs/Vector3"
                , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                }
              })
            }
            else if (fieldName === "torque") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                , "x" : null, "y" : null, "z" : null
                , "type" : "geometry_msgs/Vector3"
                , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                }
              })
            }
            return Message
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.PoseWithCovariance = ros.Message.extend({
    defaults: {
      "fields" : ["pose","covariance"]
    , "fieldTypes" : {"pose":"geometry_msgs/Pose","covariance":"float64[36]"}
    , "pose" : null, "covariance" : []
    , "type" : "geometry_msgs/PoseWithCovariance"
    , "md5sum" : "c23e848cf1b7533a8d7c259073a97e6f"
    }
  , initialize: function(attributes) {
      var pose = this.get("pose")
      if (!pose || !(pose instanceof ros.Message)) {
        var poseMessage = this.getMessageForField("pose")
        this.set({
          pose: new poseMessage(pose)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "pose") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["position","orientation"]
          , "fieldTypes" : {"position":"geometry_msgs/Point","orientation":"geometry_msgs/Quaternion"}
          , "position" : null, "orientation" : null
          , "type" : "geometry_msgs/Pose"
          , "md5sum" : "e45d45a5a1ce597b249e23fb30fc871f"
          }
        , initialize: function(attributes) {
            var position = this.get("position")
            if (!position || !(position instanceof ros.Message)) {
              var positionMessage = this.getMessageForField("position")
              this.set({
                position: new positionMessage(position)
              })
            }
            var orientation = this.get("orientation")
            if (!orientation || !(orientation instanceof ros.Message)) {
              var orientationMessage = this.getMessageForField("orientation")
              this.set({
                orientation: new orientationMessage(orientation)
              })
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "position") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                , "x" : null, "y" : null, "z" : null
                , "type" : "geometry_msgs/Point"
                , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                }
              })
            }
            else if (fieldName === "orientation") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z","w"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64","w":"float64"}
                , "x" : null, "y" : null, "z" : null, "w" : null
                , "type" : "geometry_msgs/Quaternion"
                , "md5sum" : "a779879fadf0160734f906b8c19c7004"
                }
              })
            }
            return Message
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.TwistWithCovariance = ros.Message.extend({
    defaults: {
      "fields" : ["twist","covariance"]
    , "fieldTypes" : {"twist":"geometry_msgs/Twist","covariance":"float64[36]"}
    , "twist" : null, "covariance" : []
    , "type" : "geometry_msgs/TwistWithCovariance"
    , "md5sum" : "1fe8a28e6890a4cc3ae4c3ca5c7d82e6"
    }
  , initialize: function(attributes) {
      var twist = this.get("twist")
      if (!twist || !(twist instanceof ros.Message)) {
        var twistMessage = this.getMessageForField("twist")
        this.set({
          twist: new twistMessage(twist)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "twist") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["linear","angular"]
          , "fieldTypes" : {"linear":"geometry_msgs/Vector3","angular":"geometry_msgs/Vector3"}
          , "linear" : null, "angular" : null
          , "type" : "geometry_msgs/Twist"
          , "md5sum" : "9f195f881246fdfa2798d1d3eebca84a"
          }
        , initialize: function(attributes) {
            var linear = this.get("linear")
            if (!linear || !(linear instanceof ros.Message)) {
              var linearMessage = this.getMessageForField("linear")
              this.set({
                linear: new linearMessage(linear)
              })
            }
            var angular = this.get("angular")
            if (!angular || !(angular instanceof ros.Message)) {
              var angularMessage = this.getMessageForField("angular")
              this.set({
                angular: new angularMessage(angular)
              })
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "linear") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                , "x" : null, "y" : null, "z" : null
                , "type" : "geometry_msgs/Vector3"
                , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                }
              })
            }
            else if (fieldName === "angular") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                , "x" : null, "y" : null, "z" : null
                , "type" : "geometry_msgs/Vector3"
                , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                }
              })
            }
            return Message
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.PoseStamped = ros.Message.extend({
    defaults: {
      "fields" : ["header","pose"]
    , "fieldTypes" : {"header":"std_msgs/Header","pose":"geometry_msgs/Pose"}
    , "header" : null, "pose" : null
    , "type" : "geometry_msgs/PoseStamped"
    , "md5sum" : "d3812c3cbc69362b77dc0b19b345f8f5"
    }
  , initialize: function(attributes) {
      var header = this.get("header")
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = this.getMessageForField("header")
        this.set({
          header: new headerMessage(header)
        })
      }
      var pose = this.get("pose")
      if (!pose || !(pose instanceof ros.Message)) {
        var poseMessage = this.getMessageForField("pose")
        this.set({
          pose: new poseMessage(pose)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "header") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["seq","stamp","frame_id"]
          , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
          , "seq" : null, "stamp" : null, "frame_id" : null
          , "type" : "std_msgs/Header"
          , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
          }
        })
      }
      else if (fieldName === "pose") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["position","orientation"]
          , "fieldTypes" : {"position":"geometry_msgs/Point","orientation":"geometry_msgs/Quaternion"}
          , "position" : null, "orientation" : null
          , "type" : "geometry_msgs/Pose"
          , "md5sum" : "e45d45a5a1ce597b249e23fb30fc871f"
          }
        , initialize: function(attributes) {
            var position = this.get("position")
            if (!position || !(position instanceof ros.Message)) {
              var positionMessage = this.getMessageForField("position")
              this.set({
                position: new positionMessage(position)
              })
            }
            var orientation = this.get("orientation")
            if (!orientation || !(orientation instanceof ros.Message)) {
              var orientationMessage = this.getMessageForField("orientation")
              this.set({
                orientation: new orientationMessage(orientation)
              })
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "position") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                , "x" : null, "y" : null, "z" : null
                , "type" : "geometry_msgs/Point"
                , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                }
              })
            }
            else if (fieldName === "orientation") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z","w"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64","w":"float64"}
                , "x" : null, "y" : null, "z" : null, "w" : null
                , "type" : "geometry_msgs/Quaternion"
                , "md5sum" : "a779879fadf0160734f906b8c19c7004"
                }
              })
            }
            return Message
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.PoseArray = ros.Message.extend({
    defaults: {
      "fields" : ["header","poses"]
    , "fieldTypes" : {"header":"std_msgs/Header","poses":"geometry_msgs/Pose[]"}
    , "header" : null, "poses" : []
    , "type" : "geometry_msgs/PoseArray"
    , "md5sum" : "916c28c5764443f268b296bb671b9d97"
    }
  , initialize: function(attributes) {
      var header = this.get("header")
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = this.getMessageForField("header")
        this.set({
          header: new headerMessage(header)
        })
      }
      var poses = this.get("poses")
      if (poses instanceof Array) {
        var posesArray = []
        for (var posesIndex = 0; posesIndex < poses.length; posesIndex++) {
          var posesValue = poses[posesIndex]
          if (!(posesValue instanceof ros.Message)) {
            var posesMessage = this.getMessageForField("poses")
            posesArray.push(new posesMessage(posesValue))
          }
        }
        if (posesArray.length > 0) {
          this.set({
            poses: posesArray
          })
        }
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "header") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["seq","stamp","frame_id"]
          , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
          , "seq" : null, "stamp" : null, "frame_id" : null
          , "type" : "std_msgs/Header"
          , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
          }
        })
      }
      else if (fieldName === "poses") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["position","orientation"]
          , "fieldTypes" : {"position":"geometry_msgs/Point","orientation":"geometry_msgs/Quaternion"}
          , "position" : null, "orientation" : null
          , "type" : "geometry_msgs/Pose"
          , "md5sum" : "e45d45a5a1ce597b249e23fb30fc871f"
          }
        , initialize: function(attributes) {
            var position = this.get("position")
            if (!position || !(position instanceof ros.Message)) {
              var positionMessage = this.getMessageForField("position")
              this.set({
                position: new positionMessage(position)
              })
            }
            var orientation = this.get("orientation")
            if (!orientation || !(orientation instanceof ros.Message)) {
              var orientationMessage = this.getMessageForField("orientation")
              this.set({
                orientation: new orientationMessage(orientation)
              })
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "position") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                , "x" : null, "y" : null, "z" : null
                , "type" : "geometry_msgs/Point"
                , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                }
              })
            }
            else if (fieldName === "orientation") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["x","y","z","w"]
                , "fieldTypes" : {"x":"float64","y":"float64","z":"float64","w":"float64"}
                , "x" : null, "y" : null, "z" : null, "w" : null
                , "type" : "geometry_msgs/Quaternion"
                , "md5sum" : "a779879fadf0160734f906b8c19c7004"
                }
              })
            }
            return Message
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.PoseWithCovarianceStamped = ros.Message.extend({
    defaults: {
      "fields" : ["header","pose"]
    , "fieldTypes" : {"header":"std_msgs/Header","pose":"geometry_msgs/PoseWithCovariance"}
    , "header" : null, "pose" : null
    , "type" : "geometry_msgs/PoseWithCovarianceStamped"
    , "md5sum" : "953b798c0f514ff060a53a3498ce6246"
    }
  , initialize: function(attributes) {
      var header = this.get("header")
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = this.getMessageForField("header")
        this.set({
          header: new headerMessage(header)
        })
      }
      var pose = this.get("pose")
      if (!pose || !(pose instanceof ros.Message)) {
        var poseMessage = this.getMessageForField("pose")
        this.set({
          pose: new poseMessage(pose)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "header") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["seq","stamp","frame_id"]
          , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
          , "seq" : null, "stamp" : null, "frame_id" : null
          , "type" : "std_msgs/Header"
          , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
          }
        })
      }
      else if (fieldName === "pose") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["pose","covariance"]
          , "fieldTypes" : {"pose":"geometry_msgs/Pose","covariance":"float64[36]"}
          , "pose" : null, "covariance" : []
          , "type" : "geometry_msgs/PoseWithCovariance"
          , "md5sum" : "c23e848cf1b7533a8d7c259073a97e6f"
          }
        , initialize: function(attributes) {
            var pose = this.get("pose")
            if (!pose || !(pose instanceof ros.Message)) {
              var poseMessage = this.getMessageForField("pose")
              this.set({
                pose: new poseMessage(pose)
              })
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "pose") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["position","orientation"]
                , "fieldTypes" : {"position":"geometry_msgs/Point","orientation":"geometry_msgs/Quaternion"}
                , "position" : null, "orientation" : null
                , "type" : "geometry_msgs/Pose"
                , "md5sum" : "e45d45a5a1ce597b249e23fb30fc871f"
                }
              , initialize: function(attributes) {
                  var position = this.get("position")
                  if (!position || !(position instanceof ros.Message)) {
                    var positionMessage = this.getMessageForField("position")
                    this.set({
                      position: new positionMessage(position)
                    })
                  }
                  var orientation = this.get("orientation")
                  if (!orientation || !(orientation instanceof ros.Message)) {
                    var orientationMessage = this.getMessageForField("orientation")
                    this.set({
                      orientation: new orientationMessage(orientation)
                    })
                  }
                }
              , getMessageForField: function(fieldName) {
                  var Message = null
                  if (fieldName === "position") {
                    Message = ros.Message.extend({
                      defaults: {
                        "fields" : ["x","y","z"]
                      , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                      , "x" : null, "y" : null, "z" : null
                      , "type" : "geometry_msgs/Point"
                      , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                      }
                    })
                  }
                  else if (fieldName === "orientation") {
                    Message = ros.Message.extend({
                      defaults: {
                        "fields" : ["x","y","z","w"]
                      , "fieldTypes" : {"x":"float64","y":"float64","z":"float64","w":"float64"}
                      , "x" : null, "y" : null, "z" : null, "w" : null
                      , "type" : "geometry_msgs/Quaternion"
                      , "md5sum" : "a779879fadf0160734f906b8c19c7004"
                      }
                    })
                  }
                  return Message
                }
              })
            }
            return Message
          }
        })
      }
      return Message
    }
  })


  geometry_msgs.TwistWithCovarianceStamped = ros.Message.extend({
    defaults: {
      "fields" : ["header","twist"]
    , "fieldTypes" : {"header":"std_msgs/Header","twist":"geometry_msgs/TwistWithCovariance"}
    , "header" : null, "twist" : null
    , "type" : "geometry_msgs/TwistWithCovarianceStamped"
    , "md5sum" : "8927a1a12fb2607ceea095b2dc440a96"
    }
  , initialize: function(attributes) {
      var header = this.get("header")
      if (!header || !(header instanceof ros.Message)) {
        var headerMessage = this.getMessageForField("header")
        this.set({
          header: new headerMessage(header)
        })
      }
      var twist = this.get("twist")
      if (!twist || !(twist instanceof ros.Message)) {
        var twistMessage = this.getMessageForField("twist")
        this.set({
          twist: new twistMessage(twist)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "header") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["seq","stamp","frame_id"]
          , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
          , "seq" : null, "stamp" : null, "frame_id" : null
          , "type" : "std_msgs/Header"
          , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
          }
        })
      }
      else if (fieldName === "twist") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["twist","covariance"]
          , "fieldTypes" : {"twist":"geometry_msgs/Twist","covariance":"float64[36]"}
          , "twist" : null, "covariance" : []
          , "type" : "geometry_msgs/TwistWithCovariance"
          , "md5sum" : "1fe8a28e6890a4cc3ae4c3ca5c7d82e6"
          }
        , initialize: function(attributes) {
            var twist = this.get("twist")
            if (!twist || !(twist instanceof ros.Message)) {
              var twistMessage = this.getMessageForField("twist")
              this.set({
                twist: new twistMessage(twist)
              })
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "twist") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["linear","angular"]
                , "fieldTypes" : {"linear":"geometry_msgs/Vector3","angular":"geometry_msgs/Vector3"}
                , "linear" : null, "angular" : null
                , "type" : "geometry_msgs/Twist"
                , "md5sum" : "9f195f881246fdfa2798d1d3eebca84a"
                }
              , initialize: function(attributes) {
                  var linear = this.get("linear")
                  if (!linear || !(linear instanceof ros.Message)) {
                    var linearMessage = this.getMessageForField("linear")
                    this.set({
                      linear: new linearMessage(linear)
                    })
                  }
                  var angular = this.get("angular")
                  if (!angular || !(angular instanceof ros.Message)) {
                    var angularMessage = this.getMessageForField("angular")
                    this.set({
                      angular: new angularMessage(angular)
                    })
                  }
                }
              , getMessageForField: function(fieldName) {
                  var Message = null
                  if (fieldName === "linear") {
                    Message = ros.Message.extend({
                      defaults: {
                        "fields" : ["x","y","z"]
                      , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                      , "x" : null, "y" : null, "z" : null
                      , "type" : "geometry_msgs/Vector3"
                      , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                      }
                    })
                  }
                  else if (fieldName === "angular") {
                    Message = ros.Message.extend({
                      defaults: {
                        "fields" : ["x","y","z"]
                      , "fieldTypes" : {"x":"float64","y":"float64","z":"float64"}
                      , "x" : null, "y" : null, "z" : null
                      , "type" : "geometry_msgs/Vector3"
                      , "md5sum" : "4a842b65f413084dc2b10fb484ea7f17"
                      }
                    })
                  }
                  return Message
                }
              })
            }
            return Message
          }
        })
      }
      return Message
    }
  })



}).call(this)

