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
            var map = L.map( this.el, {zoomControl:false} ).setView([50.45, 30.52], 6);
            L.tileLayer('http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map);
        },

        updateHeight: function(){
            this.$el.height($(window).height());
        }
    })

})