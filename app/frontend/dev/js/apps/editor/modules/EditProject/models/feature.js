define([
    'backbone',
    'config'
], function(Backbone, config){
    return Backbone.Model.extend({
        defaults: {
            title: "",
            description: ""
        }
    });
})