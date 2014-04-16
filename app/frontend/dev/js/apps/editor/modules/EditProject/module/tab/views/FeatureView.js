define([
    'marionette',
    'text!../templates/FeatureViewTemp.html'
], function(Marionette, FeatureViewTemp){
    return Marionette.ItemView.extend({
        template: _.template(FeatureViewTemp),

        className: "feature",

        initialize: function(){

        },

        onAfterRender: function(){
            this.$el.data('type', this.model.get('type'));
        }
    })
})