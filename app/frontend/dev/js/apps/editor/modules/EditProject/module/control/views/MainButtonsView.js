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
            this.listenTo(this.model, "change:selectedItem", this.handlerChangeTab);
            this.model.on();
        },

        handlerChangeTab: function(){
            var tab = this.model.get('selectedItem');
            this.disableAllTab();
            if( tab ){
                this.selectTabItem(tab);
            }
        },

        selectTabItem: function(tab){
            this.$el.find('a[data-type='+tab+']').addClass('active');
        },

        disableAllTab: function(){
            this.$el.find('a').removeClass('active');
        },

        handlerTabClick: function(e){
            e.preventDefault();
            var $el = $(e.target),
                tab = $el.data('type');
            if(!tab) return false;

            if(tab == "save"){
                this.model.trigger("save");
            }else if( tab == this.model.get('selectedItem') ){
                this.model.set('selectedItem', null);
            }else{
                this.model.set('selectedItem', tab);
            }
        }
    })

})