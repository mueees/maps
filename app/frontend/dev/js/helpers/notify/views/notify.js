define([
    'marionette',
    'text!../templates/template.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        className: "notify",

        events: {},

        initialize: function(){
            this.render();
        }
    })

})