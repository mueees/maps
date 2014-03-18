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

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Map", {} );
                },

                appRoutes: {
                    "": "start"
                }

            })

            var Controller = {
                start: function(){
                    var mapView = new MapView();
                    App.main.show(mapView);
                }
            }

            var API  = {
                start: function(){Controller.start()}
            }

            Map.API = API;

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })


        }
    })


})