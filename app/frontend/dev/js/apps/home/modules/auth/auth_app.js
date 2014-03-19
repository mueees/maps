define([
    'jquery',
    'backbone',
    'marionette',
    './views/AuthView',
    'config',

    'apps/app'
], function(jQuery, Backbone, Marionette, AuthView, config, App){

    App.module("Auth", {

        startWithParent: false,

        define: function( Auth, App, Backbone, Marionette, $, _ ){

            var Controller = {
                start: function(){
                    var authView = new AuthView();
                    authView.on('signUp', function(data){
                        Controller.signUp(data, authView);
                    })
                    authView.on('signIn', function(data){
                        Controller.signIn(data, authView);
                    })
                },

                signUp: function(data, authView){
                    $.ajax({
                        url: config.api.userSignUp,
                        type: "POST",
                        data: JSON.stringify(data),
                        success: function(){

                        },
                        error: function(){
                            authView.errorSignUp();
                            App.reqres.request("notify:showNotify", {
                                text: "some error"
                            });
                        }
                    })
                },

                signIn: function(data, authView){
                    $.ajax({
                        url: config.api.userSignIn,
                        type: "POST",
                        data: JSON.stringify(data),
                        success: function(){

                        },
                        error: function(){
                            authView.errorSignIn();
                            App.reqres.request("notify:showNotify", {
                                text: "some error"
                            });
                        }
                    })
                }
            }

            Controller.start();

        }
    })


})