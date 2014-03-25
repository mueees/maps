var config = require("config");
exports.home = function(req, res, next) {
    if(req.user){
        res.redirect(config.get('url:homePageForRegisterUser'));
    }else{
        res.render('index.hbs', {});
    }
}