define([
    'underscore',
    'backbone',
    'config',
    './feature',
    '../collection/pointColl'
], function(_, Backbone, config, FeatureModel, PointColl){

    var def = _.clone(FeatureModel.prototype.defaults);
    var PolyLine = FeatureModel.extend({
        defaults: _.extend(def, {
            type: "Polyline",
            coordinates: new PointColl(),
            //style
            lineWeight: 4,
            color: "red"
        }),

        initialize: function(){
            console.log('PolyLine');
        }
    });

    Backbone.Relational.store.addModelScope({"PolyLine": PolyLine});

    return PolyLine;
})