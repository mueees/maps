define([
    'backbone',
    'config',
    'backbone.relational'
], function(Backbone, config){
    return Backbone.RelationalModel.extend({
        defaults: {
            title: "Default title",
            description: "Default description",

            /*
             * point
             * polygon,
            * */
            type: ""
        }
    });

})