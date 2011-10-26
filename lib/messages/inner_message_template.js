
      if (attributes.<%= fieldName %> === undefined) {
        var <%= fieldName %>Message = ros.Message.extend({
          defaults: <%= JSON.stringify(message.attributes) %>
        , initialize: function(attributes) {<%= templatedInnerMessages %>
          }
        })
        var <%= fieldName %> = new <%= fieldName %>Message()
        this.set({ <%= fieldName %>: <%= fieldName %>})
      }
