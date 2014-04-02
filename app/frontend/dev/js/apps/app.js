define([
    'backbone',
    'marionette',
    'jquery'
], function(Backbone, Marionette, $){

    var App = new Marionette.Application();

    //add Chanels
    App.channels = {};
    App.channels.main = _.extend(Backbone.Events);
    var trigger = Backbone.Events.trigger;
    App.channels.main.trigger = function(){
        console.log("main channel:");
        console.log(arguments);
        trigger.apply(this, arguments);
    }
    App.route = {};
    App.route.root = "/";

    App.addRegions({
        app: "#app",
        main: "#main",
        body: 'body',
        noticeContainer: "#notice-container",
        controlContainer: "#control-container"
    });

    App.on('initialize:after', function(){
        if( Backbone.history ){
            Backbone.history.start({
                pushState: true,
                root: App.route.root
            });
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