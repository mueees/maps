define([
    'backbone',
    'config',
    './../collection/featureColl',
    'helpers/log/module',
], function(Backbone, config, FeatureColl, log){

    log(FeatureColl);

    return Backbone.Model.extend({
        defaults: {
            name: "Default group name",
            features: null
        },

        _collection: {
            features: FeatureColl
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

        initialize: function(attr){
            /*if( attr.features && _.isArray(attr.features) ){
                this.set('features', new FeatureColl( attr.features ))
            }*/
        },

        addFeature: function(feature){
            //feature.layer.toGeoJSON()
        }
    });
})