require([
    'apps/app',
    'routefilter',

    'helpers/notify/module',

    /*modules*/
    'apps/editor/modules/EditProject/EditProject_app'
], function(App){
    App.route.root = "/editor/";
    App.start();
})