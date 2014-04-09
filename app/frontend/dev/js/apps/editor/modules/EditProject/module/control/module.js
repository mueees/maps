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
                    secondModel = new SecondModel();

                    var secondButtonsView = new SecondButtonsView({model: secondModel});

                    secondModel.on("change:featureType", function(){
                        var type = secondModel.get('featureType');
                        App.channels.main.trigger(config.channel.changeFeatureType, type);
                    })

                    layout.secondContainer.show(secondButtonsView);

                    var mainButtonsView = new MainButtonsView({
                        model: projectModel
                    });

                    layout.firstContainer.show(mainButtonsView);

                    this.subscribe();
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