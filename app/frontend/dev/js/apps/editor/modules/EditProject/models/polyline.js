define([
    'underscore',
    'backbone',
    'config',
    './feature',
    '../collection/pointColl'
], function(_, Backbone, config, FeatureModel, PointColl){

    var def = _.clone(FeatureModel.prototype.defaults);

    var Polyline = FeatureModel.extend({
        defaults: function(){
            return _.extend(def, {
                type: "Polyline",
                coordinates_raw: [],
                coordinates: new PointColl(),
                //style
                lineWeight: 4,
                color: "red"
            })
        },

        initialize: function(){
            this.recalculateCoordinates();
        },

        recalculateCoordinates: function(){
            var coordinates_raw = this.get('coordinates_raw');
            if( !coordinates_raw.length ) return false;

            var coordinates = this.get('coordinates');
            _.each(coordinates_raw, function(coord){
                coordinates.add({
                    lon: coord[0],
                    lat: coord[1]
                })
            })
        }
    });

    Backbone.Relational.store.addModelScope({"Polyline": Polyline});

    return Polyline;
})