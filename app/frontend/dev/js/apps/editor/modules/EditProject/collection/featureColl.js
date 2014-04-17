define([
    'backbone',
    './../models/point',
    './../models/polyline'
], function(Backbone, PointModel, PolylineModel){

    return Backbone.Collection.extend({
        model: function(attrs, options) {
            var type;
            type = attrs.type || "";
            type = type.toLowerCase();

            switch(type) {
                case "point":
                    return new PointModel(attrs, options);
                case "polyline":
                    return new PolylineModel(attrs, options);
            }
        }
    });

})