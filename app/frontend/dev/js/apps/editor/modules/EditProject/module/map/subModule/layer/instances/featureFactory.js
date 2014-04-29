define([
    'leaflet',
    './point',
    './polyLine'
],function(L, Point, PolyLine){
    function FeatureFactory(){}
    FeatureFactory.make = function(feature){
        var result;
        switch (feature.get("type")) {
            case "Point":
                result = new Point(feature);
                break;
            case "Polyline":
                result = new PolyLine(feature);
                break
            default :
                result = false;
        }
        return result;
    }
    return FeatureFactory;
})