var config = require("config"),
    async = require('async'),
    ProjectModel = require('models/project/project');

exports.home = function(req, res, next) {
    if(req.user){
        res.redirect(config.get('url:homePageForRegisterUser'));
    }else{
        res.render('index', {
            title: "Free maps"
        });
    }
}
exports.editor = function(req, res, next) {

    var jsData = {};
    var id = req.params.idProject || null;
    jsData.user = null;

    if(req.user){
        jsData.user = {
            "_id": req.user._id,
            "email": req.user.email
        }
    }

    if( req.user && id ){
        async.waterfall([
            function(cb){
                ProjectModel.isUserHasProject(req.user._id, id, cb);
            },
            function(project, cb){
                if(!project){
                    jsData.project = null;
                    cb(null);
                }else{
                    project.getFullFeatures(function(err, expandProject){
                        if(err){
                            jsData.project = null;
                        }
                        jsData.project = expandProject;
                        cb(null);
                    });
                }
            }
        ], function(){
            res.render('editor', {
                title: "Free maps: editor",
                script: JSON.stringify(jsData)
            });
        })
    }else if(!req.user && id){
        async.waterfall([
            function(cb){
                ProjectModel.isHasProject(id, cb);
            },
            function(project, cb){
                if( project && project.type == "guest" ){
                    jsData.project = project;
                }
                cb(null);
            }
        ], function(){
            res.render('editor', {
                title: "Free maps: editor",
                script: JSON.stringify(jsData)
            });
        })
    }else{
        res.render('editor', {
            title: "Free maps: editor",
            script: JSON.stringify(jsData)
        });
    }

}

