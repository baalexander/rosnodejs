(function() {

  var root = this

  var ros = null
  var <%= packageName %> = null
  if (typeof exports !== 'undefined') {
    ros = require('./ros')
    <%= packageName %> = exports
  }
  else {
    ros = this.ros
    <%= packageName %> = root.<%= packageName %> = {}
  }

<% for (var i = 0; i < templatedMessages.length; i++) { %>
<%= templatedMessages[i] %>
<% } %>

}).call(this)

