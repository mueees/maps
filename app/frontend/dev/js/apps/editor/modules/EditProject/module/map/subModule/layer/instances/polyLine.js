define([
    'leaflet',
    './feature'
],function(L, Feature){
    var PolyLine = Feature.extend({
        initialize: function(){
            _.bindAll(this, "handlerViewClick",
                "handlerChangeIsEdit");
            this.view = L.polyline(this.makeLatLng());
        },

        makeLatLng: function(){
            var result = [];
            var coordinates = this._feature.get('coordinates').toJSON();
            for(var i = 0; i < coordinates.length; i++){
                result.push(new L.latLng(coordinates[i].lat, coordinates[i].lon) );
            }
            return result;
        },

        subscribe:function(){
            this._feature.on('change:show', this.handlerChangeShow);
            this._feature.on('change:isEdit', this.handlerChangeIsEdit);
            this.view.on('click', this.handlerViewClick);
        },

        handlerChangeIsEdit:function(){
            if(this._feature.get('isEdit')){
                this.view.editing.enable();
                this._feature.trigger('change:custom:event:', {
                    name: "feature:centerMe",
                    model: this._feature,
                    view: this.view
                });
            }else{
                debugger
                this.view.editing.disable();
            }
        }
    });

    return PolyLine;
})