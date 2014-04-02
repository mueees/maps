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
            //secondButtonsView
            changeFeatureType: "changeFeatureType"
        }
    }
})