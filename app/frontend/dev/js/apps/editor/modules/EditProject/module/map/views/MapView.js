define([
    'marionette',
    'leaflet',
    'leafletDraw'

], function(Marionette, L){

    return Marionette.ItemView.extend({

        initialize: function(){
            _.bindAll(this, "updateHeight",
            "handlerClickByMap");
            this.listenTo(this.model, "change:featureType", this.handlerChangeFeatureType);
            $(window).on('resize', this.updateHeight)
        },

        render: function(){},

        onShow: function(){
            this.updateHeight();
            var map = this.map = L.map( this.el, {zoomControl:false} ).setView([50.45, 30.52], 6);
            L.tileLayer('http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(this.map);
            this.subscribe();

            /*var marker = L.marker([50.5, 30.5]);
            marker.bindPopup("est")


            var popup = L.popup()
                .setLatLng([50.5, 30.5])
                .setContent('<p>Hello world!<br />This is a nice popup.</p>')
                .openOn(map);


            var polyline = L.polyline([
                L.latLng(50.5, 30.5),
                L.latLng(50.5, 40.5)
            ], {color: 'red'}).bindPopup("est");

            var group = L.layerGroup([marker])
                .addLayer(polyline);

            group.addTo(map);

            group.eachLayer(function (layer) {
                layer.bindPopup('Hello');
            });*/
        },

        handlerChangeFeatureType: function(){
            var featureType = this.model.get('featureType');
            if( featureType == "marker" ){
                var marker = new L.Draw.Marker(this.map);
                marker.enable();
            }
        },

        handlerClickByMap: function(){

        },

        handlerDrawCreated: function(e){
            e.layer.openPopup();
            //debugger
        },

        /* Activate handlers state */
        activate: function(type, editing){

        },

        // Wrapper around exports.activate that resets to default draw state.
        clear: function(){
            this.activate('browse');
        },

        subscribe: function(){
            this.map.on('click', this.handlerClickByMap);
            this.map.on('draw:created', this.handlerDrawCreated);
        },

        updateHeight: function(){
            this.$el.height($(window).height());
        }
    })

})