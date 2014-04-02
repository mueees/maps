define(['backbone'], function(Backbone){
    return Backbone.Model.extend({
        defaults: {
            projectModel: null,
            featureType: null
        }
    })
})