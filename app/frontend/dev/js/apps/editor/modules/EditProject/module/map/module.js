define([
    'apps/app',
    'marionette',
    'config',

    /*views*/
    './views/MapView'
], function(App, Marionette, config, MapView){

    App.module("EditProject.Map", {

        startWithParent: true,

        define: function(Map, App, Backbone, Marionette, $, _){
            var Controller = {
                init: function(layout, projectModel){
                    var mapView = new MapView({
                        model: projectModel
                    })
                    layout.map.show(mapView);

                    Controller.subscribe();
                },

                subscribe: function(){
                    App.channels.main.on(config.channel.changeFeatureType, Controller.handlerFeatureType);
                },

                handlerFeatureType: function(featureType){

                }
            }

            Map.Controller = Controller;

        }
    })

})