var map = L.map('map').setView([47.73193447949174, 11.865234375], 12);

L.tileLayer('https://{s}.tiles.mapbox.com/v3/ustroetz.hied1fh3/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

var yourGeoJSON = [
    {
        "type": "Feature",
        "properties": {
            "id": 2,
            "elevation": 50
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [ 11.836395263671875, 47.75317468890147 ],
                [ 11.865234375, 47.73193447949174 ]
            ]
        }
    },

    { "type": "Feature", "properties": { "id": 1, "elevation": 750 }, "geometry": { "type": "LineString", "coordinates": [
        [ 11.865234375, 47.73193447949174 ],
        [ 11.881027221679688, 47.700520033704954 ]
    ] } },
    { "type": "Feature", "properties": { "id": 0, "elevation": 1700 }, "geometry": { "type": "LineString", "coordinates": [
        [ 11.881027221679688, 47.700520033704954 ],
        [ 11.923599243164062, 47.706527200903395 ]
    ] } },
    { "type": "Feature", "properties": { "id": 0, "elevation": 3000 }, "geometry": { "type": "LineString", "coordinates": [
        [ 11.923599243164062, 47.706527200903395 ],
        [ 11.881027221679688, 47.700520033704954 ],
    ] } }
];


function getColor(x) {
    return x < 500 ? '#bd0026' :
        x < 1000 ? '#f03b20' :
            x < 1500 ? '#fd8d3c' :
                x < 2000 ? '#fecc5c' :
                    '#ffffb2';
};


L.geoJson(yourGeoJSON, {
    style: function (feature) {
        return {
            "color": getColor(feature.properties.elevation),
            "opacity": 1
        }
    }
}).addTo(map);
