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

    /*DEPRECATED*/

    /*protectedPassword: {
        type: String,
        default: "",
        required: false
    },*/

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
    groups: {
        type: Array,
        default: [],
        required: false
    },

    description: {
        type: String,
        default: "",
        required: true
    },

    shareLink: {
        type: String,
        default: ""
    }

});

projectSchema.statics.isHasProjectCreatedByGuest = function(idProject, cb){
    var query = {
        _id: idProject,
        userId: null
    }
    this.find(query, null, function(err, projects){
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
projectSchema.statics.isHasProject = function(idProject, cb){
    this.find({_id: idProject}, null, function(err, projects){
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
        _id: idProject
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

projectSchema.methods.generateShareLink = function(){
    this.shareLink = this._id.toString().slice(0, 6);
}

var ProjectModel = mongoose.model('Project', projectSchema);
module.exports = ProjectModel;
