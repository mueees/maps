define([
    'backbone',
    'underscore',
    'config',
    './../models/group',
    './../collection/groupColl'
], function(Backbone, _, config, GroupModel, GroupColl){

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

            activeGroup = this.getActiveGroup();

            if(!activeGroup){
                this.setDefaultActiveGroup();
                activeGroup = this.getActiveGroup();
            }

            activeGroup.get('features').add({
                type: featureGeoJson.geometry.type,
                lon: featureGeoJson.geometry.coordinates[0],
                lat: featureGeoJson.geometry.coordinates[1]
            });
        },

        getActiveGroup: function(){
            return this.get('groups').findWhere({isActive: true});
        },

        setDefaultActiveGroup: function(){
            if(!this.get('groups').length){
                return this.get('groups').add({});
            }else{
                return this.get('groups').at(0).set('isActive', true);
            }
        },

        resetAllActiveGroup: function(){
            this.get('groups').each(function(group){
                group.set('isActive', false);
            })
        },

        setEditFeature: function(model){
            if(!model) return false;
            this.disableAllEditFeature();
            model.set('isEdit', true);
        },

        disableAllEditFeature: function(){
            this.get('groups').each(function(group){
                group.get('features').each(function(feature){
                    feature.set('isEdit', false);
                })
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