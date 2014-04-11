define([
    'apps/app',
    'marionette',
    'config',

    /*views*/
    './views/MainButtonsView',
    './views/SecondButtonsView',

    /*models*/
    './models/SecondModel'

], function(App, Marionette, config, MainButtonsView, SecondButtonsView, SecondModel){

    App.module("EditProject.Control", {

        startWithParent: true,

        define: function(Control, App, Backbone, Marionette, $, _){

            var secondModel;
            var Controller = {
                init: function(layout, projectModel){
                    this.subscribe();

                    secondModel = new SecondModel();
                    var secondButtonsView = new SecondButtonsView({model: secondModel});
                    var mainButtonsView = new MainButtonsView({model: projectModel});

                    secondModel.on("change:featureType", function(){
                        App.channels.main.trigger(config.channel.changeFeatureType, secondModel.get('featureType'));
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