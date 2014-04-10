define([
    'apps/app',
    'marionette',
    'config',
    'leaflet',

    /*helpers*/
    'helpers/log/module'
], function(App, Marionette, config, L,  log){

    App.module("EditProject.Map.Layer", {

        startWithParent: true,

        define: function(Layer, App, Backbone, Marionette, $, _){


            function Group(){}


            var Controller = {
                init: function(projectModel, map){
                    var group = [];
                    this.subscribe(projectModel, map);
                },

                subscribe: function(projectModel){
                    projectModel.get().on("")
                }

            }

            Layer.Controller = Controller;
        }
    })

})