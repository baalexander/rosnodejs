  <%= packageName %>.<%= messageName %> = ros.Message.extend({
    defaults: <%= JSON.stringify(attributes) %>
  , initialize: function(attributes) {<%= templatedInnerMessages %>
    }
  })
