define([
    'marionette',
    'text!../templates/template.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        className: "notice",

        events: {
            "click .close" : "animateClose"
        },

        initialize: function(){
            this.render(this.model.toJSON());
            this.$el.addClass(this.model.get("type"));
        },

        animateClose: function(){
            var _this = this;
            this.$el.removeClass('fadeInRight').addClass('animated fadeOutRight');
            this.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                _this.close();
            });
        }
    })

})