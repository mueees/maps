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
            this.listenTo(this.model, "change:isEdit", this.handlerIsEdit);
        },

        deleteFeature: function(){
            this.model.trigger("wantToBeRemove", this.model);
        },

        handlerFeatureClick: function(){
            var isEdit = this.model.get('isEdit');
            if(isEdit) return false;
            this.model.editEnable();
        },

        handlerIsEdit: function(){
            if(this.model.get('isEdit')){
                this.$el.addClass('edit');
            }else{
                this.$el.removeClass('edit');
            }
        },

        onAfterRender: function(){
            this.$el.data('type', this.model.get('type'));
        }
    })
})