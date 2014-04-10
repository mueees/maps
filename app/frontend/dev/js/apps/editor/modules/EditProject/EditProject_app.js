define([
    'jquery',
    'backbone',
    'marionette',
    'config',

    'apps/app',

    /*models*/
    './models/project',
    './models/point',

    /*Views*/
    './layout/LayoutView',

    'helpers/log/module',

    /*submodules*/
    './module/map/module',
    './module/control/module',

    'helpers/notify/module'
], function(jQuery, Backbone, Marionette, config, App, ProjectModel, MarkerModel, LayoutView, log){


    var Animal,
        AnimalCollection,
        Zoo;

    var Feature = Backbone.RelationalModel.extend({});
    var FeatureCollection = Backbone.Collection.extend({
        model: Feature
    });
    var Group = Backbone.RelationalModel.extend({
        idAttribute: '_id'
    });
    var GroupCollection = Backbone.Collection.extend({
        model: Group
    });

    var Project = Backbone.RelationalModel.extend({
        idAttribute: '_id',
        relations: [{
            type: Backbone.HasMany,
            key: 'groups',
            relatedModel: Group,
            collectionType: GroupCollection,
            reverseRelation: {
                key: 'project',
                includeInJSON: true
            }
        }]
    });

    var project = new Project({
        name: 'Test proejct',
        _id: '1',
        groups: [{
            _id: '2',
            name: "test group"
        }]
    });

    console.log(project.toJSON());

    Animal = Backbone.RelationalModel.extend({
        urlRoot: '/animal/'
    });

    AnimalCollection = Backbone.Collection.extend({
        model: Animal
    });

    //relation plugin
    Zoo = Backbone.RelationalModel.extend({
        relations: [{
            type: Backbone.HasMany,
            key: 'animals',
            relatedModel: Animal,
            collectionType: AnimalCollection,
            reverseRelation: {
                key: 'livesIn',
                includeInJSON: 'id'
                // 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
            }
        }]
    });

    var artis = new Zoo( { name: 'Artis' } );
    var lion = new Animal( { species: 'Lion', livesIn: artis } );
    //alert( artis.get( 'animals' ).pluck( 'species' ) );

    // deep model
    /*var p = new Backbone.DeepModel({groups: [
     {
     features: [
     {
     type: "marker",
     title: "test",
     description: "double test"
     }
     ]
     }
     ]});*/

    //clear module
    /*var p = new ProjectModel({
     groups: [
     {
     features: [
     {
     type: "marker",
     title: "test",
     description: "double test"
     }
     ]
     }
     ]
     }, {parse:true});
     log( p.toJSON() );*/

    App.module("EditProject", {

        startWithParent: false,

        define: function( EditProject, App, Backbone, Marionette, $, _ ){

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "EditProject", {} );
                },

                appRoutes: {
                    "": "editController",
                    ":projectId": "editController",
                    ":projectId/analyze/:featureId": "analyzeController"
                }

            })

            var Controller = {
                editController: function(projectId){

                    var projectModel = Controller.getProjectModel(projectId);

                    projectModel.on("add", function(ship) {
                        alert("Ahoy " + ship.get("name") + "!");
                    });

                    /*
                     projectModel.save(null, {
                     url: projectModel.url + "/add"
                     });
                     */

                    //вставить layout
                    var layoutView = new LayoutView();
                    App.app.show(layoutView);

                    EditProject.Map.Controller.init(layoutView, projectModel);
                    EditProject.Control.Controller.init(layoutView, projectModel);

                },
                analyzeController: function(){

                },

                getProjectModel: function(projectId){
                    if( projectId ){
                        if(Maps.config.project){
                            return new ProjectModel(Maps.config.project);
                        }else{
                            return new ProjectModel();
                        }
                    }else{
                        return new ProjectModel();
                    }
                }
            }

            var API  = {
                editController: function(projectId){Controller.editController(projectId)},
                analyzeController: function(){Controller.analyzeController()}
            }

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

        }
    })


})