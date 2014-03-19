define([
    'jquery',
    'marionette',
    'validate',
    'bootstrap'
], function($, Marionette){

    return Marionette.ItemView.extend({

        el: ".account",

        events: {
            "click .signin-container .signin": "signInBtn",
            "click .signup-container .signup": "signUpBtn"
        },

        initialize: function(){
            this.addPlugins();
        },

        addPlugins: function(){
            var formSignIn = this.$el.find('.signin-container form');
            var formSignUp = this.$el.find('.signup-container form');

            formSignIn.validate({
                rules: {
                    signInEmail: {
                        required: true,
                        email: true
                    },
                    signInPassword: {
                        required: true,
                        minlength: 3
                    }
                },
                errorPlacement: function(error, element) {}
            });

            formSignUp.validate({
                rules: {
                    signUpEmail: {
                        required: true,
                        email: true
                    },
                    signUpPassword: {
                        required: true,
                        minlength: 3
                    }
                },
                errorPlacement: function(error, element) {}
            });
        },

        render: function(){},

        isValidSignIn: function(){
            return this.$el.find('.signin-container form').valid();
        },

        isValidSignUp: function(){
            return true;
            return this.$el.find('.signup-container form').valid();
        },

        getSignInData: function(){
            return {
                email: $.trim(this.$el.find('#signInEmail').val()),
                password: $.trim(this.$el.find('#signInPassword').val())
            }
        },

        getSignUpData: function(){
            return {
                email: $.trim(this.$el.find('#signUpEmail').val()),
                password: $.trim(this.$el.find('#signUpPassword').val())
            }
        },

        signInBtn: function(e){
            e.preventDefault();
            if( this.isValidSignIn() ){
                this.$el.find('.signin-container button').button('loading');
                this.trigger('signIn', this.getSignInData());
            }else{
                this.trigger("invalidData");
                this.errorAnimateSignIn();
            }
        },

        signUpBtn: function(e){
            e.preventDefault();
            if( this.isValidSignUp() ){
                this.$el.find('.signup-container button').button('loading');
                this.trigger('signUp', this.getSignUpData());
            }else{
                this.trigger("invalidData");
                this.errorAnimateSignUp();
            }
        },

        errorAnimateSignIn: function(){
            var signIn = this.$el.find('.signin-container');
            signIn.addClass('animated shake');
            this.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                signIn.removeClass('animated shake');
            });
        },

        errorAnimateSignUp: function(){
            var signUp = this.$el.find('.signup-container');
            signUp.addClass('animated shake');
            this.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                signUp.removeClass('animated shake');
            });
        },

        errorSignUp: function(){
            this.errorAnimateSignUp();
            this.$el.find('.signup-container button').button('reset');
        },

        errorSignIn: function(){
            this.errorAnimateSignIn();
            this.$el.find('.signin-container button').button('reset');
        }
    })

})