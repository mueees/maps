var config = require('config')
    , logger = require('libs/log')(module)
    , HttpError = require('error').HttpError
    , _ = require('underscore')
    , async = require('async')
    , validator = require('validator')
    , ProjectModel = require('models/project/project');

var controller = {
    add: function(req, res, next){
        var data = req.body;
        data.userId = (req.user) ? req.user._id : null;
        var project = new ProjectModel(data);
        if( !project.validate() ){
            return next(new HttpError(400, "Project data doesn't not valid"));
        }

        project.save(function(err){
            if(err) return next(new HttpError(400, "An error occurred. Please try again later"));
            res.send({
                message: "Project saved"
            });
        })
    },

    remove: function(req, res, next){

        var userId = (req.user) ? req.user._id : null;
        if( !userId ){
            return next(new HttpError(400, "You cannot delete project. You are not signin."));
        }

        async.waterfall([
            function(cb){
                ProjectModel.isUserHasProject(userId, req.params.id, cb);
            },
            function(project, cb){
                if(!project){
                    cb(res.__("User doesn't have project with this Id"))
                }
                cb(null, project);
            },
            function(project, cb){
                project.remove(function(err){
                    if(err){
                        return cb(res.__("An error occurred. Please try again later"));
                    }
                    cb(null);
                });
            }
        ],function(err){
            if( err ){
                return next(new HttpError(400, err));
            }
            res.send(200, {
                message: res.__("Project was deleted")
            });
        })
    },

    getProjects: function(req, res, next){
        ProjectModel.find({
            userId: req.user._id
        }, function(err, projects){
            if(err){
                logger(err);
                return next(new HttpError(400, "Server error"));
            }
            res.send(projects);

        });
    },

    getProject: function(req, res, next){
        ProjectModel.find({_id: req.params.id}, function(err, project){
            if(err){
                logger(err);
                return next(new HttpError(400, "Server error"));
            }

            if( !project ){
                return next(new HttpError(400, "Cannot find project"));
            }

            res.send(project);
        })
    },

    editProject: function(req, res, next){
        // req.params.id
    }

}
module.exports = controller;