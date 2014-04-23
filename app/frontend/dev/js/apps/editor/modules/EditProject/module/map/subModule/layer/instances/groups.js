define([
    'leaflet',
    './group',
    'underscore'
],function(L, Group, _){
    function Groups( groups, map ){
        //Backbone groups collection
        this._groups = groups;
        //Leaflet groups
        this.groups = [];

        this.map = map;

        _.bindAll(this, "addGroup",
            "handlerRemoveGroup",
            "handlerAddGroup",
            "handlerCenterFeature"
        );
        this.initialize();

    }
    Groups.prototype = {
        initialize: function(){
            this.parse();
            this.subscribe();
        },
        parse: function(){
            var _this = this;
            this._groups.each(function(group){
                _this.addGroup(group);
            })
        },
        addGroup:function(group){
            var g = new Group(group);

            this.groups.push(g);
            g.addTo(this.map);
        },
        handlerCenterFeature:function(data){
            this.setViewByMarker(data.model);
        },
        setViewByMarker: function(featureModel){
            var latlng = L.latLng(featureModel.get('lat'), featureModel.get('lon'));
            this.map.setView(latlng);
        },
        subscribe:function(){
            var _this = this;
            this._groups.on('remove', this.handlerRemoveGroup);
            this._groups.on('add', this.handlerAddGroup);
            this._groups.on("custom:event:", function(data){
                var name = data.name;
                if(!name) return false;

                switch (name){
                    case "feature:centerMe":
                        _this.handlerCenterFeature(data);
                        break;
                }
            });
        },
        handlerAddGroup:function(model){
            this.addGroup(model);
        },
        handlerRemoveGroup: function(model, options){
            this.removeGroup(model, options);
        },
        removeGroup:function(model, options){
            var group = this.getGroup(model.cid);
            if(!group) return false;
            group.clearFeature();
            this.removeGroupFromGroups(model);
        },
        removeGroupFromGroups:function(group){
            var i,
                index;
            for( i = 0; i < this.groups.length; i++ ){
                if( this.groups[i].cid === group.cid ){
                    index = i;
                    break;
                }
            }
            this.groups.splice(index, 1);
        },
        getGroup:function(groupCid){
            var result;
            _.each(this.groups, function(group, i){
                if( group.cid === groupCid ){
                    result = group;
                    return;
                }
            })
            return result;
        }

    }
    return Groups;
})