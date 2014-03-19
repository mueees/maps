requirejs.config({

    baseUrl: '/js',

    paths: {
        home: 'apps/home',
        index: 'index',
        config: 'apps/config/config',

        /*libs*/
        text: "libs/text",
        jquery: "libs/jquery",
        underscore: "libs/underscore",
        marionette: "libs/marionette",
        backbone: "libs/backbone/backbone",
        routefilter: "libs/backbone/backbone.routefilter",
        async: "libs/async",
        leaflet: "libs/leaflet",
        validate: 'libs/jquery/jquery.validate',
        bootstrap: "libs/bootstrap/bootstrap.min"
    },

    shim:{
        jquery: {
            exports: "jQuery"
        },
        marionette: {
            exports: 'Marionette',
            deps: ['jquery', 'backbone']
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        routefilter: {
            deps: ['backbone']
        },
        validate: {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        bootstrap: {
            deps: ['jquery']
        },
    },

    urlArgs: "bust=" + (new Date()).getTime()

});