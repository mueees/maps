define([
    'marionette'
], function(Marionette){

    return Marionette.ItemView.extend({
        events: {
            'click .tabs li' : 'switchTab'
        },

        switchTab: function(e){
            e.preventDefault();
            var $el = $(e.target).closest('li');
            var type =  $el.data('type');
            if(!type) return false;

            this.hideActiveTab();
            this.showActiveTab(type);
            this.removeAllActiveTabs();
            $el.addClass('active');
        },

        showActiveTab: function(type){
            this.$el.find('.tabs-content .tab[data-type="'+type+'"]').addClass('active');
        },

        hideActiveTab: function(){
            this.$el.find('.tabs-content .tab.active').removeClass('active');
        },

        removeAllActiveTabs: function(){
            this.$el.find('.tabs li').removeClass('active');
        }

    })

})