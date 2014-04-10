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

            var mapModel,
                mapView,
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
                    map = L.map( mapView.el, {zoomControl:false} ).setView([50.45, 30.52], 6);
                    L.tileLayer('http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map);
                }
            }

            Map.Controller = Controller;

        }
    })

})

/*var marker = L.marker([50.5, 30.5]);
 marker.bindPopup("est")


 var popup = L.popup()
 .setLatLng([50.5, 30.5])
 .setContent('<p>Hello world!<br />This is a nice popup.</p>')
 .openOn(map);


 var polyline = L.polyline([
 L.latLng(50.5, 30.5),
 L.latLng(50.5, 40.5)
 ], {color: 'red'}).bindPopup("est");

 var group = L.layerGroup([marker])
 .addLayer(polyline);

 group.addTo(map);

 group.eachLayer(function (layer) {
 layer.bindPopup('Hello');
 });*/