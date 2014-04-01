require([
    'apps/app',
    'routefilter',

    'helpers/notify/module',

    /*modules*/
    'apps/editor/modules/control/control_app',
    'apps/editor/modules/map/map_app'
], function(App){
    App.route.root = "/editor/";
    App.start();
})