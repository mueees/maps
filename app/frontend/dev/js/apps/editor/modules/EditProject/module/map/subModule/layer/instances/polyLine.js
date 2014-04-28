define([
    'leaflet',
    './feature'
],function(L, Feature){
    var PolyLine = Feature.extend({
        initialize: function(){
            /*_.bindAll(this, "handlerChangeCoord",
                "handlerChangePopUp",
                "handlerChangeShow",
                "handlerChangeIsEdit",
                "handlerViewClick",
                "handlerDragEnd"
            );*/

            this.view = L.polyline([this._feature.get('lat'), this._feature.get('lon')]);
            this.bindPopUp();
        },

        subscribe:function(){
            this._feature.on('change:lon change:lat', this.handlerChangeCoord);
            this._feature.on('change:title change:description', this.handlerChangePopUp);
            this._feature.on('change:show', this.handlerChangeShow);
            this._feature.on('change:isEdit', this.handlerChangeIsEdit);
            this.view.on('click', this.handlerViewClick);
            this.view.on('dragend', this.handlerDragEnd);
        }
    });

    return PolyLine;
})