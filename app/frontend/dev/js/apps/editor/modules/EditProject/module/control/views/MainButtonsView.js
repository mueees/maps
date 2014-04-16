define([
    'marionette',
    'text!../templates/MainButtonsViewTemp.html'

], function(Marionette, MainButtonsViewTemp){

    return Marionette.ItemView.extend({

        className: "main-buttons",

        template: _.template(MainButtonsViewTemp),

        events: {
            'click a': "handlerTabClick"
        },

        initialize: function(){
            this.listenTo(this.model, "change:tab", this.handlerChangeTab)
            this.model.on();
        },

        handlerChangeTab: function(){
            var tab = this.model.get('tab');
            this.disableAllTab();
            if( tab ){
                this.selectTabItem(tab);
            }
        },

        selectTabItem: function(tab){
            this.$el.find('a[data-tab='+tab+']').addClass('active');
        },

        disableAllTab: function(){
            this.$el.find('a').removeClass('active');
        },

        handlerTabClick: function(e){
            e.preventDefault();
            var $el = $(e.target),
                tab = $el.data('tab');
            if(!tab) return false;

            if(tab == "save"){
                this.model.trigger("save");
            }else if( tab == this.model.get('tab') ){
                this.model.set('tab', null);
            }else{
                this.model.set('tab', tab);
            }
        }
    })

})