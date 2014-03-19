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

            var defaultSettings = {
                text: "Default text",
                showTime: 3000,
                isAutoHide: true,
                withCloseBtn: true,

                //success (green)
                //error (red)
                type: 'success'
            }

            var Controller = {
                showNotify: function( options ){
                    var settings = $.extend(defaultSettings, options);

                    var notifyModel = new NotifyModel(settings);
                    var notifyView = new NotifyView({model:notifyModel});
                    $('#notice-container').append(notifyView.$el);
                    notifyView.$el.addClass('animated fadeInRight');

                    if( settings.isAutoHide ){
                        setTimeout(function(){
                            notifyView.animateClose();
                        }, settings.showTime);
                    }

                },

                getNotify: function(options){
                    var notifyModel = new NotifyModel(options);
                    var notifyView = new NotifyView({model:notifyModel});
                    return notifyView;
                },

                clearAllNotice: function(){
                    $('#notice-container .notice').html('');
                }
            }

            var API = {
                showNotify: function(options){
                    Controller.showNotify(options);
                },

                getNotify: function(){
                    return Controller.getNotify(options);
                },

                clearAllNotice: function(){
                    return Controller.clearAllNotice();
                }
            }

            Notify.API = API;

            App.reqres.setHandler('notify:showNotify', function( options ){
                return API.showNotify( options );
            })
            App.reqres.setHandler('notify:clearAllNotice', function(){
                return API.clearAllNotice();
            })

        }
    })

})