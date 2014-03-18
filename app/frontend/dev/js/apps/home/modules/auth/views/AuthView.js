define([
    'marionette'
], function(Marionette, L){

    return Marionette.ItemView.extend({

        el: ".account",

        events: {
            "click .signin-container .signin": "signInBtn",
            "click .signup-container .signup": "signUpBtn"
        },
        initialize: function(){

        },

        render: function(){},

        signInBtn: function(e){
            e.preventDefault();
        },
        signUpBtn: function(e){
            e.preventDefault();
            debugger
        }
    })

})