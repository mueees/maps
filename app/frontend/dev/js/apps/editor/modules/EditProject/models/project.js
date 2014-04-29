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
            shareLink: "",
            groups: new GroupColl(),
            description: "Default description",

            //front-end
            activeGroup: 0
        },

        getUrl: function(){
            return this.get('_id') ? "/api/project/edit/" + this.get('_id') : "/api/project/add";
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
            var _this = this;
            if( !this.get('groups').size() ) this.initFirstGroupCollection();

            this.get('groups').on("custom:event:", function(data){
                if(!data.name) return false;
                _this.trigger('change:custom:event:', data);
            });

        },

        initFirstGroupCollection: function(){
            this.get('groups').add({});
        },

        addFeature: function(feature){
            var featureGeoJson,
                groups,
                activeGroup;

            //LineString"

            featureGeoJson = feature.layer.toGeoJSON();
            groups = this.get('groups');
            activeGroup = this.getActiveGroup();

            if(!activeGroup){
                this.setDefaultActiveGroup();
                activeGroup = this.getActiveGroup();
            }

            if( featureGeoJson.geometry.type == "LineString" ){

                featureGeoJson.geometry.type = "Polyline";
                activeGroup.get('features').add({
                    type: featureGeoJson.geometry.type,
                    coordinates: featureGeoJson.geometry.coordinates
                });

            }else if( featureGeoJson.geometry.type == "Point" ){
                activeGroup.get('features').add({
                    type: featureGeoJson.geometry.type,
                    lon: featureGeoJson.geometry.coordinates[0],
                    lat: featureGeoJson.geometry.coordinates[1]
                });
            }
        },

        getActiveGroup: function(){
            return this.get('groups').findWhere({isActive: true});
        },

        setDefaultActiveGroup: function(){
            if(!this.get('groups').length){
                return this.initFirstGroupCollection();
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
            this.trigger('editFeature', {model:model});
        },

        disableAllEditFeature: function(){
            this.get('groups').each(function(group){
                group.get('features').each(function(feature){
                    feature.set('isEdit', false);
                })
            })
        },

        saveProject: function(options){
            options = options || {};
            options = _.extend({
                url: this.getUrl(),
                type: "POST"
            }, options);

            this.save(null,options);
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