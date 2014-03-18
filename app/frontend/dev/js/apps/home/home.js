require([
    'apps/app',
    'routefilter',

    /*modules*/
    'home/modules/auth/auth_app',
    'home/modules/map/module_app'
], function(App){
    App.start();
})