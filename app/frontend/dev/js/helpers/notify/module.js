define([
    'apps/app',
    'marionette',

    /*views*/
    './views/notify'
], function(App, Marionette, NotifyView){

    App.module("Notify", {

        startWithParent: true,

        define: function(Notify, App, Backbone, Marionette, $, _){

            var NotifyModel = Backbone.Model.extend();

            var Controller = {
                showNotify: function( options ){
                    var notifyModel = new NotifyModel(options);
                    var notifyView = new NotifyView({model:notifyModel});
                    $('body').append( notifyView.$el );

                    setTimeout(function(){
                        notifyView.close();
                    }, 2000);
                },

                getNotify: function(options){
                    var notifyModel = new NotifyModel(options);
                    var notifyView = new NotifyView({model:notifyModel});
                    return notifyView;
                }
            }

            var API = {
                showNotify: function(options){
                    Controller.showNotify(options);
                },

                getNotify: function(){
                    return Controller.getNotify(options);
                }
            }

            Notify.API = API;

            App.reqres.setHandler('notify:showNotify', function( options ){
                return API.showNotify( options );
            })

        }
    })

})