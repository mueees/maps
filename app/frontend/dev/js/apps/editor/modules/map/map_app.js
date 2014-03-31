define([
    'jquery',
    'backbone',
    'marionette',
    './views/MapView',

    'apps/app'
], function(jQuery, Backbone, Marionette, MapView, App){

    App.module("Map", {

        startWithParent: false,

        define: function( Map, App, Backbone, Marionette, $, _ ){

            var Controller = {
                start: function(){
                    var mapView = new MapView();
                    App.main.show(mapView);
                }
            }

            Controller.start();


        }
    })


})