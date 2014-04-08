define([
    'backbone',
    './../models/group'
], function(Backbone, GroupModel){
    return Backbone.Collection.extend({
        model: GroupModel
    });
})