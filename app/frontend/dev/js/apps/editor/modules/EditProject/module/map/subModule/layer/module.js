define([
    'apps/app',
    'marionette',
    'backbone',
    'config',
    'leaflet',

    /*instances*/
    './instances/groups',

    /*helpers*/
    'helpers/log/module'
], function(App, Marionette, Backbone, config, L, Groups){

    App.module("EditProject.Map.Layer", {

        startWithParent: true,

        define: function(Layer, App, Backbone, Marionette, $, _){
            var Controller = {
                init: function(projectModel, map){
                    var groups = new Groups(projectModel.get('groups'), map);
                    groups.center();
                }
            }

            Layer.Controller = Controller;
        }
    })

})