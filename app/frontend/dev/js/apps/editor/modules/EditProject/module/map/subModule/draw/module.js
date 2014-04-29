define([
    'apps/app',
    'marionette',
    'config',
    'leaflet',

    /*model*/
    './model/DrawModel',

    /*helpers*/
    'helpers/log/module',

    'leafletDraw'
], function(App, Marionette, config, L, DrawModel, log){

    App.module("EditProject.Map.Draw", {

        startWithParent: true,

        define: function(Draw, App, Backbone, Marionette, $, _){

            function DrawInstance(map, model, projectModel){
                this.projectModel = projectModel;
                this.map = map;
                this.model = model;
                this.handlers = {
                    marker: new L.Draw.Marker(this.map),
                    polyline: new L.Draw.Polyline(this.map)
                };

                _.bindAll(this, "handlerFeatureType",
                    "handlerDrawCreated");

                this.subscribe();
            }
            DrawInstance.prototype = {

                subscribe: function(){
                    this.model.on("change:featureType", this.handlerFeatureType);
                    this.map.on('draw:created', this.handlerDrawCreated);
                    this.map.on('draw:editstop', function(){
                        debugger
                    });
                },

                handlerFeatureType: function(){
                    this.activate( this.model.get('featureType') );
                },

                handlerDrawCreated: function(feature){
                    this.projectModel.addFeature(feature);
                    this.model.set('featureType', null);
                },

                activate: function(type){
                    this.handlers.marker.disable();
                    this.handlers.polyline.disable();
                    log(type);
                    switch (type){
                        case "marker":
                            this.handlers.marker.enable();
                            break;
                        case "polyline":
                            this.handlers.polyline.enable();
                            break;
                    }
                }
            }

            var model, draw;

            var Controller = {
                init: function(projectModel, map){
                    model = new DrawModel();
                    model.on("change:featureType", function(){
                        var type = model.get('featureType');
                        App.channels.main.trigger(config.channel.changeFeatureType, type);
                    });

                    draw = new DrawInstance(map, model, projectModel);
                    this.subscribe();
                },

                handlerFeatureType: function(type){
                    model.set('featureType', type);
                },

                subscribe: function(){
                    App.channels.main.on(config.channel.changeFeatureType, Controller.handlerFeatureType);
                }
            }

            Draw.Controller = Controller;
        }
    })

})