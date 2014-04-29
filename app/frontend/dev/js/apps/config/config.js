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
            changeFeatureType: "changeFeatureType",
            changeMainMenu: "changeMainMenu"
        },

        map: {
            defaults: {
                titleLayerUrl: 'http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                center: [50.45, 30.52],
                startZoom: 6,
                maxZoom: 18,
                zoomControl: false
            }
        },

        log: {
            isShow: true
        },

        key: {
            esc: 27
        }
    }
})