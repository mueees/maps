define([
    'marionette',
    'components/tab/views/TabView',
    'text!../templates/EditPolylineViewTemp.html'
], function(Marionette, TabView, EditPolylineViewTemp){

    return TabView.extend({
        template: _.template(EditPolylineViewTemp)
    });

})