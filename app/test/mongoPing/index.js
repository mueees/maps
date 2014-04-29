var request = require('request');
var async = require('async');
var url = "109.251.",
    options = {
        type: "GET"
    };

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

var series = [];

for( var i = 151; i < 255; i++){
    for( var j = 0; j < 254; j++ ){
        (function(i, j){
            var ip = url + i + "." + j + "";
            series.push(function(callback){
                send("27017", ip, callback);
            })
        })(i, j)
    }
}



async.parallelLimit(series, 10,
// optional callback
    function(err, results){
        console.log('end');
    });


function send(port, ip, callback){
    var s;
    s = null;
    s = require('net').Socket();

    //console.log( ip + ":" + port );

    s.on('connect', function(){
        console.log('connect!!!!!!!!!!');
        console.log("port: " + port);
        console.log("ip: " + ip);
        s.end();
        callback();
    })
    s.on('error', function(){
        //console.log('error')
        callback();
    })
    s.on('close', function(){
        //console.log('close');
    })
    s.on('timeout', function(){
        //console.log('timeout');
        s.destroy();
        s = null;
        callback();
    })
    s.setTimeout(1500);
    s.connect(port, ip);

}


/*request(combinateUrl, options, function(err, response, buffer) {
 if(err) {
 console.log( 'request error' );
 return false;
 }
 console.log(combinateUrl);
 console.log(response.body);
 });*/