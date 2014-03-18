define([
    'jquery',
    'backbone',
    'marionette',
    './views/AuthView',

    'apps/app'
], function(jQuery, Backbone, Marionette, AuthView, App){

    App.module("Auth", {

        startWithParent: false,

        define: function( Auth, App, Backbone, Marionette, $, _ ){

            var Controller = {
                start: function(){
                    var authView = new AuthView();
                }
            }

            Controller.start();


        }
    })


})