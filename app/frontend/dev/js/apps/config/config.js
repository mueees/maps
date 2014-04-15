define([], function(){
    return {
        api: {
            'userSignUp': '/api/user/signup',
            'userSignIn': '/api/user/signin',

            //project
            'project': '/api/project'
        },
        url: {
            afterSignIn: "/projects"
        },
        channel: {
            changeMainControl: "changeMainControl",
            //secondButtonsView
            changeFeatureType: "changeFeatureType"
        },

        log: {
            isShow: true
        }
    }
})