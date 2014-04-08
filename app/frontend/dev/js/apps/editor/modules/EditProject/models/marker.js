define([
    'backbone',
    'config',
    './feature'
], function(Backbone, config, FeatureModule){

    return Backbone.Model.extend({
        defaults: _.extend(FeatureModule.prototype.defaults, {
            type: "marker",
            lon: 0,
            lat: 0,

            //style
            /**
             * s - small
             * m - medium
             * l - large
             * */
            size: 'm',

            /**
             * color hash
             * */
            color: "#ccc",

            /**
             * symbol
             * */
            symbol: ""
        })
    });
})