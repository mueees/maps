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
        },

        initialize: function(){
            var _this = this;
            this.on("change:custom:event:", function(data){
                if(!data.name) return false;
                debugger
                _this.trigger('custom:event:', data);
            });
        }
    });

})