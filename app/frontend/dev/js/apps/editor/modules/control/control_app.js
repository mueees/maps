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

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Control", {} );
                },

                appRoutes: {
                    "": "start"
                }

            })

            var Controller = {
                start: function(){
                    debugger
                }
            }

            var API  = {
                start: function(){Controller.start()}
            }

            //Controller.start();

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

        }
    })


})