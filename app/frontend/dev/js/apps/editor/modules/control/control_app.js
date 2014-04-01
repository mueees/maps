define([
    'jquery',
    'backbone',
    'marionette',
    'config',

    'apps/app',

    /*models*/
    './models/project',
    './layout/LayoutView',

    'helpers/notify/module'
], function(jQuery, Backbone, Marionette, config, App, ProjectModel, LayoutView){

    App.module("Control", {

        startWithParent: false,

        define: function( Control, App, Backbone, Marionette, $, _ ){

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Control", {} );
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


                    /*
                    1. проверить если id проекта
                    2. если id есть, и проект выгружен в конфиг, создать модель проекта
                    3. если id нет или есть, но проект не выгружен в конфиг, создать новую модель проекта
                    4. инициализировать карту, отдать ей модель проекта
                    5. инициализировать view основного меню
                    6.
                     */
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