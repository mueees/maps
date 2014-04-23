define([
    'backbone',
    './../models/group'
], function(Backbone, GroupModel){
    return Backbone.Collection.extend({
        model: GroupModel,
        initialize: function(){
            var _this = this;
            this.on("change:custom:event:", function(data){
                if(!data.name) return false;
                _this.trigger('custom:event:', data);
            });
        }
    });
})