define([
    'apps/app',
    'marionette',
    'config',
    'leaflet',

    /*views*/
    './views/MapView',

    /*modules*/
    './subModule/draw/module',
    './subModule/layer/module'
], function(App, Marionette, config, L, MapView){

    App.module("EditProject.Map", {

        startWithParent: true,

        define: function(Map, App, Backbone, Marionette, $, _){

            var mapView,
                map;

            var Controller = {
                init: function(layout, projectModel){
                    mapView = new MapView();
                    layout.map.show(mapView);
                    Controller.initializeMap();
                    Map.Draw.Controller.init(projectModel, map);
                    Map.Layer.Controller.init(projectModel, map);
                },

                initializeMap: function(){
                    map = L.map( mapView.el, {zoomControl: config.map.defaults.zoomControl} )
                        .setView(config.map.defaults.center, config.map.defaults.startZoom);
                    L.tileLayer(config.map.defaults.titleLayerUrl, {maxZoom: config.map.defaults.maxZoom}).addTo(map);
                }
            }

            Map.Controller = Controller;

        }
    })

})