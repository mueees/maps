define([
    'apps/app',
    'marionette',
    'config',
    'leaflet'
], function(App, Marionette, config, L){

    App.module("EditProject.Map.Draw", {

        startWithParent: true,

        define: function(Draw, App, Backbone, Marionette, $, _){


            var Controller = {
                init: function(projectModel, map){
                    this.subscribe();
                },

                handlerFeatureType: function(){

                },

                subscribe: function(){
                    App.channels.main.on(config.channel.changeFeatureType, Controller.handlerFeatureType);
                }
            }

            Draw.Controller = Controller;



        }
    })

})