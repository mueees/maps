define([
    'jquery',
    'backbone',
    'leaflet',
    'backbone',
    'text!../tempaltes/popUpTemp.html'
],function($, Backbone, L, Backbone, popUpTemp){
    function Feature(feature){
        //Backbone Model
        this._feature = feature;
        //Leaflet view
        this.view = null;
        this.cid = this._feature.cid;
        this.template = _.template(popUpTemp);

        _.bindAll(this, "handlerChangePopUp");

        this.initialize();
        this.subscribe();
    }

    $.extend(Feature.prototype, Backbone.Events, {
        bindPopUp:function(){
            var view = this.template( this._feature.toJSON() );
            this.view.bindPopup(view).openPopup();
        },
        handlerChangePopUp: function(){
            this.bindPopUp();
        },
        handlerChangeShow:function(){
            if(this._feature.get('show')){
                this.trigger("show", this._feature);
            }else{
                this.trigger("hide", this._feature);
            }
        },
        /**
         * Fired when the user clicks (or taps) the marker.
         * Trigger that feature want to be Editable, this event up to Groups, and then
         * disable isEdit for all features, and enable isEdit for current _feature model
         * */
        handlerViewClick:function(e){
            if(!this._feature.get('isEdit')) this._feature.editEnable();
        }
    })

    Feature.extend = Backbone.View.extend;
    return Feature;
})