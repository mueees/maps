define([
    'apps/app',
    'marionette',
    'config',

    /*views*/
    './views/MainButtonsView',
    './views/SecondButtonsView',

    /*models*/
    './models/SecondModel',
    './models/MainModel'

], function(App, Marionette, config, MainButtonsView, SecondButtonsView, SecondModel, MainModel){

    App.module("EditProject.Control", {

        startWithParent: true,

        define: function(Control, App, Backbone, Marionette, $, _){

            var secondModel,
                mainModel;

            var Controller = {
                init: function(layout, projectModel){
                    this.subscribe();

                    secondModel = new SecondModel();
                    mainModel = new MainModel();
                    var secondButtonsView = new SecondButtonsView({model: secondModel});
                    var mainButtonsView = new MainButtonsView({model: mainModel});

                    secondModel.on("change:featureType", function(){
                        App.channels.main.trigger(config.channel.changeFeatureType, secondModel.get('featureType'));
                    })
                    mainModel.on("change:tab", function(){
                        App.channels.main.trigger(config.channel.changeMainMenu, mainModel.get('tab'));
                    })
                    mainModel.on("save", function(){
                        //todo: write save handler
                    })


                    layout.secondContainer.show(secondButtonsView);
                    layout.mainButtons.show(mainButtonsView);

                },

                handlerFeatureType: function(type){
                    secondModel.set('featureType', type);
                },

                subscribe: function(){
                    App.channels.main.on(config.channel.changeFeatureType, Controller.handlerFeatureType);
                }
            }

            Control.Controller = Controller;

        }
    })

})