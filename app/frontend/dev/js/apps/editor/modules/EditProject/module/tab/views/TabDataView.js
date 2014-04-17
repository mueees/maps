define([
    'marionette',
    './GroupView',
    'text!../templates/TabDataViewTemp.html'
], function(Marionette, GroupView, TabDataViewTemp){

    return Marionette.CompositeView.extend({
        template: _.template(TabDataViewTemp),

        className: "tab-data",

        itemView: GroupView,

        events: {
            'click .addGroup': "addGroupHandler"
        },

        initialize: function(){
            this.collection = this.model.get('groups');
            this.listenTo(this.model.get('groups'), "wantToBeActive", this.handlerWantToBeActive);
            this.listenTo(this.model.get('groups'), "wantToBeRemove", this.handlerWantToBeRemove);
            this.listenTo(this.model.get('groups'), "change:feature:isEdit", this.handlerIsEditFeature);
        },

        handlerIsEditFeature: function(feature){
            debugger
        },

        handlerWantToBeActive: function(group){
            this.model.resetAllActiveGroup();
            group.set('isActive', true);
        },

        handlerWantToBeRemove: function(group){
            this.collection.remove(group);
            this.model.setDefaultActiveGroup();
        },

        appendHtml: function(collectionView, itemView){
            collectionView.$('.layouts').append(itemView.el);
        },

        addGroupHandler: function(){
            this.model.get('groups').each(function(group){
                group.set('isActive', false);
            })
            this.model.get('groups').add({});
        }
    });
})