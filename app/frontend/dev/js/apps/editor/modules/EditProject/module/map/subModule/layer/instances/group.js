define([
    'jquery',
    'backbone',
    'leaflet',
    './featureFactory'
],function($, Backbone, L, FeatureFactory){
    function Group(group){
        this._group = group;
        this.features = [];
        this.group = L.layerGroup();
        this.cid = group.cid;

        _.bindAll(this, "handlerRemoveFeature",
            "handlerAddFeature",
            "handlerChangeGroupShow",
            "handlerShowFeature",
            "handlerHideFeature",
            "handlerEditFeature"
        );

        this.initialize();
    }

    $.extend(Group.prototype, Backbone.Events, {
        initialize: function(){
            this.parse();
            this.subscribe();
        },
        parse: function(){
            var _this = this;
            this._group.get('features').each(function(feature){
                _this.addFeature(feature);
            })
        },
        subscribe:function(){
            this._group.get('features').on('remove', this.handlerRemoveFeature);
            this._group.get('features').on("add", this.handlerAddFeature);
            this._group.on('change:show', this.handlerChangeGroupShow);
        },
        handlerChangeGroupShow:function(){
            this.clearFeature();

            if(this._group.get('show')){
                this.addFeaturesToGroup();
            }
        },
        handlerAddFeature: function(feature){
            this.addFeature(feature);
        },

        /**
         * Create feature object, and add to features[] and group (Leaflet group)
         * @param {Object} feature - Backbone model
         * */
        addFeature: function(feature){
            var f = FeatureFactory.make(feature);

            f.on("show", this.handlerShowFeature);
            f.on("hide", this.handlerHideFeature);
            f.on("feature:center", this.handlerEditFeature);

            this.features.push(f);
            this.group.addLayer(f.view);
        },
        handlerEditFeature:function(data){
            this.trigger("feature:center", data);
        },

        /**
         * Add all features object from features[] to group (Leaflet group)
         * */
        addFeaturesToGroup: function(){
            var _this = this;
            _.each(this.features, function(f, i){
                _this.group.addLayer(f.view);
            })
        },

        /**
         * Add feature from feature[] to this.group - Leaflet layer
         * @param {string} featureCid
         * */
        addFeatureToGroup:function(featureCid){
            var f = this.getFeature(featureCid);
            this.group.addLayer(f.view);
        },

        /**
         * Get feature object from feature[]
         * @param {string} featureCid - Feature cid
         * */
        getFeature:function(featureCid){
            var result;
            _.each(this.features, function(feature, i){
                if( feature.cid === featureCid ){
                    result = feature;
                    return;
                }
            })
            return result;
        },
        handlerShowFeature:function(feature){
            this.addFeatureToGroup(feature.cid);
        },
        handlerHideFeature:function(feature){
            this.removeFeatureFromGroup(feature.cid);
        },
        handlerRemoveFeature:function(model, options){
            this.removeFeature(model.cid);
        },
        removeFeature:function(featureCid){
            if(!featureCid) return false;
            var i,
                index,
                featureL;
            for( i = 0; i < this.features.length; i++ ){
                if( this.features[i].cid === featureCid ){
                    index = i;
                    featureL = this.features[i];
                    break;
                }
            }
            this.features.splice(index,1);
            this.group.removeLayer(featureL.view);
        },

        /**
         * Remove feature.view from group
         * @param {string} featureCid
         * */
        removeFeatureFromGroup:function(featureCid){
            if(!featureCid) return false;
            var i,
                index,
                featureL;
            for( i = 0; i < this.features.length; i++ ){
                if( this.features[i].cid === featureCid ){
                    index = i;
                    featureL = this.features[i];
                    break;
                }
            }
            this.group.removeLayer(featureL.view);
        },

        /**
         * Remove all features from group (Leaflet group)
         * */
        clearFeature: function(){
            this.group.clearLayers();
        },
        addTo: function(map){
            this.group.addTo(map);
        }
    });

    return Group;
})

