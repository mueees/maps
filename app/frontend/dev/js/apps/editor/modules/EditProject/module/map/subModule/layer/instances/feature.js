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
        }
    })

    Feature.extend = Backbone.View.extend;
    return Feature;
})