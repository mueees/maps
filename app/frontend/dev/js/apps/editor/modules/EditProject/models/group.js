define([
    'backbone',
    'config',
    './../models/feature',
    './../collection/featureColl',
    'helpers/log/module',
], function(Backbone, config, FeatureModel, FeatureCollection, log){

    return Backbone.RelationalModel.extend({
        relations: [{
            type: Backbone.HasMany,
            key: 'features',
            relatedModel: FeatureModel,
            collectionType: FeatureCollection,
            includeInJSON: true,
            reverseRelation: {
                key: 'group'
            }
        }],
        defaults: {
            name: "Default group name",
            features: [],

            /*
            * Show or hide all features on map
            * */
            show: true,

            /*
            * Show or hide all features on Tab-Data View
            * */
            isOpen: true,

            /*
            * Determine
            * */
            isActive: true
        },

        initialize: function(){
            var _this = this;
            this.get('features').on("custom:event:", function(data){
                debugger
                if(!data.name) return false;
                _this.trigger('change:custom:event:', data);
            });
        }
    });

})