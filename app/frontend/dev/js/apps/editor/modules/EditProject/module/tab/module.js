define([
    'apps/app',
    'marionette',
    'config'
], function(App, Marionette, config){

    App.module("EditProject.Tab", {

        startWithParent: true,

        define: function(Tab, App, Backbone, Marionette, $, _){

            var tab = null;

            var Controller = {
                init: function(layout, projectModel){
                    this.subscribe();
                },
                subscribe:function(){
                   App.channels.on(config.channel.changeMainMenu, Controller.handlerChangeMainMenu);
                },
                handlerChangeMainMenu:function(menu){
                    tab = menu;
                    this.renderCurrentTab();
                },
                renderCurrentTab:function(){
                    if(!tab) this.clearAllTab();
                    var tabView = null;
                    switch(tab){
                        case "data":
                            break;
                    }
                },
                clearAllTab:function(){}
            }

            Tab.Controller = Controller;

        }
    })

})