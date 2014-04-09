define([
    'backbone.original'
], function(Backbone){

    require(['backbone.deepModel'], function(){});
    Backbone.Model.prototype.toJSON = function() {
        return JSON.parse(JSON.stringify(this.attributes));
    }
    return Backbone;

});