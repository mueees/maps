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

            var Controller = {
                init: function(layout, projectModel){
                    var secondModel = new SecondModel();
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
                }
            }

            Control.Controller = Controller;

        }
    })

})