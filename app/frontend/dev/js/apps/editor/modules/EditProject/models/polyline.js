define([
    'backbone',
    'config',
    './feature'
], function(Backbone, config, FeatureModel){

    return Backbone.Model.extend({
        defaults: _.extend(FeatureModel.prototype.defaults, {
            type: "Polyline"
        }),

        initialize: function(){
            debugger
        }
    });
})