var _ = require('underscore'),
    util = require('util'),
    async = require('async'),
    mongoose = require('mongoose'),
    logger = require("libs/log")(module);

var Schema = mongoose.Schema;
var projectSchema = new Schema({
    dateCreate: {
        type: Date,
        default: new Date(),
        required: true
    },
    lastModify: {
        type: Date,
        default: new Date(),
        required: true
    },
    name: {
        type: String,
        default: "Default name",
        required: true
    },
    userId: {
        type: String,
        required: false
    },
    isPublic: {
        type: Boolean,
        default: true,
        required: true
    },
    protectedPassword: {
        type: String,
        default: "",
        required: false
    },
    type: {
        type: String,
        default: "guest",
        required: true
    },
    share: {
        type: Array,
        default: [],
        required: false
    },
    layers: {
        type: Array,
        default: [],
        required: false
    }
});
projectSchema.statics.isHasProject = function(idProject, cb){
    this.find({idProject: idProject}, null, function(err, projects){
        if( err ){
            logger.error(err);
            cb("Server error");
            return false;
        }

        if( projects.length === 0 ){
            cb(null, false);
        }else{
            cb(null, projects[0]);
        }
    });
}
projectSchema.statics.isUserHasProject = function(userId, idProject, cb){
    this.find({
        userId: userId,
        idProject: idProject
    }, null, function(err, projects){
        if( err ){
            logger.error(err);
            cb("Server error");
            return false;
        }

        if( projects.length === 0 ){
            cb(null, false);
        }else{
            cb(null, projects[0]);
        }
    });
}

var ProjectModel = mongoose.model('Project', projectSchema);
module.exports = ProjectModel;
