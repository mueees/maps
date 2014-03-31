var winston = require('winston');
var path = require('path');
var ENV = process.env.NODE_ENV;

function getLogger( module ){
    var pathModule = module.filename.split("/").slice(-2).join('/');

    return new winston.Logger({

        transports: [
            new winston.transports.Console({
                colorize: true,
                level:  "info",
                label: pathModule
            }),
            new winston.transports.File({ filename: __dirname + '/logRequest.log', level: 'debug'  })
        ]
    });
}

module.exports = getLogger;