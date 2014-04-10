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
            features: new FeatureColl()
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

        initialize: function(attr){},

        addFeature: function(feature){
            //feature.layer.toGeoJSON()
        }
    });
})