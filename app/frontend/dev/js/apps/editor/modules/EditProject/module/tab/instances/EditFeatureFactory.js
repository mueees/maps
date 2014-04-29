define([
    'backbone',
    'marionette',
    '../views/EditPointView',
    '../views/EditPolylineView'
],function(Backbone, Marionette, EditPointView, EditPolylineView){

    function EditFeatureFactory(){}

    EditFeatureFactory.make = function(feature){
        var result;
        switch (feature.get('type')) {
            case "Marker":
                result = new EditPointView({
                    model: feature
                });
                break;
            case "Polyline":
                result = new EditPolylineView({
                    model: feature
                });
                break;
        }

        return result;
    }
    return EditFeatureFactory;
})