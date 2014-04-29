define([
    'underscore',
    'backbone',
    'config',
    './feature'
], function(_, Backbone, config, FeatureModel){

    var def = _.clone(FeatureModel.prototype.defaults);
    var Point = FeatureModel.extend({
        defaults: _.extend(def, {
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
            symbol: ""
        }),

        initialize: function(){
            console.log('Point');
        }
    });

    Backbone.Relational.store.addModelScope({"Point": Point});

    return Point;
})