define([
    'marionette',
    'text!../templates/MainButtonsViewTemp.html'

], function(Marionette, MainButtonsViewTemp){

    return Marionette.ItemView.extend({

        className: "main-buttons",

        template: _.template(MainButtonsViewTemp),

        initialize: function(){

        },

        onShow: function(){

        }
    })

})