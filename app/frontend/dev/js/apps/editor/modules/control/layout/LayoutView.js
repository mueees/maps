define([
    'marionette',
    "text!../templates/LayoutView.html"

], function(Marionette, LayoutTemp){
    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        regions: {
            /*'menu': '.menu_rss',
            'tabCont': ".tabCont",
            'addCont': ".addCont",
            'contentCont': '.contentCont',
            'main_rss': '.main_rss'*/
        }
    })

    return Layout;

})