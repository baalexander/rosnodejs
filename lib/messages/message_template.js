  <%= packageName %>.<%= messageName %> = ros.Message.extend({
    defaults: <%= JSON.stringify(attributes) %>
  , initialize: function(attributes) {
<% for (var fieldName in innerMessages) { %>
<%   var innerMessage = innerMessages[fieldName]; %>
    if (attributes.<%= fieldName %> === undefined) {
      var <%= fieldName %>Message = null
      var <%= fieldName %> = new <%= fieldName %>Message()
      this.set({ <%= fieldName %>: <%= fieldName %>})
    }
<% } %>
  }
  })
