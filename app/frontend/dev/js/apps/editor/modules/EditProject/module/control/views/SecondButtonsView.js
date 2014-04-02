define([
    'marionette',
    'text!../templates/SecondButtonsView.html'

], function(Marionette, SecondButtonsViewTemp){

    return Marionette.ItemView.extend({

        events: {
            'click .control' : "handlerControl"
        },

        className: "second-buttons",

        template: _.template(SecondButtonsViewTemp),

        initialize: function(){
            this.listenTo(this.model, "change:featureType", this.handlerChangeType);
        },

        onShow: function(){

        },

        handlerChangeType: function(){
            var type = this.model.get('featureType');
            if(!type){
                this.inactiveAllControl();
            }else{
                this.setActiveControl(type);
            }
        },

        setActiveControl: function(type){
            this.inactiveAllControl();
            this.$el.find(".control[data-type="+type+"] a").addClass('active');
        },

        inactiveAllControl: function(){
            this.$el.find(".control a").removeClass('active');
        },

        handlerControl: function(e){
            e.preventDefault();
            var $el = $(e.target).closest('li'),
                type = $el.data('type');

            if( type == this.model.get("featureType") ){
                type = null;
            }
            this.model.set('featureType', type);


        }
    })

})