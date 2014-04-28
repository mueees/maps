define([
    'leaflet',
    './feature'
],function(L, Feature){
    var Point = Feature.extend({
        initialize: function(){
            _.bindAll(this, "handlerChangeCoord",
                "handlerChangePopUp",
                "handlerChangeShow",
                "handlerChangeIsEdit",
                "handlerViewClick",
                "handlerDragEnd"
            );
            this.view = L.marker([this._feature.get('lat'), this._feature.get('lon')]);
            this.bindPopUp();
        },
        subscribe:function(){
            this._feature.on('change:lon change:lat', this.handlerChangeCoord);
            this._feature.on('change:title change:description', this.handlerChangePopUp);
            this._feature.on('change:show', this.handlerChangeShow);
            this._feature.on('change:isEdit', this.handlerChangeIsEdit);
            this.view.on('click', this.handlerViewClick);
            this.view.on('dragend', this.handlerDragEnd);
        },
        handlerDragEnd:function(e){
            var coords = e.target.getLatLng();
            this._feature.set({
                lat: coords.lat,
                lon: coords.lng
            });
        },
        setDragging:function(toggle){
            if(toggle){
                this.view.dragging.enable();
            }else{
                this.view.dragging.disable();
            }
        },
        /**
         * Fired when the user clicks (or taps) the marker.
         * Trigger that feature want to be Editable, this event up to Groups, and then
         * disable isEdit for all features, and enable isEdit for current _feature model
         * */
        handlerViewClick:function(e){
            if(!this._feature.get('isEdit')) this._feature.editEnable();
        },
        handlerChangeIsEdit:function(){
            var _this = this;
            this.setDragging(this._feature.get('isEdit'));
            if(!this._feature.get('isEdit')) return false;

            this._feature.trigger('change:custom:event:', {
                name: "feature:centerMe",
                model: _this._feature
            });

        },
        handlerChangeCoord:function(){
            var lat = this._feature.get('lat');
            var lon = this._feature.get('lon');
            this.view.setLatLng([lat, lon]);
        },
        handlerChangeShow:function(){
            if(this._feature.get('show')){
                this.trigger("show", this._feature);
            }else{
                this.trigger("hide", this._feature);
            }
        }
    });

    return Point;
})