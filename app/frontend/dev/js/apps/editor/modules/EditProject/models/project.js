define([
    'backbone',
    'config',
    './../collection/groupColl'
], function(Backbone, config, GroupColl){
    return Backbone.Model.extend({
        defaults: {
            //back-end

            dateCreate: new Date(),
            lastModify: new Date(),
            name: "Default name",
            userId: "",
            isPublic: true,
            type: "guest",
            share: [],
            groups: null,
            description: "Default description",

            //front-end
            activeGroup: 0
        },

        _collection: {
            groups: GroupColl
        },

        parse: function(response){
            var key,
                embeddedClass,
                embeddedData;

            for(key in this._collection){
                embeddedClass = this._collection[key];
                embeddedData = response[key];

                response[key] = new embeddedClass(embeddedData, {parse:true});
            }
            return response;
        },

        idAttribute: '_id',
        url: config.api.project,

        initialize: function(attr){
            //this.parse(attr);
        },

        addFeature: function(feature){
            //feature.layer.toGeoJSON()
        }
    });
})