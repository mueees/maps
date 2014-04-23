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
                "blur #description-marker": "handlerChangeDescription"
            });
        },
        ui:{
            title: "#title-marker",
            description: "#description-marker",
            lon: ".tabs-content .longitude input",
            lat: ".tabs-content .latitude input"
        },

        initialize: function(){
            this.listenTo(this.model, "change:lon", this.handlerChangerCoordinat);
            this.listenTo(this.model, "change:lat", this.handlerChangerCoordinat);
        },

        handlerChangeTitle:function(){
            this.model.set('title', this.ui.title.val());
        },
        handlerChangeDescription:function(){
            this.model.set('description', this.ui.description.val());
        },
        handlerChangerCoordinat:function(){
            this.ui.lon.val(this.model.get('lon'));
            this.ui.lat.val(this.model.get('lat'));
        }
    });

})