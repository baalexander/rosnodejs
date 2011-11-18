
      var <%= fieldName %> = this.get('<%= fieldName %>')
      if (!<%= fieldName %> || !(<%= fieldName %> instanceof ros.Message)) {
        var <%= fieldName %>Message = ros.Message.extend({
          defaults: <%= JSON.stringify(message.attributes) %>
        , initialize: function(attributes) {<%= templatedInnerMessages %>
          }
        })
        this.set({
          <%= fieldName %>: new <%= fieldName %>Message(<%= fieldName %>)
        })
      }
