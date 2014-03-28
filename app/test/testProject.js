var request = require('request');

var url = "http://127.0.0.1:5001/api/projects",
    options = {
        type: "GET"
    };

request(url, options, function(err, response, buffer) {
    if(err) {
        console.log( 'request error' );
        return false;
    }

    console.log(response.body);
});