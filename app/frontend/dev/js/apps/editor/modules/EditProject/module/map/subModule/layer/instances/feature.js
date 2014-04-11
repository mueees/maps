define([
    'jquery',
    'backbone',
    'leaflet',
    'backbone'
],function($, Backbone, L, Backbone){
    function Feature(feature){
        //Backbone Model
        this._feature = feature;
        //Leaflet view
        this.view = null;
        this.cid = this._feature.cid;

        _.bindAll(this, "handlerChangePopUp");

        this.initialize();
        this.subscribe();
    }

    $.extend(Feature.prototype, Backbone.Events, {
        bindPopUp:function(){
            this.view.bindPopup(this._feature.get('title') + this._feature.get('description')).openPopup();
        },
        handlerChangePopUp: function(){
            this.bindPopUp();
        }
    })

    Feature.extend = Backbone.View.extend;
    return Feature;
})