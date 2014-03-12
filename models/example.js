var _ = require('underscore'),
    util = require('util'),
    async = require('async'),
    mongoose = require('mongoose'),
    request = require('request'),
    logger = require("libs/log")(module);

var Schema = mongoose.Schema;
var feedSchema = new Schema({
    name: String,
    url: String,
    hasReadLater: {
        type: Boolean,
        default: false
    },
    unread: {
        type: Number,
        default: 0
    }
});

feedSchema.statics.test = function(){
    console.log("test");
}
feedSchema.methods.test = function(){
    console.log("test");
}

var Feed = mongoose.model('rss_feed', feedSchema);

module.exports = Feed;