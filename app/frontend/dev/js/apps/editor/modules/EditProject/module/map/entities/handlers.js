define([
    'leaflet',
    'leafletDraw',
    'map'
], function(L){
    function initialize(map){
        return {
            marker: new L.Draw.Marker(map),
            polygon: new L.Draw.Polygon(map),
            polyline: new L.Draw.Polyline(map)
        }
    }
})