define([
    'jquery',
    'backbone',
    'marionette',
    'config',

    'apps/app',

    /*models*/
    './models/project',
    './layout/LayoutView',

    /*submodules*/
    './module/map/module',
    './module/control/module',

    'helpers/notify/module'
], function(jQuery, Backbone, Marionette, config, App, ProjectModel, LayoutView){

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

                    /*projectModel.save(null, {
                        url: projectModel.url + "/add"
                    });*/

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

            //Controller.start();

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

        }
    })


})