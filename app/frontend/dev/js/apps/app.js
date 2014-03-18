define([
    'backbone',
    'marionette',
    'jquery'
], function(Backbone, Marionette, $){

    var App = new Marionette.Application();

    //add Chanels
    App.channels = {}
    App.channels.main = _.extend({}, Backbone.Events);

    App.addRegions({
        main: "#main",
        body: 'body'
    });

    App.on('initialize:after', function(){
        if( Backbone.history ){
            Backbone.history.start();
        }
    })

    App.startSubApp = function(appName, args){
        var currentApp = App.module(appName);
        if (App.currentApp === currentApp){ return; }

        $('body').removeClass().addClass(currentApp.moduleName);

        if (App.currentApp){
            App.currentApp.stop();
        }

        App.currentApp = currentApp;
        currentApp.start(args);
    };

    return App;

})