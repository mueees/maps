define([
    'apps/app',
    'marionette',
    'config',
    "./instances/TabFactory",
    "./instances/EditFeatureFactory"
], function(App, Marionette, config, TabFactory, EditFeatureFactory){

    App.module("EditProject.Tab", {

        startWithParent: true,

        define: function(Tab, App, Backbone, Marionette, $, _){

            var state = {
                layout: null,
                projectModel: null,
                tabView: null,
                currentTabType: null
            }

            var Controller = {
                init: function(layout, projectModel){
                    state.layout = layout;
                    state.projectModel = projectModel;
                    this.subscribe();
                },
                handlerMainControl: function(type){
                    if(type == state.currentTabType) return false;
                    state.currentTabType = type;

                    if(!type || type != "data") state.projectModel.disableAllEditFeature();

                    if(!type) {
                        Controller.clearTab();
                        Controller.clearEditView();
                        return;
                    }
                    Controller.showTab(type);
                },
                handlerEditFeature: function(data){
                    if(state.currentTabType != 'data'){
                        state.currentTabType = 'data';
                        Controller.showTab('data');
                        App.channels.main.trigger(config.channel.changeMainControl, 'data');
                    }

                    var feature = data.model;
                    if(!feature) return false;
                    var editView = EditFeatureFactory.make(feature);
                    state.layout.editorContainer.show(editView);
                },
                showTab:function(type){
                    Controller.clearTab();
                    Controller.clearEditView();
                    var tabView = TabFactory.make(type, state.projectModel);
                    if(!tabView) {
                        return false;
                    }
                    state.layout.tabContainer.show(tabView);
                },

                clearTab:function(){
                    if(state.layout) state.layout.tabContainer.close();
                    state.tabView = null;
                },

                clearEditView: function(){
                    if(state.layout) state.layout.editorContainer.close();
                },

                isHasEditView: function(){
                    return (state.layout.editorContainer.currentView)? true : false;
                },

                handlerKeyUp: function(e){
                    if( !e ) return false;
                    if( e.keyCode != config.key.esc ) return false;

                    /* Escape Choose */
                    if(state.currentTabType == 'data'){
                        if( Controller.isHasEditView() ){
                            Controller.clearEditView();
                            state.projectModel.disableAllEditFeature();
                            return false;
                        }
                    }

                    App.channels.main.trigger(config.channel.changeMainControl, null);
                },

                subscribe:function(){
                    App.channels.main.on(config.channel.changeMainControl, Controller.handlerMainControl);
                    state.projectModel.on('editFeature', Controller.handlerEditFeature);
                    $(window).on("keyup", Controller.handlerKeyUp);
                }
            }

            Tab.Controller = Controller;

        }
    })

})