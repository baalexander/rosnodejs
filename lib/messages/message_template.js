  <%= packageName %>.<%= messageName %> = ros.Message.extend({
    defaults: <%= JSON.stringify(attributes) %>
  })
