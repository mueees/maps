define([
    'marionette',
    'components/tab/views/TabView',
    'text!../templates/EditPointViewTemp.html'
], function(Marionette, TabView, EditPointViewTemp){

    return TabView.extend({
        template: _.template(EditPointViewTemp),

        events: function(){
            return _.extend({}, TabView.prototype.events,{
                "blur #title-marker": "handlerChangeTitle",
                "blur #description-marker": "handlerChangeDescription",
            });
        },
        ui:{
            title: "#title-marker",
            description: "#description-marker"
        },

        handlerChangeTitle:function(){
            this.model.set('title', this.ui.title.val());
        },
        handlerChangeDescription:function(){
            debugger
            this.model.set('description', this.ui.description.val());
        }
    });

})