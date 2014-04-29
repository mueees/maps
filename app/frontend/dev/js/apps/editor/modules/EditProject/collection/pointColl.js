define([
    'backbone',
    './../models/point'
], function(Backbone, PointModel){

    var PointColl = Backbone.Collection.extend({
        model: PointModel
    });

    return PointColl;
})