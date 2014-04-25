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

        async.waterfall([
            function(cb){
                project.validate(function(err){
                    if(err) {
                        logger.error(err);
                        return cb("Project data doesn't not valid");
                    }else{
                        cb(null);
                    }
                })
            },
            function(cb){
                project.generateShareLink();
                project.save(function(err){
                    if(err) {
                        logger.error(err);
                        return cb("An error occurred. Please try again later");
                    }
                    cb(null);
                })
            }
        ], function(err){
            if(err){
                return next(new HttpError(400, err));
            }

            res.send(project);
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
                logger.error(err);
                return next(new HttpError(400, "Server error"));
            }
            res.send(projects);

        });
    },

    getProject: function(req, res, next){
        ProjectModel.find({_id: req.params.id}, function(err, project){
            if(err){
                logger.error(err);
                return next(new HttpError(400, "Server error"));
            }

            if( !project ){
                return next(new HttpError(400, "Cannot find project"));
            }

            res.send(project);
        })
    },

    editProjectUnregisterUser: function(globalCb, project){
        async.waterfall([
            function(cb){
                project.validate(function(err){
                    if(err) {
                        logger.error(err);
                        return cb("Project data doesn't not valid");
                    }else{
                        cb(null);
                    }
                })
            },
            function(cb){
                //есть ли такой проект и действительно ли он создан незарегестрированным юзером
                ProjectModel.isHasProjectCreatedByGuest(project._id, cb);
            },
            function(isHasProject, cb){
                if( !isHasProject ){
                    return cb("Cannot find project");
                }else{
                    return cb(null);
                }
            },
            function(cb){
                //сохраним проект
                /*ненавижу mongoose за это*/
                var data = project.toObject();
                delete data._id;
                ProjectModel.findOneAndUpdate({_id: project._id}, data, null, function(err){
                    if(err) {
                        logger.error(err);
                        console.log(err);
                        return cb("An error occurred. Please try again later");
                    }
                    cb(null);
                })
            }
        ], function(err){
            if(err){
                return globalCb(err);
            }
            globalCb(null);
        })
    },

    editProject: function(req, res, next){
        var data = req.body;

        data.userId = (req.user) ? req.user._id : null;
        var project = new ProjectModel(data);

        if( !project._id ){
            //это не ранее не сохраненный проект, редактировать в этом случае нечего
            return next(new HttpError(400, "This is unsaved project"));
        }

        if( !project.userId ){
            //клиент хочет редактировать проект
            //как-будто проект был ранее сохранен незарегестррованным пользователем,
            controller.editProjectUnregisterUser(function(err){
                if(err){
                    return next(new HttpError(400, err));
                }
                res.send({
                    _id: project._id
                });
            }, project);
        }

    }

}
module.exports = controller;