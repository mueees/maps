define([
    'config',
], function(config){
    return function(text){
        if( config.log.isShow ) {
            console.log(text);
        }
    }
});