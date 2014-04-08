define([
    'backbone',
    'config',
    './feature'
], function(Backbone, config, FeatureModule){

    return Backbone.Model.extend({
        defaults: _.extend(FeatureModule.prototype.defaults, {
            type: "polyline"
        })
    });
})