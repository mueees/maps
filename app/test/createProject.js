var ProjectModel = require('models/project/project')
    , mongoose = require("mongoose")
    , async = require('async')
    , HttpError = require('error').HttpError
    , logger = require('libs/log')(module);

require("mongooseDb");

ProjectModel.remove({});

var data = {
    type: [123]
}
data.userId = null;
var project = new ProjectModel(data);

project.save(function(err){
    if(err) {
        logger.info(err);
        return false;
    }
    logger.info("All RIGHT");
})