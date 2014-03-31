var BaseModel = require('../base/action'),
    util = require('util'),
    logger = require('libs/log')(module),
    EmailSender = require("EmailSender"),
    config = require("config"),
    async = require('async'),
    exphbs  = require('express3-handlebars'),
    helpers = require('libs/exphbs/helpers'),

    simpleTextTemp = require('views/email/simpleText.hbs'),
    _ = require('underscore');

function EmailAction(options){

    if( !options.data )  {
        throw new Error("Body should be!");
    }

    var defaultOption = {
        to: config.get("email:list").join(','),
        template: simpleTextTemp,
        subject: config.get("email:default:subject"),
        from: config.get("email:default:from"),
        data: null,
        locale: config.get("email:default:locale")
    }

    this.settings = _.extend( defaultOption , options);
    this.makeLocale();
}

util.inherits(EmailAction, BaseModel);

_.extend(EmailAction.prototype, {

    makeLocale: function(){
        var _this  = this;
        var i18n = require("i18n");
        i18n.setLocale(_this.settings.locale);
        _this.settings.i18n = i18n;
    },

    makeHtml: function(cb){
        var _this = this;
        var hbs = exphbs.create({
            helpers: helpers(_this.settings.i18n)
        });

        hbs.render(_this.settings.template, _this.settings.data, function(err, html){
            if( err ){
                _this.settings.html = "";
                cb(err);
                return false;
            }
            _this.settings.html = html;
            cb(null);
        })
    },

    send: function(cb){
        var _this = this;
        var emailSender = new EmailSender( _this.settings );
        emailSender.send(function(err){
            if(err){ return cb(err);}
            cb(null);
        });
    },

    execute: function(callback){
        async.waterfall([
            this.makeHtml.bind(this),
            this.send.bind(this)
        ], function(err){
            if(err){
                logger.error(err);
                if(callback) callback(err);
                return false;
            }
            if(callback) callback(null);
        })
    }
});

module.exports = EmailAction;