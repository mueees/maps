var config = require('config')
    , logger = require('libs/log')(module)
    , HttpError = require('error').HttpError
    , _ = require('underscore');

var controller = {
    register: function(req, res, next){}
    , login: function(req, res, next){
        res.end();
    }
    , logout: function(req, res, next){}
}

module.exports = controller;