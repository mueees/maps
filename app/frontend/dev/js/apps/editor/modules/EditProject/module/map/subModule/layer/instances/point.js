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
                "handlerViewClick"
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

            //draggable
            //clickable
            //alt
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
         * */
        handlerViewClick:function(e){
            var isEdit = this._feature.get('isEdit');
            if(isEdit) return false;
            this._feature.set('isEdit', !isEdit);
        },
        handlerChangeIsEdit:function(){
            var isEdit = this._feature.get('isEdit');
            if(isEdit){
                this.trigger('editFeature');
                /*повторно устанавливаем значение в true, потому что
                * editFeature - отключил у всех фич isEdit свойство
                * */
                this._feature.set('isEdit', isEdit, {silent: true});
            }
            this.setDragging(isEdit);

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