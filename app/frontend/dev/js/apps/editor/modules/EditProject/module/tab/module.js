define([
    'apps/app',
    'marionette',
    'config'
], function(App, Marionette, config){

    App.module("EditProject.Tab", {

        startWithParent: true,

        define: function(Tab, App, Backbone, Marionette, $, _){

            var Controller = {
                init: function(layout, projectModel){
                    this.subscribe();
                },
                subscribe:function(){

                }
            }

            Tab.Controller = Controller;

        }
    })

})