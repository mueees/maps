define([
    'marionette',
    'text!../templates/GroupViewTemp.html',
    './FeatureView'
], function(Marionette, GroupViewTemp, FeatureView){

    return Marionette.CompositeView.extend({
        template: _.template(GroupViewTemp),

        className: "layout",

        itemView: FeatureView,

        events: {
            "click .layout-header": "switchOpen",
            "click .visible": "switchVisible",
            "click .delete": "deleteGroup"
        },

        ui: {
            'visible': ".visible"
        },

        initialize: function(){
            this.collection = this.model.get('features');

            this.listenTo(this.model, "change:isOpen", this.handlerChangeIsOpen)
            this.listenTo(this.model, "change:isActive", this.handlerChangeIsActive)
        },

        appendHtml: function(collectionView, itemView){
            collectionView.$('.features').append(itemView.el);
        },

        onRender: function(){
            this.model.trigger('change:isOpen');
            this.model.trigger('change:isActive');
        },

        switchOpen: function(){
            var isOpen = !this.model.get('isOpen');
            this.model.set('isOpen', isOpen);

            //set group as Active
            if(!this.model.get('isActive')){
                this.model.trigger("wantToBeActive", this.model);
            }
        },

        deleteGroup: function(){
            this.model.trigger("wantToBeRemove", this.model);
        },

        handlerChangeIsOpen: function(){
            if(this.model.get('isOpen')){
                this.$el.addClass('open');
            }else{
                this.$el.removeClass('open');
            }
        },

        handlerChangeIsActive: function(){
            if(this.model.get('isActive')){
                this.$el.addClass('active');
            }else{
                this.$el.removeClass('active');
            }
        },

        switchVisible: function(e){
            if( e.currentTarget.checked ){
                this.model.set('show', true);
            }else{
                this.model.set('show', false);
            }
            e.stopPropagation();
        }

    })
})