define([
    'marionette',
    'components/tab/views/TabView',
    'text!../templates/TabProjectView.html'
], function(Marionette, TabView, TabProjectView){

    return TabView.extend({
        template: _.template(TabProjectView),

        className: "tab-project",

        events: function(){
            return _.extend({}, TabView.prototype.events,{
                "blur #name-project": "handlerChangeName",
                "blur #description-project": "handlerChangeDescription"
            });
        },

        initialize: function(){
            this.listenTo(this.model, "change:name", this.changeName);
            this.listenTo(this.model, "change:name", this.changeDescription);
        },
        ui: {
            name: "#name-project",
            description: "#description-project"
        },
        handlerChangeName: function(){
            this.model.set('name', this.ui.name.val());
        },
        handlerChangeDescription: function(){
            this.model.set('description', this.ui.description.val());
        },
        changeName: function(){
            this.ui.name.val(this.model.get('name'));
        },
        changeDescription: function(){
            this.ui.description.val(this.model.get('description'));
        }
    });
})