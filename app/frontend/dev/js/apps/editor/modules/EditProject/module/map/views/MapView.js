define([
    'marionette'

], function(Marionette){

    return Marionette.ItemView.extend({

        template: _.template(""),

        initialize: function(){
            _.bindAll(this, "updateHeight");
            $(window).on('resize', this.updateHeight)
        },

        onShow: function(){
            this.updateHeight();
        },

        updateHeight: function(){
            this.$el.height($(window).height());
        }
    })

})