(function() {

  var root = this

  var ros = null
  var std_msgs = null
  if (typeof exports !== 'undefined') {
    ros = require('../lib/rosnode')
    std_msgs = exports
  }
  else {
    ros = root.ros
    std_msgs = root.std_msgs = {}
  }


  std_msgs.Empty = ros.Message.extend({
    defaults: {
      "fields" : []
    , "fieldTypes" : {}
    
    , "type" : "std_msgs/Empty"
    , "md5sum" : "d41d8cd98f00b204e9800998ecf8427e"
    }
  })


  std_msgs.Float64 = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"float64"}
    , "data" : null
    , "type" : "std_msgs/Float64"
    , "md5sum" : "fdb28210bfa9d7c91146260178d9a584"
    }
  })


  std_msgs.Int32 = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"int32"}
    , "data" : null
    , "type" : "std_msgs/Int32"
    , "md5sum" : "da5909fbe378aeaf85e547e830cc1bb7"
    }
  })


  std_msgs.Int16 = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"int16"}
    , "data" : null
    , "type" : "std_msgs/Int16"
    , "md5sum" : "8524586e34fbd7cb1c08c5f5f1ca0e57"
    }
  })


  std_msgs.Time = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"time"}
    , "data" : null
    , "type" : "std_msgs/Time"
    , "md5sum" : "cd7166c74c552c311fbcc2fe5a7bc289"
    }
  })


  std_msgs.ColorRGBA = ros.Message.extend({
    defaults: {
      "fields" : ["r","g","b","a"]
    , "fieldTypes" : {"r":"float32","g":"float32","b":"float32","a":"float32"}
    , "r" : null, "g" : null, "b" : null, "a" : null
    , "type" : "std_msgs/ColorRGBA"
    , "md5sum" : "a29a96539573343b1310c73607334b00"
    }
  })


  std_msgs.Header = ros.Message.extend({
    defaults: {
      "fields" : ["seq","stamp","frame_id"]
    , "fieldTypes" : {"seq":"uint32","stamp":"time","frame_id":"string"}
    , "seq" : null, "stamp" : null, "frame_id" : null
    , "type" : "std_msgs/Header"
    , "md5sum" : "2176decaecbce78abc3b96ef049fabed"
    }
  })


  std_msgs.Duration = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"duration"}
    , "data" : null
    , "type" : "std_msgs/Duration"
    , "md5sum" : "3e286caf4241d664e55f3ad380e2ae46"
    }
  })


  std_msgs.MultiArrayDimension = ros.Message.extend({
    defaults: {
      "fields" : ["label","size","stride"]
    , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
    , "label" : null, "size" : null, "stride" : null
    , "type" : "std_msgs/MultiArrayDimension"
    , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
    }
  })


  std_msgs.Bool = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"bool"}
    , "data" : null
    , "type" : "std_msgs/Bool"
    , "md5sum" : "8b94c1b53db61fb6aed406028ad6332a"
    }
  })


  std_msgs.UInt16 = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"uint16"}
    , "data" : null
    , "type" : "std_msgs/UInt16"
    , "md5sum" : "1df79edf208b629fe6b81923a544552d"
    }
  })


  std_msgs.Char = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"char"}
    , "data" : null
    , "type" : "std_msgs/Char"
    , "md5sum" : "1bf77f25acecdedba0e224b162199717"
    }
  })


  std_msgs.UInt32 = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"uint32"}
    , "data" : null
    , "type" : "std_msgs/UInt32"
    , "md5sum" : "304a39449588c7f8ce2df6e8001c5fce"
    }
  })


  std_msgs.String = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"string"}
    , "data" : null
    , "type" : "std_msgs/String"
    , "md5sum" : "992ce8a1687cec8c8bd883ec73ca41d1"
    }
  })


  std_msgs.Byte = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"byte"}
    , "data" : null
    , "type" : "std_msgs/Byte"
    , "md5sum" : "ad736a2e8818154c487bb80fe42ce43b"
    }
  })


  std_msgs.UInt64 = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"uint64"}
    , "data" : null
    , "type" : "std_msgs/UInt64"
    , "md5sum" : "1b2a79973e8bf53d7b53acb71299cb57"
    }
  })


  std_msgs.Int8 = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"int8"}
    , "data" : null
    , "type" : "std_msgs/Int8"
    , "md5sum" : "27ffa0c9c4b8fb8492252bcad9e5c57b"
    }
  })


  std_msgs.Int64 = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"int64"}
    , "data" : null
    , "type" : "std_msgs/Int64"
    , "md5sum" : "34add168574510e6e17f5d23ecc077ef"
    }
  })


  std_msgs.Float32 = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"float32"}
    , "data" : null
    , "type" : "std_msgs/Float32"
    , "md5sum" : "73fcbf46b49191e672908e50842a83d4"
    }
  })


  std_msgs.UInt8 = ros.Message.extend({
    defaults: {
      "fields" : ["data"]
    , "fieldTypes" : {"data":"uint8"}
    , "data" : null
    , "type" : "std_msgs/UInt8"
    , "md5sum" : "7c8164229e7d2c17eb95e9231617fdee"
    }
  })


  std_msgs.MultiArrayLayout = ros.Message.extend({
    defaults: {
      "fields" : ["dim","data_offset"]
    , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
    , "dim" : [], "data_offset" : null
    , "type" : "std_msgs/MultiArrayLayout"
    , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
    }
  , initialize: function(attributes) {
      var dim = this.get("dim")
      if (dim instanceof Array) {
        var dimArray = []
        for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
          var dimValue = dim[dimIndex]
          if (!(dimValue instanceof ros.Message)) {
            var dimMessage = this.getMessageForField("dim")
            dimArray.push(new dimMessage(dimValue))
          }
        }
        if (dimArray.length > 0) {
          this.set({
            dim: dimArray
          })
        }
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "dim") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["label","size","stride"]
          , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
          , "label" : null, "size" : null, "stride" : null
          , "type" : "std_msgs/MultiArrayDimension"
          , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
          }
        })
      }
      return Message
    }
  })


  std_msgs.ByteMultiArray = ros.Message.extend({
    defaults: {
      "fields" : ["layout","data"]
    , "fieldTypes" : {"layout":"std_msgs/MultiArrayLayout","data":"byte[]"}
    , "layout" : null, "data" : []
    , "type" : "std_msgs/ByteMultiArray"
    , "md5sum" : "70ea476cbcfd65ac2f68f3cda1e891fe"
    }
  , initialize: function(attributes) {
      var layout = this.get("layout")
      if (!layout || !(layout instanceof ros.Message)) {
        var layoutMessage = this.getMessageForField("layout")
        this.set({
          layout: new layoutMessage(layout)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "layout") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["dim","data_offset"]
          , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
          , "dim" : [], "data_offset" : null
          , "type" : "std_msgs/MultiArrayLayout"
          , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
          }
        , initialize: function(attributes) {
            var dim = this.get("dim")
            if (dim instanceof Array) {
              var dimArray = []
              for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
                var dimValue = dim[dimIndex]
                if (!(dimValue instanceof ros.Message)) {
                  var dimMessage = this.getMessageForField("dim")
                  dimArray.push(new dimMessage(dimValue))
                }
              }
              if (dimArray.length > 0) {
                this.set({
                  dim: dimArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "dim") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["label","size","stride"]
                , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
                , "label" : null, "size" : null, "stride" : null
                , "type" : "std_msgs/MultiArrayDimension"
                , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
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


  std_msgs.Float64MultiArray = ros.Message.extend({
    defaults: {
      "fields" : ["layout","data"]
    , "fieldTypes" : {"layout":"std_msgs/MultiArrayLayout","data":"float64[]"}
    , "layout" : null, "data" : []
    , "type" : "std_msgs/Float64MultiArray"
    , "md5sum" : "4b7d974086d4060e7db4613a7e6c3ba4"
    }
  , initialize: function(attributes) {
      var layout = this.get("layout")
      if (!layout || !(layout instanceof ros.Message)) {
        var layoutMessage = this.getMessageForField("layout")
        this.set({
          layout: new layoutMessage(layout)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "layout") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["dim","data_offset"]
          , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
          , "dim" : [], "data_offset" : null
          , "type" : "std_msgs/MultiArrayLayout"
          , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
          }
        , initialize: function(attributes) {
            var dim = this.get("dim")
            if (dim instanceof Array) {
              var dimArray = []
              for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
                var dimValue = dim[dimIndex]
                if (!(dimValue instanceof ros.Message)) {
                  var dimMessage = this.getMessageForField("dim")
                  dimArray.push(new dimMessage(dimValue))
                }
              }
              if (dimArray.length > 0) {
                this.set({
                  dim: dimArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "dim") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["label","size","stride"]
                , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
                , "label" : null, "size" : null, "stride" : null
                , "type" : "std_msgs/MultiArrayDimension"
                , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
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


  std_msgs.UInt32MultiArray = ros.Message.extend({
    defaults: {
      "fields" : ["layout","data"]
    , "fieldTypes" : {"layout":"std_msgs/MultiArrayLayout","data":"uint32[]"}
    , "layout" : null, "data" : []
    , "type" : "std_msgs/UInt32MultiArray"
    , "md5sum" : "4d6a180abc9be191b96a7eda6c8a233d"
    }
  , initialize: function(attributes) {
      var layout = this.get("layout")
      if (!layout || !(layout instanceof ros.Message)) {
        var layoutMessage = this.getMessageForField("layout")
        this.set({
          layout: new layoutMessage(layout)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "layout") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["dim","data_offset"]
          , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
          , "dim" : [], "data_offset" : null
          , "type" : "std_msgs/MultiArrayLayout"
          , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
          }
        , initialize: function(attributes) {
            var dim = this.get("dim")
            if (dim instanceof Array) {
              var dimArray = []
              for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
                var dimValue = dim[dimIndex]
                if (!(dimValue instanceof ros.Message)) {
                  var dimMessage = this.getMessageForField("dim")
                  dimArray.push(new dimMessage(dimValue))
                }
              }
              if (dimArray.length > 0) {
                this.set({
                  dim: dimArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "dim") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["label","size","stride"]
                , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
                , "label" : null, "size" : null, "stride" : null
                , "type" : "std_msgs/MultiArrayDimension"
                , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
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


  std_msgs.Int8MultiArray = ros.Message.extend({
    defaults: {
      "fields" : ["layout","data"]
    , "fieldTypes" : {"layout":"std_msgs/MultiArrayLayout","data":"int8[]"}
    , "layout" : null, "data" : []
    , "type" : "std_msgs/Int8MultiArray"
    , "md5sum" : "d7c1af35a1b4781bbe79e03dd94b7c13"
    }
  , initialize: function(attributes) {
      var layout = this.get("layout")
      if (!layout || !(layout instanceof ros.Message)) {
        var layoutMessage = this.getMessageForField("layout")
        this.set({
          layout: new layoutMessage(layout)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "layout") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["dim","data_offset"]
          , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
          , "dim" : [], "data_offset" : null
          , "type" : "std_msgs/MultiArrayLayout"
          , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
          }
        , initialize: function(attributes) {
            var dim = this.get("dim")
            if (dim instanceof Array) {
              var dimArray = []
              for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
                var dimValue = dim[dimIndex]
                if (!(dimValue instanceof ros.Message)) {
                  var dimMessage = this.getMessageForField("dim")
                  dimArray.push(new dimMessage(dimValue))
                }
              }
              if (dimArray.length > 0) {
                this.set({
                  dim: dimArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "dim") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["label","size","stride"]
                , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
                , "label" : null, "size" : null, "stride" : null
                , "type" : "std_msgs/MultiArrayDimension"
                , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
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


  std_msgs.UInt16MultiArray = ros.Message.extend({
    defaults: {
      "fields" : ["layout","data"]
    , "fieldTypes" : {"layout":"std_msgs/MultiArrayLayout","data":"uint16[]"}
    , "layout" : null, "data" : []
    , "type" : "std_msgs/UInt16MultiArray"
    , "md5sum" : "52f264f1c973c4b73790d384c6cb4484"
    }
  , initialize: function(attributes) {
      var layout = this.get("layout")
      if (!layout || !(layout instanceof ros.Message)) {
        var layoutMessage = this.getMessageForField("layout")
        this.set({
          layout: new layoutMessage(layout)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "layout") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["dim","data_offset"]
          , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
          , "dim" : [], "data_offset" : null
          , "type" : "std_msgs/MultiArrayLayout"
          , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
          }
        , initialize: function(attributes) {
            var dim = this.get("dim")
            if (dim instanceof Array) {
              var dimArray = []
              for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
                var dimValue = dim[dimIndex]
                if (!(dimValue instanceof ros.Message)) {
                  var dimMessage = this.getMessageForField("dim")
                  dimArray.push(new dimMessage(dimValue))
                }
              }
              if (dimArray.length > 0) {
                this.set({
                  dim: dimArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "dim") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["label","size","stride"]
                , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
                , "label" : null, "size" : null, "stride" : null
                , "type" : "std_msgs/MultiArrayDimension"
                , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
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


  std_msgs.Float32MultiArray = ros.Message.extend({
    defaults: {
      "fields" : ["layout","data"]
    , "fieldTypes" : {"layout":"std_msgs/MultiArrayLayout","data":"float32[]"}
    , "layout" : null, "data" : []
    , "type" : "std_msgs/Float32MultiArray"
    , "md5sum" : "6a40e0ffa6a17a503ac3f8616991b1f6"
    }
  , initialize: function(attributes) {
      var layout = this.get("layout")
      if (!layout || !(layout instanceof ros.Message)) {
        var layoutMessage = this.getMessageForField("layout")
        this.set({
          layout: new layoutMessage(layout)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "layout") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["dim","data_offset"]
          , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
          , "dim" : [], "data_offset" : null
          , "type" : "std_msgs/MultiArrayLayout"
          , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
          }
        , initialize: function(attributes) {
            var dim = this.get("dim")
            if (dim instanceof Array) {
              var dimArray = []
              for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
                var dimValue = dim[dimIndex]
                if (!(dimValue instanceof ros.Message)) {
                  var dimMessage = this.getMessageForField("dim")
                  dimArray.push(new dimMessage(dimValue))
                }
              }
              if (dimArray.length > 0) {
                this.set({
                  dim: dimArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "dim") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["label","size","stride"]
                , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
                , "label" : null, "size" : null, "stride" : null
                , "type" : "std_msgs/MultiArrayDimension"
                , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
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


  std_msgs.UInt64MultiArray = ros.Message.extend({
    defaults: {
      "fields" : ["layout","data"]
    , "fieldTypes" : {"layout":"std_msgs/MultiArrayLayout","data":"uint64[]"}
    , "layout" : null, "data" : []
    , "type" : "std_msgs/UInt64MultiArray"
    , "md5sum" : "6088f127afb1d6c72927aa1247e945af"
    }
  , initialize: function(attributes) {
      var layout = this.get("layout")
      if (!layout || !(layout instanceof ros.Message)) {
        var layoutMessage = this.getMessageForField("layout")
        this.set({
          layout: new layoutMessage(layout)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "layout") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["dim","data_offset"]
          , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
          , "dim" : [], "data_offset" : null
          , "type" : "std_msgs/MultiArrayLayout"
          , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
          }
        , initialize: function(attributes) {
            var dim = this.get("dim")
            if (dim instanceof Array) {
              var dimArray = []
              for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
                var dimValue = dim[dimIndex]
                if (!(dimValue instanceof ros.Message)) {
                  var dimMessage = this.getMessageForField("dim")
                  dimArray.push(new dimMessage(dimValue))
                }
              }
              if (dimArray.length > 0) {
                this.set({
                  dim: dimArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "dim") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["label","size","stride"]
                , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
                , "label" : null, "size" : null, "stride" : null
                , "type" : "std_msgs/MultiArrayDimension"
                , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
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


  std_msgs.Int32MultiArray = ros.Message.extend({
    defaults: {
      "fields" : ["layout","data"]
    , "fieldTypes" : {"layout":"std_msgs/MultiArrayLayout","data":"int32[]"}
    , "layout" : null, "data" : []
    , "type" : "std_msgs/Int32MultiArray"
    , "md5sum" : "1d99f79f8b325b44fee908053e9c945b"
    }
  , initialize: function(attributes) {
      var layout = this.get("layout")
      if (!layout || !(layout instanceof ros.Message)) {
        var layoutMessage = this.getMessageForField("layout")
        this.set({
          layout: new layoutMessage(layout)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "layout") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["dim","data_offset"]
          , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
          , "dim" : [], "data_offset" : null
          , "type" : "std_msgs/MultiArrayLayout"
          , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
          }
        , initialize: function(attributes) {
            var dim = this.get("dim")
            if (dim instanceof Array) {
              var dimArray = []
              for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
                var dimValue = dim[dimIndex]
                if (!(dimValue instanceof ros.Message)) {
                  var dimMessage = this.getMessageForField("dim")
                  dimArray.push(new dimMessage(dimValue))
                }
              }
              if (dimArray.length > 0) {
                this.set({
                  dim: dimArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "dim") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["label","size","stride"]
                , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
                , "label" : null, "size" : null, "stride" : null
                , "type" : "std_msgs/MultiArrayDimension"
                , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
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


  std_msgs.Int16MultiArray = ros.Message.extend({
    defaults: {
      "fields" : ["layout","data"]
    , "fieldTypes" : {"layout":"std_msgs/MultiArrayLayout","data":"int16[]"}
    , "layout" : null, "data" : []
    , "type" : "std_msgs/Int16MultiArray"
    , "md5sum" : "d9338d7f523fcb692fae9d0a0e9f067c"
    }
  , initialize: function(attributes) {
      var layout = this.get("layout")
      if (!layout || !(layout instanceof ros.Message)) {
        var layoutMessage = this.getMessageForField("layout")
        this.set({
          layout: new layoutMessage(layout)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "layout") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["dim","data_offset"]
          , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
          , "dim" : [], "data_offset" : null
          , "type" : "std_msgs/MultiArrayLayout"
          , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
          }
        , initialize: function(attributes) {
            var dim = this.get("dim")
            if (dim instanceof Array) {
              var dimArray = []
              for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
                var dimValue = dim[dimIndex]
                if (!(dimValue instanceof ros.Message)) {
                  var dimMessage = this.getMessageForField("dim")
                  dimArray.push(new dimMessage(dimValue))
                }
              }
              if (dimArray.length > 0) {
                this.set({
                  dim: dimArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "dim") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["label","size","stride"]
                , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
                , "label" : null, "size" : null, "stride" : null
                , "type" : "std_msgs/MultiArrayDimension"
                , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
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


  std_msgs.Int64MultiArray = ros.Message.extend({
    defaults: {
      "fields" : ["layout","data"]
    , "fieldTypes" : {"layout":"std_msgs/MultiArrayLayout","data":"int64[]"}
    , "layout" : null, "data" : []
    , "type" : "std_msgs/Int64MultiArray"
    , "md5sum" : "54865aa6c65be0448113a2afc6a49270"
    }
  , initialize: function(attributes) {
      var layout = this.get("layout")
      if (!layout || !(layout instanceof ros.Message)) {
        var layoutMessage = this.getMessageForField("layout")
        this.set({
          layout: new layoutMessage(layout)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "layout") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["dim","data_offset"]
          , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
          , "dim" : [], "data_offset" : null
          , "type" : "std_msgs/MultiArrayLayout"
          , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
          }
        , initialize: function(attributes) {
            var dim = this.get("dim")
            if (dim instanceof Array) {
              var dimArray = []
              for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
                var dimValue = dim[dimIndex]
                if (!(dimValue instanceof ros.Message)) {
                  var dimMessage = this.getMessageForField("dim")
                  dimArray.push(new dimMessage(dimValue))
                }
              }
              if (dimArray.length > 0) {
                this.set({
                  dim: dimArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "dim") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["label","size","stride"]
                , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
                , "label" : null, "size" : null, "stride" : null
                , "type" : "std_msgs/MultiArrayDimension"
                , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
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


  std_msgs.UInt8MultiArray = ros.Message.extend({
    defaults: {
      "fields" : ["layout","data"]
    , "fieldTypes" : {"layout":"std_msgs/MultiArrayLayout","data":"uint8[]"}
    , "layout" : null, "data" : []
    , "type" : "std_msgs/UInt8MultiArray"
    , "md5sum" : "82373f1612381bb6ee473b5cd6f5d89c"
    }
  , initialize: function(attributes) {
      var layout = this.get("layout")
      if (!layout || !(layout instanceof ros.Message)) {
        var layoutMessage = this.getMessageForField("layout")
        this.set({
          layout: new layoutMessage(layout)
        })
      }
    }
  , getMessageForField: function(fieldName) {
      var Message = null
      if (fieldName === "layout") {
        Message = ros.Message.extend({
          defaults: {
            "fields" : ["dim","data_offset"]
          , "fieldTypes" : {"dim":"std_msgs/MultiArrayDimension[]","data_offset":"uint32"}
          , "dim" : [], "data_offset" : null
          , "type" : "std_msgs/MultiArrayLayout"
          , "md5sum" : "0fed2a11c13e11c5571b4e2a995a91a3"
          }
        , initialize: function(attributes) {
            var dim = this.get("dim")
            if (dim instanceof Array) {
              var dimArray = []
              for (var dimIndex = 0; dimIndex < dim.length; dimIndex++) {
                var dimValue = dim[dimIndex]
                if (!(dimValue instanceof ros.Message)) {
                  var dimMessage = this.getMessageForField("dim")
                  dimArray.push(new dimMessage(dimValue))
                }
              }
              if (dimArray.length > 0) {
                this.set({
                  dim: dimArray
                })
              }
            }
          }
        , getMessageForField: function(fieldName) {
            var Message = null
            if (fieldName === "dim") {
              Message = ros.Message.extend({
                defaults: {
                  "fields" : ["label","size","stride"]
                , "fieldTypes" : {"label":"string","size":"uint32","stride":"uint32"}
                , "label" : null, "size" : null, "stride" : null
                , "type" : "std_msgs/MultiArrayDimension"
                , "md5sum" : "4cd0c83a8683deae40ecdac60e53bfa8"
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

