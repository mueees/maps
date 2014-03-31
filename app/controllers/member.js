var config = require('config')
    , logger = require('libs/log')(module)
    , HttpError = require('error').HttpError
    , _ = require('underscore')
    , validator = require('validator')
    , async = require('async')
    , EmailAction = require("actions/email/email")
    , MemberModel = require('member/model/member');

var controller = {
    signup: function(req, res, next){
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
                    cb(res.__("User with same email already registered"));
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
                message: res.__("Register success. To complete your registration please verify your email")
            })

            //send mail
            //send email with confirmation code

            /*
            * todo: change to queue 20.3.2014
            * https://github.com/LearnBoost/kue
            * */
            var emailAction = new EmailAction({
                to: member.email,
                template: './views/email/registerConfirmation.hbs',
                subject: "Confirmation account",
                locale: res.getLocale(),
                data: {
                    confirmationId: member.confirmationId
                }
            });
            emailAction.execute();
        })

    }
    , signin: function(req, res, next){
        res.send({
            redirect: config.get('url:afterSignIn')
        })
    }
    , logout: function(req, res, next){}
    , confirmation: function(req, res, next){
        if(!req.params.id) {
            return res.redirect('/');
        }

        async.waterfall([
            function(cb){
                MemberModel.isHaveConfirmationId(req.params.id, cb);
            },
            function(member, cb){
                if( !member ){
                    return cb("Cannot find confirmation id");
                }
                return cb(null, member);
            }
        ], function(err, member){
            if(err) {
                logger.error(err);
                return res.redirect('/');
            }

            logger.info("Member confirmed account");
            req.login(member._id, function(err) {
                if (err) { return next(err); }
                return res.redirect(config.get('url:afterConfirmationAccount'));
            });

            if( member.status == 400 ){
                member.confirm();
                /*
                 * todo: change to queue 20.3.2014
                 * https://github.com/LearnBoost/kue
                 * */
                var emailAction = new EmailAction({
                    to: member.email,
                    template: './views/email/successConfirmation.hbs',
                    subject: "Confirmation success",
                    locale: res.getLocale(),
                    data: {}
                });
                emailAction.execute();
            }

        })

    }
}
module.exports = controller;