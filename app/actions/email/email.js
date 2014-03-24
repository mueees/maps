var BaseModel = require('../base/action'),
    util = require('util'),
    EmailSender = require("EmailSender"),
    config = require("config"),
    hbs = require("hbs"),
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

    this.makeLocale();
    this.makeHtml();
    this.settings = _.extend( defaultOption , options);
}

util.inherits(EmailAction, BaseModel);

_.extend(EmailAction.prototype, {

    makeLocale: function(){
        this.settings.i18n = new (require('i18n-2'))({
            locales: this.settings.locale
        });
    },

    makeHtml: function(){
        var htmlTemplate = hbs.compile(template);
        this.settings.html = htmlTemplate(this.settings.data);
    },

    execute: function(cb){
        var emailSender = new EmailSender( this.settings );
        emailSender.send(cb);
    }
});

module.exports = EmailAction;