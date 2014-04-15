define([
    'apps/app',
    'marionette',
    'config',
    "./instances/TabFactory"
], function(App, Marionette, config, TabFactory){

    App.module("EditProject.Tab", {

        startWithParent: true,

        define: function(Tab, App, Backbone, Marionette, $, _){

            var Controller = {
                init: function(layout, projectModel){
                    this.subscribe();
                },
                handlerMainControl: function(type){
                    if(!type) {
                        return Controller.clearTab();
                    }

                    Controller.showTab(type);
                },
                showTab:function(type){
                    Controller.clearTab();
                    var tabView = TabFactory.make(type);
                    layout.show(tabView);
                },
                clearTab:function(){},
                subscribe:function(){
                    App.channels.main.on(config.channel.changeMainControl, Controller.handlerMainControl);
                }
            }

            Tab.Controller = Controller;

        }
    })

})