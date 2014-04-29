define([
    'backbone',
    './../models/feature',
    './../models/point',
    './../models/polyline'
], function(Backbone, FeatureModel, PointModel, PolylineModel){

    var FeatureColl = Backbone.Collection.extend({
        model: FeatureModel,

        initialize: function(){
            var _this = this;
            this.on("change:custom:event:", function(data){
                if(!data.name) return false;
                _this.trigger('custom:event:', data);
            });
        }
    });

    return FeatureColl;
})