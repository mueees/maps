define([
    'apps/app',
    'marionette',
    'config',

    /*views*/
    './views/MainButtonsView',
    './views/SecondButtonsView',

    /*models*/
    './models/MainModel',
    './models/SecondModel'

], function(App, Marionette, config, MainButtonsView, SecondButtonsView, MainModel, SecondModel){

    App.module("EditProject.Control", {

        startWithParent: true,

        define: function(Control, App, Backbone, Marionette, $, _){

            var secondModel,
                mainModel;

            var router = new (Marionette.AppRouter.extend({}))();

            var Controller = {
                init: function(layout, projectModel){
                    this.subscribe();

                    mainModel = new MainModel();
                    secondModel = new SecondModel();

                    var secondButtonsView = new SecondButtonsView({model: secondModel});
                    var mainButtonsView = new MainButtonsView({model: mainModel});

                    mainModel.on('change:selectedItem', function(){
                        App.channels.main.trigger(config.channel.changeMainControl, mainModel.get('selectedItem'));
                    })
                    mainModel.on('save', function(){
                        projectModel.saveProject({
                            success: function(){
                                router.navigate(projectModel.get('_id'));
                                App.reqres.request("notify:showNotify", {
                                    text: "Save",
                                    withCloseBtn: false
                                });
                            },
                            error: function(data){
                                App.reqres.request("notify:showNotify", {
                                    text: data.message,
                                    withCloseBtn: true,
                                    showTime: 2000,
                                    type: "error"
                                });
                            }
                        });

                    })
                    secondModel.on("change:featureType", function(){
                        App.channels.main.trigger(config.channel.changeFeatureType, secondModel.get('featureType'));
                    })

                    layout.secondButtonsContainer.show(secondButtonsView);
                    layout.mainButtons.show(mainButtonsView);

                },

                handlerFeatureType: function(type){
                    secondModel.set('featureType', type);
                },

                handlerMainControl: function(type){
                    mainModel.set('selectedItem', type);
                },

                subscribe: function(){
                    App.channels.main.on(config.channel.changeFeatureType, Controller.handlerFeatureType);
                    App.channels.main.on(config.channel.changeMainControl, Controller.handlerMainControl);

                }
            }

            Control.Controller = Controller;

        }
    })

})