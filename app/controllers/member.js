var config = require('config')
    , logger = require('libs/log')(module)
    , HttpError = require('error').HttpError
    , _ = require('underscore')
    , validator = require('validator')
    , async = require('async')
    , EmailAction = require("actions/email/email")
    , EmailSender = require("EmailSender")
    , MemberModel = require('member/model/member');

var controller = {
    signup: function(req, res, next){
        /*
         проверить нет ли уже такого юзера
         если есть проверить его статус, если такой юзер уже есть,
         сказать что юзер с таким мылом уже зарегестрирован

         если нет, то зарегестрировать его, сгенерировать активационную ссылку ссылку
         и скинуть ее на указанный email

         */
        var data = req.body;

        if( !validator.isEmail(data.email) ) {
            return next(new HttpError(400, "Invalid Email"));
        }

        if( !validator.isLength(data.password, 3) ){
            return next(new HttpError(400, "Password least than 3."));
        }

        async.waterfall([
            function(cb){
                MemberModel.isHaveMember(data.email, cb);
            },
            function(isHaveUser, cb){
                if( isHaveUser ){
                    cb(req.i18n.__("User with same email already registered"));
                    return false;
                }else{
                    cb(null);
                    return false;
                }
            },
            function(cb){
                MemberModel.registerNewMember(data.email, data.password, cb);
            }
        ], function(err, member){
            if( err ){
                return next(new HttpError(400, err));
            }
            res.send(200, {
                message: req.i18n.__("Register success. To complete your registration please verify your email")
            })

            //send mail
            //send email with confirmation code

            /*
            * todo: change to queue 20.3.2014
            * https://github.com/LearnBoost/kue
            * */
            var emailAction = new EmailAction({
                to: member.email,
                template: null,
                subject: "Confirmation account",
                locale: 'ru',
                data: {
                    confirmationId: member.confirmationId
                }
            });

            emailAction.execute();

             var emailSender = new EmailSender({
                to: member.email,
                subject: "Confirmation account"
            });
            emailSender.send(function(err){
                if( err ){
                    logger.error(err);
                    return false;
                }
            });

        })

    }
    , signin: function(req, res, next){
        res.end();
    }
    , logout: function(req, res, next){}
}

module.exports = controller;