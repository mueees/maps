define([
    'apps/app',
    'marionette',
    'config',
    "./instances/TabFactory"
], function(App, Marionette, config, TabFactory){

    App.module("EditProject.Tab", {

        startWithParent: true,

        define: function(Tab, App, Backbone, Marionette, $, _){

            var state = {
                layout: null,
                projectModel: null,
                tabView: null
            }

            var Controller = {
                init: function(layout, projectModel){
                    state.layout = layout;
                    state.projectModel = projectModel;
                    this.showTab();
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
                    var tabView = TabFactory.make(type, state.projectModel);
                    state.layout.tabContainer.show(tabView);
                },

                clearTab:function(){
                    if(state.layout) state.layout.tabContainer.close();
                    state.tabView = null;
                },

                subscribe:function(){
                    App.channels.main.on(config.channel.changeMainControl, Controller.handlerMainControl);
                    state.projectModel.on('custom:event:', function(data){debugger});
                }
            }

            Tab.Controller = Controller;

        }
    })

})