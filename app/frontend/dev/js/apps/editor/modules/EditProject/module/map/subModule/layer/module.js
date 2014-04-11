define([
    'apps/app',
    'marionette',
    'backbone',
    'config',
    'leaflet',

    /*helpers*/
    'helpers/log/module'
], function(App, Marionette, Backbone, config, L,  log){

    App.module("EditProject.Map.Layer", {

        startWithParent: true,

        define: function(Layer, App, Backbone, Marionette, $, _){

            function Groups( groups, map ){
                this._groups = groups;
                this.groups = [];
                this.map = map;

                _.bindAll(this, "handleAddFeature", "addGroup");
                this.initialize();

            }
            Groups.prototype = {
                initialize: function(){
                    this.parse();
                    this.subscribe();
                },
                parse: function(){
                    var _this = this;
                    this._groups.each(function(group){
                        _this.addGroup(group);
                    })
                },
                addGroup:function(group){
                    var g = new Group(group);
                    this.groups.push(g);
                    g.addTo(this.map);
                },
                subscribe:function(){
                    this._groups.on('add:features', this.handleAddFeature);
                },
                handleAddFeature: function(feature, features){
                    var group = this.getGroup(feature.get('group').cid);
                    if(!group) return false;
                    group.addFeature(feature);
                },
                getGroup:function(groupCid){
                    var result;
                    _.each(this.groups, function(group, i){
                        if( group.cid === groupCid ){
                            result = group;
                            return;
                        }
                    })
                    return result;
                },
                render: function(){}

            }

            function Group(group){
                this._group = group;
                this.features = [];
                this.group = L.layerGroup();
                this.cid = group.cid;

                _.bindAll(this, "addFeature", "handlerRemove");

                this.initialize();
            }
            Group.prototype = {
                initialize: function(){
                    this.parse();
                    this.subscribe();
                },
                parse: function(){
                    var _this = this;
                    this._group.get('features').each(function(feature){
                        _this.addFeature(feature);
                    })
                },
                subscribe:function(){
                    this._group.get('features').on('remove', this.handlerRemove);
                },
                addFeature: function(feature){
                    var f = FeatureFactory.make(feature);
                    this.features.push(f);
                    this.group.addLayer(f.view);
                },
                handlerRemove:function(model, options){
                    this.removeFeature(model.cid);
                },
                removeFeature:function(featureCid){
                    var i,
                        index,
                        featureL;
                    for( i = 0; i < this.features.length; i++ ){
                        if( this.features[i].cid === featureCid ){
                            index = i;
                            featureL = this.features[i];
                            break;
                        }
                    }
                    this.features.splice(i,1);
                    this.group.removeLayer(featureL.view);
                },
                addTo: function(map){
                    this.group.addTo(map);
                }
            }

            function FeatureFactory(){}
            FeatureFactory.make = function(feature){
                var result;
                switch (feature.get("type")) {
                    case "Point":
                        result = new Point(feature);
                        break;
                    default :
                        result = false;
                }
                return result;
            }

            function Feature(feature){
                this._feature = feature;
                this.cid = this._feature.cid;
                this.initialize();
                this.subscribe();
            }
            Feature.prototype={
                bindPopUp:function(){
                    this.view.bindPopup(this._feature.get('title') + this._feature.get('description')).openPopup();
                }
            }
            Feature.extend = Backbone.View.extend;

            var Point = Feature.extend({
                initialize: function(){
                    _.bindAll(this, "handlerChangeCoord");
                    this.view = L.marker([this._feature.get('lat'), this._feature.get('lon')]);
                    this.bindPopUp();
                },
                addTo: function(map){
                    this.view.addTo(map);
                },
                subscribe:function(){
                    this._feature.on('change:lon', this.handlerChangeCoord);
                    this._feature.on('change:lat', this.handlerChangeCoord);
                    this._feature.on('remove', this.handlerRemove);
                },
                handlerChangeCoord:function(){
                    var lat = this._feature.get('lat');
                    var lon = this._feature.get('lon');
                    this.view.setLatLng([lat, lon]);
                }
            })

            var Controller = {
                init: function(projectModel, map){
                    var groups = new Groups(projectModel.get('groups'), map);
                },

                subscribe: function(projectModel){

                }

            }

            Layer.Controller = Controller;
        }
    })

})