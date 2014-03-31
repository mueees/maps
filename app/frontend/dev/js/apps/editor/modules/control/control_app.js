define([
    'jquery',
    'backbone',
    'marionette',
    'config',

    'apps/app',
    'helpers/notify/module'
], function(jQuery, Backbone, Marionette, config, App){

    App.module("Control", {

        startWithParent: false,

        define: function( Control, App, Backbone, Marionette, $, _ ){

            var Controller = {
                start: function(){

                }
            }
            Controller.start();

        }
    })


})