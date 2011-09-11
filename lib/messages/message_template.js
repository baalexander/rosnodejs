  <%= packageName %>.<%= messageName %> = ros.Message.extend(
    {
      defaults: <%= JSON.stringify(fields) %>
    }
  , {
      type: '<%= messageType %>'
    , md5sum: '<%= md5sum %>'
    }
  )
