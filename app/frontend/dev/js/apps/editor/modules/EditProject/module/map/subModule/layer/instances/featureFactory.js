define([
    'leaflet',
    './point'
],function(L, Point){
    function FeatureFactory(){}
    FeatureFactory.make = function(feature){
        var result;
        switch (feature.get("type")) {
            case "Point":
                result = new Point(feature);
                break;
            default :
                result = false;
        }
        return result;
    }
    return FeatureFactory;
})