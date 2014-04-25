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
            "click .zoom": "zoom",
            "click .delete": "deleteGroup"
        },

        ui: {
            'visible': ".visible",
            'countFeatures': '.countFeatures'
        },

        initialize: function(){
            this.collection = this.model.get('features');

            this.listenTo(this.collection, "wantToBeRemove", this.handlerWantToBeRemove);

            this.listenTo(this.collection, "add", this.handlerAddFeature);
            this.listenTo(this.collection, "remove", this.handlerRemoveFeature);
            this.listenTo(this.collection, "change:feature:isEdit", this.handlerIsEditFeature);
            this.listenTo(this.model, "change:isOpen", this.handlerChangeIsOpen);
            this.listenTo(this.model, "change:isActive", this.handlerChangeIsActive);
        },

        handlerIsEditFeature: function(feature){
            this.model.trigger("change:feature:isEdit", feature);
        },

        appendHtml: function(collectionView, itemView){
            collectionView.$('.features').append(itemView.el);
        },

        onRender: function(){
            this.model.trigger('change:isOpen');
            this.model.trigger('change:isActive');
            this.recalculateFeatureCounts();
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

        zoom: function(e){
            e.preventDefault();
            e.stopPropagation();
            this.model.trigger('custom:event:', {
                name: 'group:centerMe',
                model: this.model
            });
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

        handlerWantToBeRemove: function(feature){
            this.collection.remove(feature);
        },

        handlerAddFeature: function(){
            this.recalculateFeatureCounts();
        },

        handlerRemoveFeature: function(){
            this.recalculateFeatureCounts();
        },

        recalculateFeatureCounts: function(){
            this.ui.countFeatures.html( this.model.get('features').length );
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