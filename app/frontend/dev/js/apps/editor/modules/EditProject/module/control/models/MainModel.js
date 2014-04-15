define([
    'backbone'
], function(Backbone){
    return Backbone.Model.extend({
        defaults: {
            selectedItem: null
        }
    })
})