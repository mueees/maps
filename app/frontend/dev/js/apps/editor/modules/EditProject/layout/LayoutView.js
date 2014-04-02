define([
    'marionette',
    "text!../templates/LayoutView.html"

], function(Marionette, LayoutTemp){
    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        regions: {
            'map': '#map',
            'firstContainer': "#control-first-container",
            'secondContainer': "#control-second-container"
        }
    })

    return Layout;

})