define([
    'backbone',
    './../models/marker',
    './../models/polyline'
], function(Backbone, MarkerModel, PolylineModel){

    return Backbone.Collection.extend({
        model: function(attrs, options) {
            console.log("test");
            switch(attrs.type) {
                case "marker":
                    return new MarkerModel(attrs, options);
                case "polyline":
                    return new PolylineModel(attrs, options);
            }
        }
    });

})