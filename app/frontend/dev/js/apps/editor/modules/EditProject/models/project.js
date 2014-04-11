define([
    'backbone',
    'config',
    './../models/group',
    './../collection/groupColl'
], function(Backbone, config, GroupModel, GroupColl){

    return Backbone.RelationalModel.extend({

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

        relations: [{
            type: Backbone.HasMany,
            key: 'groups',
            relatedModel: GroupModel,
            collectionType: GroupColl,
            includeInJSON: true,
            reverseRelation: {
                key: 'project'
            }
        }],

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
            activeGroup = this.get('groups').at( this.get('activeGroup'));
            if(!activeGroup) return false;
            activeGroup.get('features').add({
                type: featureGeoJson.geometry.type,
                lon: featureGeoJson.geometry.coordinates[0],
                lat: featureGeoJson.geometry.coordinates[1]
            })
        }
    });

})

/*

projectModel.event:

- addFeature
- removeFeature
- showFeature
- hideFeature
- showGroup
- hideGroup
- removeGroup


* */