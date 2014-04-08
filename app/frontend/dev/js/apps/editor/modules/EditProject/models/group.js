define([
    'backbone',
    'config',
    './../collection/featureColl'
], function(Backbone, config, FeatureColl){

    return Backbone.Model.extend({
        defaults: {
            name: "Default group name",
            features: null
        },

        collection: {
            features: FeatureColl
        },

        parse: function(response){
            var key,
                embeddedClass,
                embeddedData;

            for(key in this.collection){
                embeddedClass = this.collection[key];
                embeddedData = response[key];
                response[key] = new embeddedClass(embeddedData, {parse:true});
            }
            return response;
        },

        initialize: function(attr){
            debugger
            if( attr.features && _.isArray(data.features) ){
                this.set('feeds', new FeatureColl( attr.features ))
            }
        },

        addFeature: function(feature){
            //feature.layer.toGeoJSON()
        }
    });
})