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

        "backbone": "libs/backbone/backbone.bootstrap",
        "backbone.original": "libs/backbone/backbone",
        "backbone.deepModel": "libs/backbone/backbone.deepModel",
        "backbone.relational": "libs/backbone/backbone.relational",
        routefilter: "libs/backbone/backbone.routefilter",

        async: "libs/async",

        leaflet: "libs/leaflet/leaflet/leaflet-src",
        leafletDraw: "libs/leaflet/plugins/draw/leaflet.draw-src",

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
        "backbone.deepModel": {
            deps: ["backbone.original"],
            exports: "Backbone"
        },
        "backbone.relational": {
            deps: ["backbone.original"],
            exports: "Backbone"
        },
        "backbone.original": {
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

        /*libs*/
        leafletDraw: {
            exports: 'Marionette',
            deps: ['leaflet']
        }
    },

    urlArgs: "bust=" + (new Date()).getTime()

});