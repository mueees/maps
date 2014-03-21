var express = require('express'),
    app = express(),
    route = require('routes/route'),
    http = require('http'),
    HttpError = require('error').HttpError,
    EmailSender = require('libs/EmailSender'),
    logger = require("libs/log")(module),
    I18n = require('i18n-2'),

    hbs = require('hbs'),
    template = require("views/email/test.hbs"),
    config = require("config");

require("mongooseDb");
// Passport configuration
require('auth');
app.use(express.favicon());


app.configure(function() {
    app.use(express.static(__dirname + '/frontend/public/'));
    if( process.env.NODE_SITE === "development" ) app.use(express.static(__dirname + '/frontend/dev/'));
    app.use(express.cookieParser());
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: './tmp' }));
    app.set('views', __dirname + "/views");
    app.set('view engine', 'hbs');

    I18n.expressBind(app, {
        // setup some locales - other locales default to en silently
        locales: ['en', 'ru'],
        // change the cookie name from 'lang' to 'locale'
        /*cookieName: 'locale',*/
        extension: '.json'
    });
});

//setup locale
app.use(function(req, res, next) {
    //req.i18n.setLocaleFromCookie();
    req.i18n.setLocale('ru');
    next();
});

//test
var htmlTemplate = hbs.compile(template);
console.log(htmlTemplate())


app.use( require("middleware/sendHttpError") );

//routing
route(app);

//404
app.use(function(req, res, next){
    logger.log('warn', { status: 404, url: req.url });
    res.render('error', { status: 404, url: req.url });
    res.status(404);
});

app.use(function(err, req, res, next){

    logger.log('error', { error: err });

    if( typeof err == "number"){
        err = new HttpError(err);
    }

    if( err instanceof HttpError ){
        res.sendHttpError(err);
        //emailSender = new EmailSender({text: err.status + err.message.error});
    }else{

        if( app.get("env") == "development" ){
            express.errorHandler()(err, req, res, next);
        }else{
            express.errorHandler()(err, req, res, next);
            res.send(500);
        }
    }

})

//create server
var server = http.createServer(app);
server.listen(config.get("port"));
logger.info("Web server listening: " + config.get("port"));