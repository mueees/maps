define([
    'marionette',
    "text!../templates/LayoutView.html"

], function(Marionette, LayoutTemp){
    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        regions: {
            'map': '#map',
            'mainButtons': "#control-first-container .main-buttons-container",
            'tabContainer': ".tab-container",
            'secondContainer': "#control-second-container"
        }
    })

    return Layout;

})