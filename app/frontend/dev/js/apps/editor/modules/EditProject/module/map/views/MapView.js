define([
    'marionette',
    'leaflet',

], function(Marionette, L){

    return Marionette.ItemView.extend({

        initialize: function(){
            _.bindAll(this, "updateHeight");
            $(window).on('resize', this.updateHeight)
        },

        render: function(){},

        onShow: function(){
            this.updateHeight();
            var map = this.map = L.map( this.el, {zoomControl:false} ).setView([50.45, 30.52], 6);
            L.tileLayer('http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(this.map);

            //marker
            var marker = L.marker([50.5, 30.5]);
            marker.bindPopup("est")

            //popup
            /*var popup = L.popup()
                .setLatLng([50.5, 30.5])
                .setContent('<p>Hello world!<br />This is a nice popup.</p>')
                .openOn(map);*/


            var polyline = L.polyline([
                L.latLng(50.5, 30.5),
                L.latLng(50.5, 40.5)
            ], {color: 'red'}).bindPopup("est");

            var layer = L.layerGroup([marker])
                .addLayer(polyline);

            group.addTo(map);

            group.eachLayer(function (layer) {
                layer.bindPopup('Hello');
            });
        },

        subscribe: function(){
            this.map.on('click', function(e){
                /*
                1. не по фичи ли кликнули ? если да, то отцентрировать ее и показать ее в слоях и окно с ее настройками
                2. если не по фичи, проверить разрешено ли вообще как-то реагироват на клик
                3. если не разрешено то проигноривать этот клик, показав только в нижнем модальном окне координаты клика и анимашку
                4. если разрешенно, то добавить в текущий слой, соответствующую фичу, или если фичу не возможно\
                    сразу же добавить (к примеру линию), начать рисовать фичу
                 */
            })
        },

        updateHeight: function(){
            this.$el.height($(window).height());
        }
    })

})