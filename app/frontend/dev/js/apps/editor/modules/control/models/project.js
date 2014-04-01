define([
    'backbone',
    'config'
], function(Backbone, config){
    return Backbone.Model.extend({
        defaults: {
            dateCreate: new Date(),
            lastModify: new Date(),
            name: "Default name",
            userId: "",
            isPublic: true,
            type: "guest",
            share: [],
            layers: [],
            description: "Default description"
        },
        idAttribute: '_id',
        url: config.api.project
    });
})