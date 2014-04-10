define([
    'backbone',
    'config',
    'backbone.relational'
], function(Backbone, config){
    return Backbone.RelationalModel.extend({
        defaults: {
            title: "",
            description: ""
        }
    });

})