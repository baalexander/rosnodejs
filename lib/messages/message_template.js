  <%= packageName %>.<%= messageType %> = ros.Message.extend(
    {
      defaults: <%= JSON.stringify(fields) %>
    }
  , {
      type: '<%= packageName %>/<%= messageType %>'
    , md5sum: '<%= md5sum %>'
    }
  )
