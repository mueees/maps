requirejs.config({

    baseUrl: '/js',

    paths: {
        home: 'apps/home',
        index: 'index',

        /*libs*/
        text: "libs/text",
        jquery: "libs/jquery",
        underscore: "libs/underscore",
        marionette: "libs/marionette",
        backbone: "libs/backbone/backbone",
        routefilter: "libs/backbone/backbone.routefilter",
        async: "libs/async",
        leaflet: "libs/leaflet"
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
        }
    },

    urlArgs: "bust=" + (new Date()).getTime()

});