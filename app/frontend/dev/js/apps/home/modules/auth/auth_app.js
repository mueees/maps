define([
    'jquery',
    'backbone',
    'marionette',
    './views/AuthView',
    'config',

    'apps/app',
    'helpers/notify/module'
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
                    authView.on('invalidData', function(data){
                        Controller.invalidData();
                    })
                },

                invalidData: function(){
                    App.reqres.request("notify:showNotify", {
                        text: "Invalid data. Password length minimum 3 charts",
                        withCloseBtn: true,
                        showTime: 2000,
                        type: "error"
                    });
                },

                signUp: function(data, authView){
                    $.ajax({
                        url: config.api.userSignUp,
                        type: "POST",
                        data: data,
                        success: function(data){
                            App.reqres.request("notify:showNotify", {
                                text: data.message,
                                withCloseBtn: false
                            });
                        },
                        error: function(xhr){
                            var responseText = xhr.responseText
                                , error = "Server error";
                            if( responseText ){
                                try{
                                    responseText = JSON.parse(responseText);
                                    error = responseText.error;
                                }catch(e){}
                            }
                            authView.errorSignUp();
                            App.reqres.request("notify:showNotify", {
                                text: error,
                                withCloseBtn: false,
                                type: "error"
                            });
                        }
                    })
                },

                signIn: function(data, authView){
                    $.ajax({
                        url: config.api.userSignIn,
                        type: "POST",
                        data: data,
                        success: function(data){
                            var redirect = data.redirect || config.url.afterSignIn;
                            App.reqres.request("notify:showNotify", {
                                text: "Success. Redirect to project page ... ",
                                withCloseBtn: false
                            });
                            setTimeout(function(){
                                window.location = redirect;
                            }, 1500);
                        },
                        error: function(xhr){
                            var responseText = xhr.responseText
                                , error = "Server error";
                            if( responseText ){
                                try{
                                    responseText = JSON.parse(responseText);
                                    error = responseText.error;
                                }catch(e){}
                            }

                            authView.errorSignIn();
                            App.reqres.request("notify:showNotify", {
                                text: error,
                                withCloseBtn: false,
                                type: "error"
                            });
                        }
                    })
                }
            }

            Controller.start();

        }
    })


})