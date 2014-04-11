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

    /*var Feature = Backbone.RelationalModel.extend({
        defaults: {
            name: "feature name",
            type: "point"
        }
    });
    var FeatureCollection = Backbone.Collection.extend({
        model: Feature
    });
    var Group = Backbone.RelationalModel.extend({
        relations: [{
            type: Backbone.HasMany,
            key: 'features',
            relatedModel: Feature,
            collectionType: FeatureCollection,
            includeInJSON: true,
            reverseRelation: {
                key: 'group'
            }
        }],
        defaults: {
            features: []
        }
    });
    var GroupCollection = Backbone.Collection.extend({
        model: Group
    });
    var Project = Backbone.RelationalModel.extend({
        relations: [{
            type: Backbone.HasMany,
            key: 'groups',
            relatedModel: Group,
            collectionType: GroupCollection,
            includeInJSON: true,
            reverseRelation: {
                key: 'project'
            }
        }]
    });

    var project = new Project({name: 'Test project'});
    project.on("add:groups", function(model, coll){
        debugger
    });
    project.get('groups').on('add:features', function(model, coll){
        debugger
    })
    project.get('groups').add([{
        _id: '2',
        name: "test group",
        features: [{
            _id: '3',
            name: "feat name",
            type: 'polyline'
        }]
    }])
    project.get('groups').at(0).get('features').add({
        _id: '4',
        name: "feat name",
        type: 'polyline'
    })*/

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
                    EditProject.Tab.Controller.init(layoutView, projectModel);

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