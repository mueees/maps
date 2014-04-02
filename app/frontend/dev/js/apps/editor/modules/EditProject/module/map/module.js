define([
    'apps/app',
    'marionette',
    'config',

    /*views*/
    './views/MapView',

    /*models*/
    './models/MapModel'
], function(App, Marionette, config, MapView, MapModel){

    App.module("EditProject.Map", {

        startWithParent: true,

        define: function(Map, App, Backbone, Marionette, $, _){

            var mapModel,
                mapView;

            var Controller = {
                init: function(layout, projectModel){
                    mapModel = new MapModel({
                        projectModel: projectModel
                    })
                    mapView = new MapView({
                        model: mapModel
                    })
                    layout.map.show(mapView);
                    Controller.subscribe();
                },

                subscribe: function(){
                    App.channels.main.on(config.channel.changeFeatureType, Controller.handlerFeatureType);
                },

                handlerFeatureType: function(featureType){
                    mapModel.set('featureType', featureType);
                }
            }

            Map.Controller = Controller;

        }
    })

})