require([
    'apps/app',
    'routefilter',

    'helpers/notify/module',

    /*modules*/
    'home/modules/auth/auth_app',
    'home/modules/map/module_app'
], function(App){
    App.start();
})