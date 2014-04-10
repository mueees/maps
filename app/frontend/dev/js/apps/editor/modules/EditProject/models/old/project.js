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
            groups: new GroupColl(),
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
            var groups = this.get('groups');
            if( !groups.size() ) this.initFirstGroupCollection();

        },

        initFirstGroupCollection: function(){
            this.get('groups').add({});
        },

        addFeature: function(feature){
            var featureGeoJson,
                groups,
                activeGroup;

            featureGeoJson = feature.layer.toGeoJSON();
            groups = this.get('groups');
            activeGroup = groups.at(this.get('activeGroup'));
            activeGroup.add({
                type: featureGeoJson.geometry.type,
                lon: featureGeoJson.geometry.coordinates[0],
                lat: featureGeoJson.geometry.coordinates[1]
            })
        }
    });
})