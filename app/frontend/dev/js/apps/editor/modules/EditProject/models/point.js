define([
    'backbone',
    'config',
    './feature'
], function(Backbone, config, FeatureModel){

    return Backbone.Model.extend({
        defaults: _.extend(FeatureModel.prototype.defaults, {
            type: "Point",
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
            symbol: "",

            /*frontend*/
            isEdit: false
        })
    });
})