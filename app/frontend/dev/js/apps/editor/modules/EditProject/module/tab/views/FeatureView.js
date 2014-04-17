define([
    'marionette',
    'text!../templates/FeatureViewTemp.html'
], function(Marionette, FeatureViewTemp){
    return Marionette.ItemView.extend({
        template: _.template(FeatureViewTemp),

        className: "feature",

        events: {

            "click": "handlerFeatureClick",
            "click .delete": "deleteFeature"
        },

        initialize: function(){
        },

        deleteFeature: function(){
            this.model.trigger("wantToBeRemove", this.model);
        },

        handlerFeatureClick: function(){
            this.model.trigger("wantToBeFeatureEdit", this.model);
        },

        onAfterRender: function(){
            this.$el.data('type', this.model.get('type'));
        }
    })
})