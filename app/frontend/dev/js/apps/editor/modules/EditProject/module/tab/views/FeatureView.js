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

        ui: {
            title: ".name"
        },

        initialize: function(){
            this.listenTo(this.model, "change:isEdit", this.handlerIsEdit);
            this.listenTo(this.model, "change:title", this.handlerChangeTitle);
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

        handlerChangeTitle: function(){
            this.ui.title.html(this.model.get('title'));
        },

        onAfterRender: function(){
            this.$el.data('type', this.model.get('type'));
        }
    })
})