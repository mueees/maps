;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    (function() {

        var fs = require('fs');

        var Geocoder = require('./src/geocoder'),
            Style = require('./src/style'),
            Markers = require('./src/markers'),
            Draw = require('./src/draw'),
            drop = require('./src/drop'),
            Layers = require('./src/layers'),
            Info = require('./src/info');

        var inputIncrement = require('./src/lib/inputincrement'),
            pager = require('./src/lib/pager'),
            color = require('./src/lib/color'),
            zoom = require('./src/lib/zoom');

        if (!App) throw new Error('Global App object required');
        if (!Views) throw new Error('Global Views object required');

        var templates = {
            mapview: _("<a href='#' id='zoom-out' class='fill-darken1 keyline-right inline icon minus'></a><!--\n--><a href='#' id='zoom-in' class='fill-darken1 keyline-right inline icon plus'></a><!--\n--><span class='inline display-view center'>\n  <span class='clip inline'><%=obj.lat%>, <%=obj.lng%></span><span class='hide-small-screen clip inline'>, <%=obj.zoom%></span>\n</span>\n").template()
        };

        var Editor = Backbone.View.extend({});

        Editor.prototype.events = (function() {
            var events = {};
            events['click .modes a']                    = 'targetToggle';
            events['click #editor-menu a.signup']       = 'signup';
            events['click .modes a.project-save']       = 'save';
            events['click .readonly']                   = 'inputselect';
            events['keyup #project-data-search']        = 'layersSearch';
            events['click #project-data-browse a']      = 'layersSet';
            events['click #project-layers .close']      = 'layersSet';
            events['click #project-layers a']           = 'layersView';
            events['click .addlayers']                  = 'layersBrowse';
            events['click #marker-menu .js-tabs label'] = 'layersRender';
            events['click .app .js-tabs a']             = 'tabs';
            events['click .app .js-tabs label']         = 'tabs';
            events['click .app .color-tabs a']          = 'tabs';
            events['click .pager a']                    = 'pager';
            events['keyup #project-settings input[type=text]'] = 'set';
            events['keyup #project-settings textarea']      = 'set';
            events['click #private']                    = 'set';
            events['click .js-help-toggle']             = 'helpToggle';
            events['click .draw-controls .button']      = 'drawMode';
            events['click #marker-tray a']              = 'markerEdit';
            events['click #marker-tray .trash']         = 'markerDel';
            events['click #marker-edit .trash']         = 'markerDel';
            events['change #marker-edit input[type=number]'] = 'markerSet';
            events['keyup #marker-edit input']          = 'markerSet';
            events['keyup #marker-edit textarea']       = 'markerSet';
            events['click #marker-edit input[type=radio]'] = 'markerSet';
            events['click #style-type input']           = 'styleSet';
            events['click #style-l10n input']           = 'styleSet';
            events['click #style-2x']                   = 'style2x';
            events['click #style-swatches input']       = 'styleSwatch';
            events['click #style-tint a.palette']       = 'stylePalette';
            events['mousedown .color-picker .color-h']  = 'enterColorH';
            events['mousedown .color-picker .color-sl'] = 'enterColorSL';
            events['mousemove .color-picker']           = 'colorHSL';
            events['mouseup   .color-picker']           = 'clearSelectMode';
            events['keyup .color-picker .color-hex']    = 'colorHex';
            events['change input.clamp']                = 'colorClamp';
            events['click #style-tint .disable']        = 'colorOn';
            events['click #style-tint .enable']         = 'colorOn';
            events['click .color-picker .invert']       = 'colorInv';
            events.dragenter                            = 'mapDragEnter';
            events.dragover                             = 'mapDragEnter';
            events.dragleave                            = 'mapDragLeave';
            events['drop #dropzone']                    = 'mapDrop';
            events['change #manual-import']             = 'mapDrop';
            events['click .marker-import-manual']       = 'manualImport';
            events['click .app.modes > a']              = 'changeMode';
            events['change #search-results input']      = 'searchSet';
            events['click #search-results label']       = 'searchSet';
            events['click .module > .close']            = 'reset';
            events['click #zoom-in']                    = 'zoomIn';
            events['click #zoom-out']                   = 'zoomOut';
            events['click #import .tabs a']             = 'propertyPane';
            events['click #import-assign']              = 'importAssign';
            events['click #cancel-tip']                 = 'drawMode';
            events['click .increment']                  = 'inputIncrement';
            events['click .track-kml-download']         = 'downloadKML';
            events['click .track-geojson-download']     = 'downloadGeoJSON';
            events['click .track-ios-docs']             = 'iosDocs';
            events['click .track-js-docs']              = 'jsDocs';
            events['click .track-api-docs']             = 'apiDocs';
            events['change .embed-option']              = 'updateEmbed';
            return events;
        })();

        Editor.prototype.downloadKML = function(ev) {
            analytics.track('Downloaded Markers as KML');
        };

        Editor.prototype.downloadGeoJSON = function(ev) {
            analytics.track('Downloaded Markers as GeoJSON');
        };

        Editor.prototype.iosDocs = function(ev) {
            analytics.track('Viewed iOS docs from editor');
        };

        Editor.prototype.jsDocs = function(ev) {
            analytics.track('Viewed Javascript docs from editor');
        };

        Editor.prototype.apiDocs = function(ev) {
            analytics.track('Viewed API docs from editor');
        };

        Editor.prototype.targetToggle = function(ev) {
            if (window.location.hash === $(ev.currentTarget).attr('href')) {
                window.location.hash = '#';
                return false;
            }
        };

        Editor.prototype.zoomToggle = zoom.zoomToggle;
        Editor.prototype.zoomIn = zoom.zoomIn;
        Editor.prototype.zoomOut = zoom.zoomOut;

        Editor.prototype.mapDragEnter = drop.mapDragEnter;
        Editor.prototype.mapDragLeave = drop.mapDragLeave;
        Editor.prototype.mapDrop = drop.mapDrop;

        Editor.prototype.displayView = _.throttle(function() {
            var zoom = this.getZoom();
            var lat = parseFloat(this.getCenter().wrap().lat.toFixed(3));
            var lng = parseFloat(this.getCenter().wrap().lng.toFixed(3));
            $('#mapview').html(templates.mapview({ zoom: zoom, lat: lat, lng: lng }));
        }, 500);

        Editor.prototype.manualImport = function() {
            $('#manual-import').trigger('click');
            return false;
        };

        Editor.prototype.propertyPane = function(ev) {
            var panels = $('#import').find('.property-panes');
            var pane = $(ev.currentTarget).attr('href').split('#')[1];
            var current = panels.attr('class').match(/active[0-9]+/)[0];
            $(ev.currentTarget).addClass('active').siblings().removeClass('active');
            panels.removeClass(current).addClass(pane);
            return false;
        };

        Editor.prototype.importAssign = function(ev) {
            var values = {};
            var $modal = $(ev.currentTarget).parents('#import');

            $modal.find('input:checked')
                .each(function() {
                    if ($(this).data('geojson')) {
                        var parts = $(this).data('geojson').split('.');
                        values[parts[0]] = parts[1];
                    }
                });

            // Test for user entered input for marker-color
            var colorInput = $modal.find('#marker-color').val();
            if (colorInput && (/^#?([0-9a-f]{6})$/i).test(color.formatHex(colorInput))) {
                values['marker-color'] = color.formatHex(colorInput);
            }

            if (Views.modal.modals && Views.modal.modals.propertyassign) {
                Views.modal.modals.propertyassign.callback(null, values);
            } else {
                Views.modal.done('propertyassign');
            }

            return false;
        };

        Editor.prototype.renderName = function(model, val) {
            $('.project-name').text(val);
        };

        Editor.prototype.renderID = function(model, val) {
            if (model.id.split('.')[0] === 'api') return;
            $('.project-id').each(function() {
                if ($(this).is('input')) {
                    $(this).attr('value',model.id);
                } else {
                    $(this).text(model.id);
                }
            });
            if (this.info) {
                this.info.render();
                this.updateEmbed();
            }
        };

        Editor.prototype.signup = function(ev) {
            Views.modal.show('auth', {close:true}, function(err) {
                if (err && err.code !== 'closed') Views.modal.show('err', err);
            });
            Views.modal.slide('active3');
        };

        Editor.prototype.set = function(ev) {
            var el = $(ev.currentTarget);
            var attr = {};
            if (el.is('input[type=checkbox]') || el.is('input[type=radio]')) {
                attr[el.attr('name')] = el.is(':checked');
            } else {
                attr[el.attr('name')] = el.val();
            }
            this.model.set(attr);
        };

        Editor.prototype.saved = function() {
            this.changes = false;
            $('#project').removeClass('changed');
            $('#map-saveshare').removeClass('active1 active2').addClass('active1');
            // potentially update map id
            this.info.render();
            this.updateEmbed();
            bindClipboard();
            analytics.track('Saved a Map');
        };

        Editor.prototype.changed = function() {
            this.changes = true;
            $('#project').addClass('changed');
            $('#map-saveshare').removeClass('active1 active2').addClass('active2');
        };

        Editor.prototype.reset = function() {
            window.location.href = '#app';
            this.markers.clear();
            this.map.closePopup();
        };

        Editor.prototype.tabs = App.tabs;

        Editor.prototype.inputselect = function(ev) {
            $(ev.currentTarget).select();
        };

        Editor.prototype.inputIncrement = inputIncrement;
        Editor.prototype.pager = pager;

        Editor.prototype.helpToggle = function(ev) {
            if ($(this.el).is('.showhelp')) {
                App.storage('editor.help', true);
                $(this.el).removeClass('showhelp');
            } else {
                App.storage('editor.help', null);
                $(this.el).addClass('showhelp');
            }
            return false;
        };

        Editor.prototype.styleSet = function(ev) {
            var el = $(ev.currentTarget);
            this.style[ev.currentTarget.name](ev.currentTarget.value);
            this.style.refresh();
            this.style.make();
        };

        Editor.prototype.style2x = function(ev) {
            var on = $(ev.currentTarget).prop('checked');
            this.style.scale(on ? 2 : 1);
            this.style.refresh();
            this.style.make();
        };

        Editor.prototype.markerDel = function(ev) {
            var id = $(ev.currentTarget).is('a') ?
                $(ev.currentTarget).attr('href').split('#').pop() :
                $(ev.currentTarget).parent().attr('id');
            this.markers.del(id);
            analytics.track('Deleted a Marker');
            return false;
        };

        Editor.prototype.drawMode = function(ev) {
            ev.preventDefault();
            var drawMode = $(ev.currentTarget).attr('href').split('#')[1];
            this.draw.activate(drawMode);
            return false;
        };

        Editor.prototype.markerEdit = function(ev) {
            var id = $(ev.currentTarget).attr('id');
            this.markers.edit(id);
            analytics.track('Edited a Marker');
            return false;
        };

        Editor.prototype.markerSet = _(function(ev) {
            if (!this.markers.editing) throw new Error('Nothing to edit');
            var el = $(ev.currentTarget);
            var key = ev.currentTarget.name;
            var val = ev.currentTarget.value;
            var v = val;

            // Validation
            if (key === 'marker-color' && !(/^#?([0-9a-f]{6})$/i).test(color.formatHex(val))) return;
            if (key === 'fill' && !(/^#?([0-9a-f]{6})$/i).test(color.formatHex(val))) return;
            if (key === 'stroke' && !(/^#?([0-9a-f]{6})$/i).test(color.formatHex(val))) return;
            if (key === 'fill-opacity') val = inRange(val, 0, 1, 0.5);
            if (key === 'stroke-opacity') val = inRange(val, 0, 1, 0.5);
            if (key === 'stroke-width') val = inRange(val, 0, 20, 3);

            // hex value keyed in, so clear the swatch checkmark
            if ($(ev.target).hasClass('color-hex')) {
                $('#marker-edit .label-select:checked').prop('checked', false);
            }

            if (key === 'latitude'  || key === 'longitude') {
                var f = parseFloat(val);
                if (!isNaN(f)) {
                    this.markers.editing.geometry.coordinates[key === 'longitude' ? 0 : 1] = f;
                    var latLng = L.latLng(
                        this.markers.editing.geometry.coordinates[1],
                        this.markers.editing.geometry.coordinates[0]).wrap();
                    this.markers.layerById(this.markers.editing.properties.id).setLatLng(latLng);
                    this.changed();
                }
            } else {
                if (v === val) {
                    if (key === 'marker-color' ||
                        key === 'fill' ||
                        key === 'stroke') {
                        setHex(key, val);
                        val = color.formatHex(val);
                    } else {
                        $('#' + key).val(val);
                    }
                }
                $('#' + this.markers.editing.id + ' .' + key).text(val);
                this.markers.editing.properties[key] = val;
                this.markers.refresh(this.markers.editing.properties.id);
                this.changed();
            }

            this.markers.syncUI();
        }).throttle(50);

        function setHex(key, val) {
            if (val[0] !== '#') val = '#' + val;
            var hsl = Streets.parseTintString(color.formatHex(val)),
                avg = (hsl.l[0] + hsl.l[1])/2;
            $('#' + key)
                .val(val)
                .css('background-color', val)
                .css('color', (avg >= 0.5) ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,1)');
        }

        function inRange(v, a, b, def) {
            var f = parseFloat(v);
            if (isNaN(f)) return def;
            return Math.min(Math.max(f, a), b);
        }

        Editor.prototype.enterColorH = function(ev) {
            this.colorSelectMode = 'h';
            this.colorSelectTarget = ev.currentTarget;
            this.colorHSL(ev);
        };

        Editor.prototype.enterColorSL = function(ev) {
            this.colorSelectMode = 'sl';
            this.colorSelectTarget = ev.currentTarget;
            this.colorHSL(ev);
        };

        Editor.prototype.clearSelectMode = function() {
            this.colorSelectMode = false;
            this.colorSelectTarget = null;
        };

        Editor.prototype.colorHSL = color.colorHSL;

        Editor.prototype.colorHex = color.colorHex;

        Editor.prototype.styleSwatch = function(ev) {
            var hsl = Streets.parseTintString(ev.currentTarget.value);
            this.style.styles.whiz.h = Streets.avg(hsl.h);
            this.style.styles.whiz.s = Streets.avg(hsl.s);
            this.style.styles.whiz.l = Streets.avg(hsl.l);
            this.style.render('whiz');
        };

        Editor.prototype.stylePalette = function(ev) {
            var id = $(ev.currentTarget).attr('id').split('palette-').pop();
            if (id === 'custom') {
                $(this.$('#style-tint .color-tabs a').get(2)).click();
            } else {
                this.style.palette(id);
            }
            $(ev.currentTarget).addClass('active').siblings().removeClass('active');
            return false;
        };

        Editor.prototype.colorClamp = color.colorClamp;

        Editor.prototype.colorOn = function(ev) {
            var id = $('input[name=id]', $(ev.currentTarget).attr('href')).val();
            this.style.styles[id].on = !this.style.styles[id].on;
            this.style.styles[id].a = this.style.styles[id].on ?
                (this.style.styles[id].a || 1) :
                this.style.styles[id].a;
            this.style.render(id);
            return false;
        };

        Editor.prototype.colorInv = function(ev) {
            var id = this.style.id(ev);
            this.style.styles[id].inv = !this.style.styles[id].inv;
            this.style.render(id);
            return false;
        };

        Editor.prototype.layersSet = function(ev) {
            var el = $(ev.currentTarget).is('a') ? $(ev.currentTarget) : $(ev.currentTarget).parents('a');
            this.layers.toggle(el.data('id'));
            return false;
        };

        Editor.prototype.layersBrowse = function(ev) {
            this.layers.browse();
            return false;
        };

        Editor.prototype.layersRender = function(ev) {
            this.layers.render();
        };

        Editor.prototype.layersSearch = function(ev) {
            this.layers.search(ev.currentTarget.value);
        };

        Editor.prototype.layersView = function(ev) {
            var el = $(ev.currentTarget).is('a') ? $(ev.currentTarget) : $(ev.currentTarget).parents('a');
            this.layers.setview(el.data('id'));
            return false;
        };

        Editor.prototype.searchSet = function(ev) {
            if (ev.type == 'click') ev = $('#' + ev.currentTarget.htmlFor);
            this.search.setview(ev);
            return false;
        };

        Editor.prototype.changeMode = function(ev) {
            this.draw.clear();
            this.markers.clear();
        };

// Called from global App keydown.
        Editor.prototype.keydown = function(ev) {
            if (!(/#(app|code|data|search|style|project)/).test(window.location.hash)) return;

            var key = ev.which,
                $target = $(ev.target);

            switch (window.location.hash) {
                case '#search':
                    switch (key) {
                        case 27: // esc
                            return this.reset();
                        case 38: // up
                            ev.preventDefault();
                            this.search.select(-1);
                            return this.search.setview() && false;
                        case 40: // down
                            ev.preventDefault();
                            this.search.select(1);
                            return this.search.setview() && false;
                        case 13: // return
                            ev.preventDefault();
                            return this.search.setview();
                        default:
                            this.search.focus(ev);
                            return this.search.debounced(this.search.input.value);
                    }
                    break;
                case '#project':
                case '#style':
                case '#data':
                    switch (key) {
                        case 13: // return
                            if (!ev.shiftKey) {
                                ev.preventDefault();
                                return ev.target.blur();
                            }
                            break;
                        case 27: // esc
                            if (_.contains(['input', 'textarea'], ev.target.tagName.toLowerCase())) {
                                ev.preventDefault();
                                return ev.target.blur();
                            } else if (window.location.hash === '#data') {
                                return this.draw.mode !== 'browse' ? this.draw.clear() : this.reset();
                            } else {
                                return this.reset();
                            }
                            break;
                    }
                    break;
                // Any state
                default:
                    // 0-9a-z => start a new search.
                    if (!ev.ctrlKey && !ev.metaKey && !ev.altKey && key >= 48 && key <= 90) {
                        window.location.hash = '#search';
                        this.search.input.value = '';
                        this.search.focus(ev);
                    }
                    break;
            }

            // ESC: return to app default state
            if (key === 27) {
                return this.reset();
            }

            // TAB: listen for someone tabbing between inputs
            // This prevents half-scroll behavior due to how we use sliding panes
            if (key === 9 && $target.hasClass('js-noTabExit')) {
                ev.preventDefault();
            }
        };

// Called from global App keyup.
        Editor.prototype.keyup = function(ev) {
            if (!(/#(app|code|data|project|search|style)/).test(window.location.hash)) return;

            var key = ev.which;

            switch (window.location.hash) {
                case '#search':
                    switch (key) {
                        case 38:
                        case 40:
                        case 13:
                            break;
                        default:
                            this.search.focus(ev);
                            return this.search.debounced(this.search.input.value);
                    }
                    break;
            }
        };

        Editor.prototype.save = function() {
            var editor = this;
            var attr = {};
            attr.created = +new Date();
            if ($('#save-center').is(':checked')) {
                var center = this.map.getCenter().wrap();
                var zoom = this.map.getZoom();
                attr.center = [center.lng, center.lat, zoom];
            }
            this.model.set(attr);
            $('#app').addClass('loading');
            App.save(this.model, mapSaved);

            function mapSaved(err) {
                if (err) {
                    $('#app').removeClass('loading');
                    return err.code !== 'closed' && Views.modal.show('err', err);
                }
                editor.markers.save(markersSaved);
            }

            function markersSaved(err) {
                $('#app').removeClass('loading');
                if (err) return err.code !== 'closed' && Views.modal.show('err', err);
                editor.saved();
                if (window.location.hash !== '#project') {
                    editor.reset();
                    window.location.hash = '#saved';
                }

                if (!App.param('id') && window.history && window.history.replaceState) {
                    window.history.replaceState({}, '',
                        '/editor/?id=' + editor.model.id + location.hash);
                }
            }

            return false;
        };

        Editor.prototype.updateEmbed = function() {
            var center = this.map.getCenter().wrap();
            var opts = ['attribution'];
            $('.embed-option').each(function() {
                if (this.checked) opts.push(this.id);
            });

            var baseurl = (this.tilejson.webpage) ? this.tilejson.webpage.split('/v3/')[0] : '';
            var url = baseurl + '/v3/' + this.model.id + '/' + opts.join(',') + '.html';
            var iframe = "<iframe width='100%' height='500px' frameBorder='0' src='" + url + "'></iframe>";
            $('#map-embed').val(iframe);
            $('#js-clipboard-embed').attr('data-clipboard-text', iframe);
        };

        Editor.prototype.render = function() {
            $('#project input[name=name]').val(this.model.get('name'));
            $('#project textarea[name=description]').val(this.model.get('description'));
            $('#project input[name=private]').attr('checked', !!this.model.get('private'));

            // If project is new, set center by default
            if(!this.model.get('_rev')) {
                $('#save-center').prop('checked', true);
                this.changed();
            }

            this.dropzone = this.$el.find('#dropzone');
            this.renderName(this.model, this.model.get('name'));
            this.renderID(this.model, this.model.id);
        };

        Editor.prototype.redraw = function() {
            if (!this.map) return;
            var layers = this.model.attributes.layers;
            if (layers.length > 15) {
                Views.modal.show('err', new Error('Your project exceeds the max layer limit of 15.'));
                layers = layers.slice(0,15);
            }
            var updated = '?update=' + (+new Date()).toString(36).substr(0,5);
            this.tilejson.tiles = [App.tileApi + '/v3/' + layers.join(',') + '/{z}/{x}/{y}.png' + updated];
            this.map.tileLayer._setTileJSON(this.tilejson);
            this.map.tileLayer.redraw();

            // Model attributes have been updated.
            this.changed();

            // Clear out stale values.
            var view = this;
            delete this.tilejson.grids;
            delete this.tilejson.legend;
            delete this.tilejson.attribution;
            if (this.map.gridLayer) {
                this.map.removeLayer(this.map.gridLayer);
                delete this.map.gridLayer;
            }
            if (this.map.gridControl) {
                this.map.removeControl(this.map.gridControl);
                delete this.map.gridControl;
            }
            if (this.map.legendControl) _(this.map.legendControl._legends).each(function(i,t) {
                view.map.legendControl.removeLegend(t);
            });

            App.tilejson(layers.join(','), function(err, json) {
                if (err) return;

                // Update min/max/bounds of tileLayer.
                view.tilejson.minzoom = json.minzoom;
                view.tilejson.maxzoom = json.maxzoom;
                view.tilejson.bounds = json.bounds;
                view.map.tileLayer.options.minZoom = json.minzoom;
                view.map.tileLayer.options.maxZoom = json.maxzoom;
                view.map.tileLayer.options.bounds = new L.LatLngBounds(
                    new L.LatLng(json.bounds[1], json.bounds[0]),
                    new L.LatLng(json.bounds[3], json.bounds[2])
                );
                view.map._updateZoomLevels();
                // Update grids/templates.
                if (json.template) {
                    view.tilejson.grids = [App.tileApi + '/v3/' + layers.join(',') + '/{z}/{x}/{y}.grid.json' + updated];
                    view.map.gridLayer = L.mapbox.gridLayer({
                        grids: view.tilejson.grids,
                        minzoom: json.minzoom,
                        maxzoom: json.maxzoom
                    });
                    view.map.addLayer(view.map.gridLayer);
                    view.map.gridControl = L.mapbox.gridControl(view.map.gridLayer, {template:json.template});
                    view.map.addControl(view.map.gridControl);
                }
                // Update legend.
                if (json.legend) {
                    view.tilejson.legend = json.legend;
                    view.map.legendControl.addLegend(json.legend);
                }
                // Update attribution.
                if (json.attribution) {
                    view.tilejson.attribution = json.attribution;
                }
                view.changed();
            });
        };

        function updateAvatar() {
            if (App.user && App.user.avatar) {
                $('#avatar').removeClass('big mapbox');
                $('#avatar').css('background-image', 'url("' + App.user.avatar + '")');
                $('#avatar').css('background-size', 'cover');
            } else {
                $('#avatar').addClass('big mapbox');
            }
        }

        function hashChange() {
            if (window.location.hash === '#search') $('#search input').focus();
        }

        Editor.prototype.initialize = function(options) {
            if (!this.model) throw new Error('Editor requires loaded model instance');
            if (!options.tilejson) throw new Error('Editor requires loaded tilejson object');

            this.tilejson = options.tilejson;

            if (window.location.hash === '#welcome') window.welcomeFlow = true;

            updateAvatar();

            App.on('fetch', function(model) {
                updateAvatar();
            });

            this.redraw = _(this.redraw).bind(this);
            this.changed = _(this.changed).bind(this);
            this.model.on('change', _(this.changed).throttle(50));
            this.model.on('change:id', _(_.bind(this.renderID, this)).throttle(50));
            this.model.on('change:name', _(this.renderName).throttle(50));
            this.model.on('change:layers', _(this.redraw).throttle(500));

            this.render();

            var editor = this;

            // Omit the data key when instantiating the map.
            // Markers are loaded separately from the API by the marker module.
            var map = L.mapbox.map('map-app', _(this.tilejson).omit('data'), {
                zoomControl: false
            });
            this.map = map;

            var style = Style(App, editor);
            var markers = Markers(App, editor);
            var layers = Layers(App, map, editor);
            var draw = Draw(App, markers, editor);
            var search = Geocoder(editor, map, draw);
            var info = Info(editor, map, markers);
            // var geojsonPanel = GeoJSON(App, map, markers, editor);
            // this.geojsonPanel = geojsonPanel;

            this.style = style;
            this.markers = markers;
            this.search = search;
            this.layers = layers;
            this.draw = draw;
            this.info = info;

            // Display map coordinates
            this.map.on('move', this.displayView);
            this.map.on('moveend', _.bind(this.updateEmbed, this));

            // Global zoom handler
            this.map.on('zoomend', this.zoomToggle);

            // Global onhashchange handler. Calls module onhashchange handlers if set.
            if ('onhashchange' in window) window.onhashchange = function() {
                if (markers && markers.onhashchange) markers.onhashchange();
                if (draw && draw.onhashchange) draw.onhashchange();
                hashChange();
            };

            // Set initial mapview values
            this.displayView.call(this.map);

            // Project Info
            info.render();

            // Global onunload handler.
            if ('onbeforeunload' in window && !App.param('dev')) window.onbeforeunload = function() {
                if (editor.changes) return editor.model.escape('name') + ' has unsaved changes.';
            };

            // Show help if not hidden.
            var hideHelp = App.storage('editor.help');
            if (!hideHelp) this.helpToggle();
            bindClipboard();
            this.updateEmbed();
            return this;
        };

        function bindClipboard() {
            $('.js-clipboard').each(function() {
                var $clip = $(this);
                if (!$clip.data('zeroclipboard-bound')) {
                    var clip = new ZeroClipboard(this);
                    $clip.data('zeroclipboard-bound', true);
                    clip.on('complete', function() {
                        var $this = $(this);
                        $this.siblings('input').select();
                        $this.addClass('clipped');
                        setTimeout(function() {
                            $this.removeClass('clipped');
                        }, 1000);
                    });
                }
            });
        }

        $(function load() {
            if (Views.editor) return;
            if (!window.location.hash && !$('#splash').size()) window.location.hash = '#app';

            var mapid = App.param('id')||'api.tmpmap';
            var newmap = '?newmap=1';
            if (App.param('preset')) newmap += '&preset=' + App.param('preset');
            if (App.param('layers')) newmap += '&layers=' + App.param('layers');
            if (App.param('id')) App.storage('map.id', App.param('id'));

            Views.editor = true;
            (function getdata(opts) {
                if (!opts.model) {
                    App.fetch('/api/Map/' + mapid + newmap, function(err, model) {
                        if (!err && model.get('_type') !== 'composite') {
                            err = new Error('Cannot edit project ' + model.escape('id'));
                        }
                        if (err) return Views.modal.show('err', err);
                        opts.model = model;
                        getdata(opts);
                    });
                } else if (!opts.tilejson) {
                    App.tilejson(opts.model.get('layers').slice(0,15).join(','), function(err, tilejson) {
                        if (err) return Views.modal.show('err', err);
                        opts.tilejson = tilejson;
                        // tilestream-pro#3591
                        if (tilejson === undefined) tilejson.minzoom = 0;
                        if (tilejson === undefined) tilejson.maxzoom = 19;
                        tilejson.center = opts.model.get('center') || tilejson.center;
                        getdata(opts);
                    });
                } else if (!App.param('layers') && !opts.model.get('_rev') && !opts.local) {
                    App.local(function(err, local) {
                        opts.local = local || opts.model.get('center');
                        opts.model.set({center:opts.local});
                        getdata(opts);
                    });
                } else {
                    opts.el = $('body');
                    Views.editor = new Editor(opts);
                }
            })({});
        });

    })();

},{"./src/draw":10,"./src/drop":11,"./src/geocoder":12,"./src/info":13,"./src/layers":14,"./src/lib/color":15,"./src/lib/inputincrement":20,"./src/lib/pager":22,"./src/lib/zoom":25,"./src/markers":26,"./src/style":27,"fs":29}],2:[function(require,module,exports){
    var dsv = require('dsv'),
        sexagesimal = require('sexagesimal');

    function isLat(f) { return !!f.match(/(Lat)(itude)?/gi); }
    function isLon(f) { return !!f.match(/(L)(on|ng)(gitude)?/i); }

    function keyCount(o) {
        return (typeof o == 'object') ? Object.keys(o).length : 0;
    }

    function autoDelimiter(x) {
        var delimiters = [',', ';', '\t', '|'];
        var results = [];

        delimiters.forEach(function(delimiter) {
            var res = dsv(delimiter).parse(x);
            if (res.length >= 1) {
                var count = keyCount(res[0]);
                for (var i = 0; i < res.length; i++) {
                    if (keyCount(res[i]) !== count) return;
                }
                results.push({
                    delimiter: delimiter,
                    arity: Object.keys(res[0]).length,
                });
            }
        });

        if (results.length) {
            return results.sort(function(a, b) {
                return b.arity - a.arity;
            })[0].delimiter;
        } else {
            return null;
        }
    }

    function auto(x) {
        var delimiter = autoDelimiter(x);
        if (!delimiter) return null;
        return dsv(delimiter).parse(x);
    }

    function csv2geojson(x, options, callback) {

        if (!callback) {
            callback = options;
            options = {};
        }

        options.delimiter = options.delimiter || ',';

        var latfield = options.latfield || '',
            lonfield = options.lonfield || '';

        var features = [],
            featurecollection = { type: 'FeatureCollection', features: features };

        if (options.delimiter === 'auto' && typeof x == 'string') {
            options.delimiter = autoDelimiter(x);
            if (!options.delimiter) return callback({
                type: 'Error',
                message: 'Could not autodetect delimiter'
            });
        }

        var parsed = (typeof x == 'string') ? dsv(options.delimiter).parse(x) : x;

        if (!parsed.length) return callback(null, featurecollection);

        if (!latfield || !lonfield) {
            for (var f in parsed[0]) {
                if (!latfield && isLat(f)) latfield = f;
                if (!lonfield && isLon(f)) lonfield = f;
            }
            if (!latfield || !lonfield) {
                var fields = [];
                for (var k in parsed[0]) fields.push(k);
                return callback({
                    type: 'Error',
                    message: 'Latitude and longitude fields not present',
                    data: parsed,
                    fields: fields
                });
            }
        }

        var errors = [];

        for (var i = 0; i < parsed.length; i++) {
            if (parsed[i][lonfield] !== undefined &&
                parsed[i][lonfield] !== undefined) {

                var lonk = parsed[i][lonfield],
                    latk = parsed[i][latfield],
                    lonf, latf,
                    a;

                a = sexagesimal(lonk, 'EW');
                if (a) lonk = a;
                a = sexagesimal(latk, 'NS');
                if (a) latk = a;

                lonf = parseFloat(lonk);
                latf = parseFloat(latk);

                if (isNaN(lonf) ||
                    isNaN(latf)) {
                    errors.push({
                        message: 'A row contained an invalid value for latitude or longitude',
                        row: parsed[i]
                    });
                } else {
                    if (!options.includeLatLon) {
                        delete parsed[i][lonfield];
                        delete parsed[i][latfield];
                    }

                    features.push({
                        type: 'Feature',
                        properties: parsed[i],
                        geometry: {
                            type: 'Point',
                            coordinates: [
                                parseFloat(lonf),
                                parseFloat(latf)
                            ]
                        }
                    });
                }
            }
        }

        callback(errors.length ? errors: null, featurecollection);
    }

    function toLine(gj) {
        var features = gj.features;
        var line = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        };
        for (var i = 0; i < features.length; i++) {
            line.geometry.coordinates.push(features[i].geometry.coordinates);
        }
        line.properties = features[0].properties;
        return {
            type: 'FeatureCollection',
            features: [line]
        };
    }

    function toPolygon(gj) {
        var features = gj.features;
        var poly = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [[]]
            }
        };
        for (var i = 0; i < features.length; i++) {
            poly.geometry.coordinates[0].push(features[i].geometry.coordinates);
        }
        poly.properties = features[0].properties;
        return {
            type: 'FeatureCollection',
            features: [poly]
        };
    }

    module.exports = {
        isLon: isLon,
        isLat: isLat,
        csv: dsv.csv.parse,
        tsv: dsv.tsv.parse,
        dsv: dsv,
        auto: auto,
        csv2geojson: csv2geojson,
        toLine: toLine,
        toPolygon: toPolygon
    };

},{"dsv":3,"sexagesimal":4}],3:[function(require,module,exports){
    var fs = require("fs");

    module.exports = new Function("dsv.version = \"0.0.3\";\n\ndsv.tsv = dsv(\"\\t\");\ndsv.csv = dsv(\",\");\n\nfunction dsv(delimiter) {\n  var dsv = {},\n      reFormat = new RegExp(\"[\\\"\" + delimiter + \"\\n]\"),\n      delimiterCode = delimiter.charCodeAt(0);\n\n  dsv.parse = function(text, f) {\n    var o;\n    return dsv.parseRows(text, function(row, i) {\n      if (o) return o(row, i - 1);\n      var a = new Function(\"d\", \"return {\" + row.map(function(name, i) {\n        return JSON.stringify(name) + \": d[\" + i + \"]\";\n      }).join(\",\") + \"}\");\n      o = f ? function(row, i) { return f(a(row), i); } : a;\n    });\n  };\n\n  dsv.parseRows = function(text, f) {\n    var EOL = {}, // sentinel value for end-of-line\n        EOF = {}, // sentinel value for end-of-file\n        rows = [], // output rows\n        N = text.length,\n        I = 0, // current character index\n        n = 0, // the current line number\n        t, // the current token\n        eol; // is the current token followed by EOL?\n\n    function token() {\n      if (I >= N) return EOF; // special case: end of file\n      if (eol) return eol = false, EOL; // special case: end of line\n\n      // special case: quotes\n      var j = I;\n      if (text.charCodeAt(j) === 34) {\n        var i = j;\n        while (i++ < N) {\n          if (text.charCodeAt(i) === 34) {\n            if (text.charCodeAt(i + 1) !== 34) break;\n            ++i;\n          }\n        }\n        I = i + 2;\n        var c = text.charCodeAt(i + 1);\n        if (c === 13) {\n          eol = true;\n          if (text.charCodeAt(i + 2) === 10) ++I;\n        } else if (c === 10) {\n          eol = true;\n        }\n        return text.substring(j + 1, i).replace(/\"\"/g, \"\\\"\");\n      }\n\n      // common case: find next delimiter or newline\n      while (I < N) {\n        var c = text.charCodeAt(I++), k = 1;\n        if (c === 10) eol = true; // \\n\n        else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \\r|\\r\\n\n        else if (c !== delimiterCode) continue;\n        return text.substring(j, I - k);\n      }\n\n      // special case: last token before EOF\n      return text.substring(j);\n    }\n\n    while ((t = token()) !== EOF) {\n      var a = [];\n      while (t !== EOL && t !== EOF) {\n        a.push(t);\n        t = token();\n      }\n      if (f && !(a = f(a, n++))) continue;\n      rows.push(a);\n    }\n\n    return rows;\n  };\n\n  dsv.format = function(rows) {\n    if (Array.isArray(rows[0])) return dsv.formatRows(rows); // deprecated; use formatRows\n    var fieldSet = {}, fields = [];\n\n    // Compute unique fields in order of discovery.\n    rows.forEach(function(row) {\n      for (var field in row) {\n        if (!(field in fieldSet)) {\n          fields.push(fieldSet[field] = field);\n        }\n      }\n    });\n\n    return [fields.map(formatValue).join(delimiter)].concat(rows.map(function(row) {\n      return fields.map(function(field) {\n        return formatValue(row[field]);\n      }).join(delimiter);\n    })).join(\"\\n\");\n  };\n\n  dsv.formatRows = function(rows) {\n    return rows.map(formatRow).join(\"\\n\");\n  };\n\n  function formatRow(row) {\n    return row.map(formatValue).join(delimiter);\n  }\n\n  function formatValue(text) {\n    return reFormat.test(text) ? \"\\\"\" + text.replace(/\\\"/g, \"\\\"\\\"\") + \"\\\"\" : text;\n  }\n\n  return dsv;\n}\n" + ";return dsv")();

},{"fs":29}],4:[function(require,module,exports){
    module.exports = function(x, dims) {
        if (!dims) dims = 'NSEW';
        if (typeof x !== 'string') return null;
        var r = /^([0-9.]+)°? *(?:([0-9.]+)['’′‘] *)?(?:([0-9.]+)(?:''|"|”|″) *)?([NSEW])?/,
            m = x.match(r);
        if (!m) return null;
        else if (m[4] && dims.indexOf(m[4]) === -1) return null;
        else return (((m[1]) ? parseFloat(m[1]) : 0) +
                ((m[2] ? parseFloat(m[2]) / 60 : 0)) +
                ((m[3] ? parseFloat(m[3]) / 3600 : 0))) *
                ((m[4] && m[4] === 'S' || m[4] === 'W') ? -1 : 1);
    };

},{}],5:[function(require,module,exports){
    module.exports = flatten;

    function flatten(gj, up) {
        switch ((gj && gj.type) || null) {
            case 'FeatureCollection':
                gj.features = gj.features.reduce(function(mem, feature) {
                    return mem.concat(flatten(feature));
                }, []);
                return gj;
            case 'Feature':
                return flatten(gj.geometry).map(function(geom) {
                    return {
                        type: 'Feature',
                        properties: JSON.parse(JSON.stringify(gj.properties)),
                        geometry: geom
                    };
                });
            case 'MultiPoint':
                return gj.coordinates.map(function(_) {
                    return { type: 'Point', coordinates: _ };
                });
            case 'MultiPolygon':
                return gj.coordinates.map(function(_) {
                    return { type: 'Polygon', coordinates: _ };
                });
            case 'MultiLineString':
                return gj.coordinates.map(function(_) {
                    return { type: 'LineString', coordinates: _ };
                });
            case 'GeometryCollection':
                return gj.geometries;
            case 'Point':
            case 'Polygon':
            case 'LineString':
                return [gj];
            default:
                return gj;
        }
    }

},{}],6:[function(require,module,exports){
    var jsonlint = require('jsonlint-lines');

    function hint(str) {

        var errors = [], gj;

        function root(_) {
            if (!_.type) {
                errors.push({
                    message: 'The type property is required and was not found',
                    line: _.__line__
                });
            } else if (!types[_.type]) {
                errors.push({
                    message: 'The type ' + _.type + ' is unknown',
                    line: _.__line__
                });
            } else if (_) {
                types[_.type](_);
            }
        }

        function everyIs(_, type) {
            // make a single exception because typeof null === 'object'
            return _.every(function(x) { return (x !== null) && (typeof x === type); });
        }

        function requiredProperty(_, name, type) {
            if (typeof _[name] == 'undefined') {
                return errors.push({
                    message: '"' + name + '" property required',
                    line: _.__line__
                });
            } else if (type === 'array') {
                if (!Array.isArray(_[name])) {
                    return errors.push({
                        message: '"' + name +
                            '" property should be an array, but is an ' +
                            (typeof _[name]) + ' instead',
                        line: _.__line__
                    });
                }
            } else if (type && typeof _[name] !== type) {
                return errors.push({
                    message: '"' + name +
                        '" property should be ' + (type) +
                        ', but is an ' + (typeof _[name]) + ' instead',
                    line: _.__line__
                });
            }
        }

        // http://geojson.org/geojson-spec.html#feature-collection-objects
        function FeatureCollection(_) {
            crs(_);
            bbox(_);
            if (!requiredProperty(_, 'features', 'array')) {
                if (!everyIs(_.features, 'object')) {
                    return errors.push({
                        message: 'Every feature must be an object',
                        line: _.__line__
                    });
                }
                _.features.forEach(Feature);
            }
        }

        // http://geojson.org/geojson-spec.html#positions
        function position(_, line) {
            if (!Array.isArray(_)) {
                return errors.push({
                    message: 'position should be an array, is a ' + (typeof _) +
                        ' instead',
                    line: _.__line__ || line
                });
            } else {
                if (_.length < 2) {
                    return errors.push({
                        message: 'position must have 2 or more elements',
                        line: _.__line__ || line
                    });
                }
                if (!everyIs(_, 'number')) {
                    return errors.push({
                        message: 'each element in a position must be a number',
                        line: _.__line__ || line
                    });
                }
            }
        }

        function positionArray(coords, type, depth, line) {
            if (line === undefined && coords.__line__ !== undefined) {
                line = coords.__line__;
            }
            if (depth === 0) {
                return position(coords, line);
            } else {
                if (depth === 1 && type) {
                    if (type === 'LinearRing') {
                        if (coords.length < 4) {
                            errors.push({
                                message: 'a LinearRing of coordinates needs to have four or more positions',
                                line: line
                            });
                        }
                        if (coords.length &&
                            (coords[coords.length - 1].length !== coords[0].length ||
                                !coords[coords.length - 1].every(function(position, index) {
                                    return coords[0][index] === position;
                                }))) {
                            errors.push({
                                message: 'the first and last positions in a LinearRing of coordinates must be the same',
                                line: line
                            });
                        }
                    } else if (type === 'Line' && coords.length < 2) {
                        errors.push({
                            message: 'a line needs to have two or more coordinates to be valid',
                            line: line
                        });
                    }
                }
                if (!Array.isArray(coords)) {
                    return errors.push({
                        message: 'coordinates must be list of positions',
                        line: line
                    });
                }
                coords.forEach(function(c) {
                    positionArray(c, type, depth - 1, c.__line__ || line);
                });
            }
        }

        function crs(_) {
            if (!_.crs) return;
            if (typeof _.crs === 'object') {
                var strErr = requiredProperty(_.crs, 'type', 'string'),
                    propErr = requiredProperty(_.crs, 'properties', 'object');
                if (!strErr && !propErr) {
                    // http://geojson.org/geojson-spec.html#named-crs
                    if (_.crs.type == 'name') {
                        requiredProperty(_.crs.properties, 'name', 'string');
                    } else if (_.crs.type == 'link') {
                        requiredProperty(_.crs.properties, 'href', 'string');
                    }
                }
            } else {
                errors.push({
                    message: 'the value of the crs property must be an object, not a ' + (typeof _.crs),
                    line: _.__line__
                });
            }
        }

        function bbox(_) {
            if (!_.bbox) return;
            if (Array.isArray(_.bbox)) {
                if (!everyIs(_.bbox, 'number')) {
                    return errors.push({
                        message: 'each element in a bbox property must be a number',
                        line: _.bbox.__line__
                    });
                }
            } else {
                errors.push({
                    message: 'bbox property must be an array of numbers, but is a ' + (typeof _.bbox),
                    line: _.__line__
                });
            }
        }

        // http://geojson.org/geojson-spec.html#point
        function Point(_) {
            crs(_);
            bbox(_);
            if (!requiredProperty(_, 'coordinates', 'array')) {
                position(_.coordinates);
            }
        }

        // http://geojson.org/geojson-spec.html#polygon
        function Polygon(_) {
            crs(_);
            bbox(_);
            if (!requiredProperty(_, 'coordinates', 'array')) {
                positionArray(_.coordinates, 'LinearRing', 2);
            }
        }

        // http://geojson.org/geojson-spec.html#multipolygon
        function MultiPolygon(_) {
            crs(_);
            bbox(_);
            if (!requiredProperty(_, 'coordinates', 'array')) {
                positionArray(_.coordinates, 'LinearRing', 3);
            }
        }

        // http://geojson.org/geojson-spec.html#linestring
        function LineString(_) {
            crs(_);
            bbox(_);
            if (!requiredProperty(_, 'coordinates', 'array')) {
                positionArray(_.coordinates, 'Line', 1);
            }
        }

        // http://geojson.org/geojson-spec.html#multilinestring
        function MultiLineString(_) {
            crs(_);
            bbox(_);
            if (!requiredProperty(_, 'coordinates', 'array')) {
                positionArray(_.coordinates, 'Line', 2);
            }
        }

        // http://geojson.org/geojson-spec.html#multipoint
        function MultiPoint(_) {
            crs(_);
            bbox(_);
            if (!requiredProperty(_, 'coordinates', 'array')) {
                positionArray(_.coordinates, '', 1);
            }
        }

        function GeometryCollection(_) {
            crs(_);
            bbox(_);
            if (!requiredProperty(_, 'geometries', 'array')) {
                _.geometries.forEach(function(geometry) {
                    if (geometry) root(geometry);
                });
            }
        }

        function Feature(_) {
            crs(_);
            bbox(_);
            if (_.type !== 'Feature') {
                errors.push({
                    message: 'GeoJSON features must have a type=feature property',
                    line: _.__line__
                });
            }
            requiredProperty(_, 'properties', 'object');
            if (!requiredProperty(_, 'geometry', 'object')) {
                // http://geojson.org/geojson-spec.html#feature-objects
                // tolerate null geometry
                if (_.geometry) root(_.geometry);
            }
        }

        var types = {
            Point: Point,
            Feature: Feature,
            MultiPoint: MultiPoint,
            LineString: LineString,
            MultiLineString: MultiLineString,
            FeatureCollection: FeatureCollection,
            GeometryCollection: GeometryCollection,
            Polygon: Polygon,
            MultiPolygon: MultiPolygon
        };

        if (typeof str !== 'string') {
            return [{
                message: 'Expected string input',
                line: 0
            }];
        }

        try {
            gj = jsonlint.parse(str);
        } catch(e) {
            var match = e.message.match(/line (\d+)/),
                lineNumber = 0;
            if (match) lineNumber = parseInt(match[1], 10);
            return [{
                line: lineNumber - 1,
                message: e.message,
                error: e
            }];
        }

        if (typeof gj !== 'object' ||
            gj === null ||
            gj === undefined) {
            errors.push({
                message: 'The root of a GeoJSON object must be an object.',
                line: 0
            });
            return errors;
        }

        root(gj);

        return errors;
    }

    module.exports.hint = hint;

},{"jsonlint-lines":7}],7:[function(require,module,exports){
    var process=require("__browserify_process");/* parser generated by jison 0.4.6 */
    /*
     Returns a Parser object of the following structure:

     Parser: {
     yy: {}
     }

     Parser.prototype: {
     yy: {},
     trace: function(),
     symbols_: {associative list: name ==> number},
     terminals_: {associative list: number ==> name},
     productions_: [...],
     performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
     table: [...],
     defaultActions: {...},
     parseError: function(str, hash),
     parse: function(input),

     lexer: {
     EOF: 1,
     parseError: function(str, hash),
     setInput: function(input),
     input: function(),
     unput: function(str),
     more: function(),
     less: function(n),
     pastInput: function(),
     upcomingInput: function(),
     showPosition: function(),
     test_match: function(regex_match_array, rule_index),
     next: function(),
     lex: function(),
     begin: function(condition),
     popState: function(),
     _currentRules: function(),
     topState: function(),
     pushState: function(condition),

     options: {
     ranges: boolean           (optional: true ==> token location info will include a .range[] member)
     flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
     backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
     },

     performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
     rules: [...],
     conditions: {associative list: name ==> set},
     }
     }


     token location info (@$, _$, etc.): {
     first_line: n,
     last_line: n,
     first_column: n,
     last_column: n,
     range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
     }


     the parseError function receives a 'hash' object with these members for lexer and parser errors: {
     text:        (matched text)
     token:       (the produced terminal token, if any)
     line:        (yylineno)
     }
     while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
     loc:         (yylloc)
     expected:    (string describing the set of expected tokens)
     recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
     }
     */
    var jsonlint = (function(){
        var parser = {trace: function trace() { },
            yy: {},
            symbols_: {"error":2,"JSONString":3,"STRING":4,"JSONNumber":5,"NUMBER":6,"JSONNullLiteral":7,"NULL":8,"JSONBooleanLiteral":9,"TRUE":10,"FALSE":11,"JSONText":12,"JSONValue":13,"EOF":14,"JSONObject":15,"JSONArray":16,"{":17,"}":18,"JSONMemberList":19,"JSONMember":20,":":21,",":22,"[":23,"]":24,"JSONElementList":25,"$accept":0,"$end":1},
            terminals_: {2:"error",4:"STRING",6:"NUMBER",8:"NULL",10:"TRUE",11:"FALSE",14:"EOF",17:"{",18:"}",21:":",22:",",23:"[",24:"]"},
            productions_: [0,[3,1],[5,1],[7,1],[9,1],[9,1],[12,2],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[15,2],[15,3],[20,3],[19,1],[19,3],[16,2],[16,3],[25,1],[25,3]],
            performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
                /* this == yyval */

                var $0 = $$.length - 1;
                switch (yystate) {
                    case 1: // replace escaped characters with actual character
                        this.$ = yytext.replace(/\\(\\|")/g, "$"+"1")
                            .replace(/\\n/g,'\n')
                            .replace(/\\r/g,'\r')
                            .replace(/\\t/g,'\t')
                            .replace(/\\v/g,'\v')
                            .replace(/\\f/g,'\f')
                            .replace(/\\b/g,'\b');

                        break;
                    case 2:this.$ = Number(yytext);
                        break;
                    case 3:this.$ = null;
                        break;
                    case 4:this.$ = true;
                        break;
                    case 5:this.$ = false;
                        break;
                    case 6:return this.$ = $$[$0-1];
                        break;
                    case 13:this.$ = {}; Object.defineProperty(this.$, '__line__', {
                        value: this._$.first_line,
                        enumerable: false
                    })
                        break;
                    case 14:this.$ = $$[$0-1]; Object.defineProperty(this.$, '__line__', {
                        value: this._$.first_line,
                        enumerable: false
                    })
                        break;
                    case 15:this.$ = [$$[$0-2], $$[$0]];
                        break;
                    case 16:this.$ = {}; this.$[$$[$0][0]] = $$[$0][1];
                        break;
                    case 17:this.$ = $$[$0-2]; $$[$0-2][$$[$0][0]] = $$[$0][1];
                        break;
                    case 18:this.$ = []; Object.defineProperty(this.$, '__line__', {
                        value: this._$.first_line,
                        enumerable: false
                    })
                        break;
                    case 19:this.$ = $$[$0-1]; Object.defineProperty(this.$, '__line__', {
                        value: this._$.first_line,
                        enumerable: false
                    })
                        break;
                    case 20:this.$ = [$$[$0]];
                        break;
                    case 21:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
                        break;
                }
            },
            table: [{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],12:1,13:2,15:7,16:8,17:[1,14],23:[1,15]},{1:[3]},{14:[1,16]},{14:[2,7],18:[2,7],22:[2,7],24:[2,7]},{14:[2,8],18:[2,8],22:[2,8],24:[2,8]},{14:[2,9],18:[2,9],22:[2,9],24:[2,9]},{14:[2,10],18:[2,10],22:[2,10],24:[2,10]},{14:[2,11],18:[2,11],22:[2,11],24:[2,11]},{14:[2,12],18:[2,12],22:[2,12],24:[2,12]},{14:[2,3],18:[2,3],22:[2,3],24:[2,3]},{14:[2,4],18:[2,4],22:[2,4],24:[2,4]},{14:[2,5],18:[2,5],22:[2,5],24:[2,5]},{14:[2,1],18:[2,1],21:[2,1],22:[2,1],24:[2,1]},{14:[2,2],18:[2,2],22:[2,2],24:[2,2]},{3:20,4:[1,12],18:[1,17],19:18,20:19},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:23,15:7,16:8,17:[1,14],23:[1,15],24:[1,21],25:22},{1:[2,6]},{14:[2,13],18:[2,13],22:[2,13],24:[2,13]},{18:[1,24],22:[1,25]},{18:[2,16],22:[2,16]},{21:[1,26]},{14:[2,18],18:[2,18],22:[2,18],24:[2,18]},{22:[1,28],24:[1,27]},{22:[2,20],24:[2,20]},{14:[2,14],18:[2,14],22:[2,14],24:[2,14]},{3:20,4:[1,12],20:29},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:30,15:7,16:8,17:[1,14],23:[1,15]},{14:[2,19],18:[2,19],22:[2,19],24:[2,19]},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:31,15:7,16:8,17:[1,14],23:[1,15]},{18:[2,17],22:[2,17]},{18:[2,15],22:[2,15]},{22:[2,21],24:[2,21]}],
            defaultActions: {16:[2,6]},
            parseError: function parseError(str, hash) {
                if (hash.recoverable) {
                    this.trace(str);
                } else {
                    throw new Error(str);
                }
            },
            parse: function parse(input) {
                var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
                this.lexer.setInput(input);
                this.lexer.yy = this.yy;
                this.yy.lexer = this.lexer;
                this.yy.parser = this;
                if (typeof this.lexer.yylloc == 'undefined') {
                    this.lexer.yylloc = {};
                }
                var yyloc = this.lexer.yylloc;
                lstack.push(yyloc);
                var ranges = this.lexer.options && this.lexer.options.ranges;
                if (typeof this.yy.parseError === 'function') {
                    this.parseError = this.yy.parseError;
                } else {
                    this.parseError = Object.getPrototypeOf(this).parseError;
                }
                function popStack(n) {
                    stack.length = stack.length - 2 * n;
                    vstack.length = vstack.length - n;
                    lstack.length = lstack.length - n;
                }
                function lex() {
                    var token;
                    token = self.lexer.lex() || EOF;
                    if (typeof token !== 'number') {
                        token = self.symbols_[token] || token;
                    }
                    return token;
                }
                var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
                while (true) {
                    state = stack[stack.length - 1];
                    if (this.defaultActions[state]) {
                        action = this.defaultActions[state];
                    } else {
                        if (symbol === null || typeof symbol == 'undefined') {
                            symbol = lex();
                        }
                        action = table[state] && table[state][symbol];
                    }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                        var errStr = '';
                        expected = [];
                        for (p in table[state]) {
                            if (this.terminals_[p] && p > TERROR) {
                                expected.push('\'' + this.terminals_[p] + '\'');
                            }
                        }
                        if (this.lexer.showPosition) {
                            errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                        } else {
                            errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                        }
                        this.parseError(errStr, {
                            text: this.lexer.match,
                            token: this.terminals_[symbol] || symbol,
                            line: this.lexer.yylineno,
                            loc: yyloc,
                            expected: expected
                        });
                    }
                    if (action[0] instanceof Array && action.length > 1) {
                        throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
                    }
                    switch (action[0]) {
                        case 1:
                            stack.push(symbol);
                            vstack.push(this.lexer.yytext);
                            lstack.push(this.lexer.yylloc);
                            stack.push(action[1]);
                            symbol = null;
                            if (!preErrorSymbol) {
                                yyleng = this.lexer.yyleng;
                                yytext = this.lexer.yytext;
                                yylineno = this.lexer.yylineno;
                                yyloc = this.lexer.yylloc;
                                if (recovering > 0) {
                                    recovering--;
                                }
                            } else {
                                symbol = preErrorSymbol;
                                preErrorSymbol = null;
                            }
                            break;
                        case 2:
                            len = this.productions_[action[1]][1];
                            yyval.$ = vstack[vstack.length - len];
                            yyval._$ = {
                                first_line: lstack[lstack.length - (len || 1)].first_line,
                                last_line: lstack[lstack.length - 1].last_line,
                                first_column: lstack[lstack.length - (len || 1)].first_column,
                                last_column: lstack[lstack.length - 1].last_column
                            };
                            if (ranges) {
                                yyval._$.range = [
                                    lstack[lstack.length - (len || 1)].range[0],
                                    lstack[lstack.length - 1].range[1]
                                ];
                            }
                            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
                            if (typeof r !== 'undefined') {
                                return r;
                            }
                            if (len) {
                                stack = stack.slice(0, -1 * len * 2);
                                vstack = vstack.slice(0, -1 * len);
                                lstack = lstack.slice(0, -1 * len);
                            }
                            stack.push(this.productions_[action[1]][0]);
                            vstack.push(yyval.$);
                            lstack.push(yyval._$);
                            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                            stack.push(newState);
                            break;
                        case 3:
                            return true;
                    }
                }
                return true;
            }};
        /* generated by jison-lex 0.2.1 */
        var lexer = (function(){
            var lexer = {

                EOF:1,

                parseError:function parseError(str, hash) {
                    if (this.yy.parser) {
                        this.yy.parser.parseError(str, hash);
                    } else {
                        throw new Error(str);
                    }
                },

// resets the lexer, sets new input
                setInput:function (input) {
                    this._input = input;
                    this._more = this._backtrack = this.done = false;
                    this.yylineno = this.yyleng = 0;
                    this.yytext = this.matched = this.match = '';
                    this.conditionStack = ['INITIAL'];
                    this.yylloc = {
                        first_line: 1,
                        first_column: 0,
                        last_line: 1,
                        last_column: 0
                    };
                    if (this.options.ranges) {
                        this.yylloc.range = [0,0];
                    }
                    this.offset = 0;
                    return this;
                },

// consumes and returns one char from the input
                input:function () {
                    var ch = this._input[0];
                    this.yytext += ch;
                    this.yyleng++;
                    this.offset++;
                    this.match += ch;
                    this.matched += ch;
                    var lines = ch.match(/(?:\r\n?|\n).*/g);
                    if (lines) {
                        this.yylineno++;
                        this.yylloc.last_line++;
                    } else {
                        this.yylloc.last_column++;
                    }
                    if (this.options.ranges) {
                        this.yylloc.range[1]++;
                    }

                    this._input = this._input.slice(1);
                    return ch;
                },

// unshifts one char (or a string) into the input
                unput:function (ch) {
                    var len = ch.length;
                    var lines = ch.split(/(?:\r\n?|\n)/g);

                    this._input = ch + this._input;
                    this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                    //this.yyleng -= len;
                    this.offset -= len;
                    var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                    this.match = this.match.substr(0, this.match.length - 1);
                    this.matched = this.matched.substr(0, this.matched.length - 1);

                    if (lines.length - 1) {
                        this.yylineno -= lines.length - 1;
                    }
                    var r = this.yylloc.range;

                    this.yylloc = {
                        first_line: this.yylloc.first_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.first_column,
                        last_column: lines ?
                            (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                                + oldLines[oldLines.length - lines.length].length - lines[0].length :
                            this.yylloc.first_column - len
                    };

                    if (this.options.ranges) {
                        this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                    }
                    this.yyleng = this.yytext.length;
                    return this;
                },

// When called from action, caches matched text and appends it on next action
                more:function () {
                    this._more = true;
                    return this;
                },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
                reject:function () {
                    if (this.options.backtrack_lexer) {
                        this._backtrack = true;
                    } else {
                        return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                            text: "",
                            token: null,
                            line: this.yylineno
                        });

                    }
                    return this;
                },

// retain first n characters of the match
                less:function (n) {
                    this.unput(this.match.slice(n));
                },

// displays already matched input, i.e. for error messages
                pastInput:function () {
                    var past = this.matched.substr(0, this.matched.length - this.match.length);
                    return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
                },

// displays upcoming input, i.e. for error messages
                upcomingInput:function () {
                    var next = this.match;
                    if (next.length < 20) {
                        next += this._input.substr(0, 20-next.length);
                    }
                    return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
                },

// displays the character position where the lexing error occurred, i.e. for error messages
                showPosition:function () {
                    var pre = this.pastInput();
                    var c = new Array(pre.length + 1).join("-");
                    return pre + this.upcomingInput() + "\n" + c + "^";
                },

// test the lexed token: return FALSE when not a match, otherwise return token
                test_match:function (match, indexed_rule) {
                    var token,
                        lines,
                        backup;

                    if (this.options.backtrack_lexer) {
                        // save context
                        backup = {
                            yylineno: this.yylineno,
                            yylloc: {
                                first_line: this.yylloc.first_line,
                                last_line: this.last_line,
                                first_column: this.yylloc.first_column,
                                last_column: this.yylloc.last_column
                            },
                            yytext: this.yytext,
                            match: this.match,
                            matches: this.matches,
                            matched: this.matched,
                            yyleng: this.yyleng,
                            offset: this.offset,
                            _more: this._more,
                            _input: this._input,
                            yy: this.yy,
                            conditionStack: this.conditionStack.slice(0),
                            done: this.done
                        };
                        if (this.options.ranges) {
                            backup.yylloc.range = this.yylloc.range.slice(0);
                        }
                    }

                    lines = match[0].match(/(?:\r\n?|\n).*/g);
                    if (lines) {
                        this.yylineno += lines.length;
                    }
                    this.yylloc = {
                        first_line: this.yylloc.last_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.last_column,
                        last_column: lines ?
                            lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                            this.yylloc.last_column + match[0].length
                    };
                    this.yytext += match[0];
                    this.match += match[0];
                    this.matches = match;
                    this.yyleng = this.yytext.length;
                    if (this.options.ranges) {
                        this.yylloc.range = [this.offset, this.offset += this.yyleng];
                    }
                    this._more = false;
                    this._backtrack = false;
                    this._input = this._input.slice(match[0].length);
                    this.matched += match[0];
                    token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                    if (this.done && this._input) {
                        this.done = false;
                    }
                    if (token) {
                        return token;
                    } else if (this._backtrack) {
                        // recover context
                        for (var k in backup) {
                            this[k] = backup[k];
                        }
                        return false; // rule action called reject() implying the next rule should be tested instead.
                    }
                    return false;
                },

// return next match in input
                next:function () {
                    if (this.done) {
                        return this.EOF;
                    }
                    if (!this._input) {
                        this.done = true;
                    }

                    var token,
                        match,
                        tempMatch,
                        index;
                    if (!this._more) {
                        this.yytext = '';
                        this.match = '';
                    }
                    var rules = this._currentRules();
                    for (var i = 0; i < rules.length; i++) {
                        tempMatch = this._input.match(this.rules[rules[i]]);
                        if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                            match = tempMatch;
                            index = i;
                            if (this.options.backtrack_lexer) {
                                token = this.test_match(tempMatch, rules[i]);
                                if (token !== false) {
                                    return token;
                                } else if (this._backtrack) {
                                    match = false;
                                    continue; // rule action called reject() implying a rule MISmatch.
                                } else {
                                    // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                                    return false;
                                }
                            } else if (!this.options.flex) {
                                break;
                            }
                        }
                    }
                    if (match) {
                        token = this.test_match(match, rules[index]);
                        if (token !== false) {
                            return token;
                        }
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                    if (this._input === "") {
                        return this.EOF;
                    } else {
                        return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                            text: "",
                            token: null,
                            line: this.yylineno
                        });
                    }
                },

// return next match that has a token
                lex:function lex() {
                    var r = this.next();
                    if (r) {
                        return r;
                    } else {
                        return this.lex();
                    }
                },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
                begin:function begin(condition) {
                    this.conditionStack.push(condition);
                },

// pop the previously active lexer condition state off the condition stack
                popState:function popState() {
                    var n = this.conditionStack.length - 1;
                    if (n > 0) {
                        return this.conditionStack.pop();
                    } else {
                        return this.conditionStack[0];
                    }
                },

// produce the lexer rule set which is active for the currently active lexer condition state
                _currentRules:function _currentRules() {
                    if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                        return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                    } else {
                        return this.conditions["INITIAL"].rules;
                    }
                },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
                topState:function topState(n) {
                    n = this.conditionStack.length - 1 - Math.abs(n || 0);
                    if (n >= 0) {
                        return this.conditionStack[n];
                    } else {
                        return "INITIAL";
                    }
                },

// alias for begin(condition)
                pushState:function pushState(condition) {
                    this.begin(condition);
                },

// return the number of states currently on the stack
                stateStackSize:function stateStackSize() {
                    return this.conditionStack.length;
                },
                options: {},
                performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

                    var YYSTATE=YY_START;
                    switch($avoiding_name_collisions) {
                        case 0:/* skip whitespace */
                            break;
                        case 1:return 6
                            break;
                        case 2:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 4
                            break;
                        case 3:return 17
                            break;
                        case 4:return 18
                            break;
                        case 5:return 23
                            break;
                        case 6:return 24
                            break;
                        case 7:return 22
                            break;
                        case 8:return 21
                            break;
                        case 9:return 10
                            break;
                        case 10:return 11
                            break;
                        case 11:return 8
                            break;
                        case 12:return 14
                            break;
                        case 13:return 'INVALID'
                            break;
                    }
                },
                rules: [/^(?:\s+)/,/^(?:(-?([0-9]|[1-9][0-9]+))(\.[0-9]+)?([eE][-+]?[0-9]+)?\b)/,/^(?:"(?:\\[\\"bfnrt/]|\\u[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*")/,/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?::)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:null\b)/,/^(?:$)/,/^(?:.)/],
                conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"inclusive":true}}
            };
            return lexer;
        })();
        parser.lexer = lexer;
        function Parser () {
            this.yy = {};
        }
        Parser.prototype = parser;parser.Parser = Parser;
        return new Parser;
    })();


    if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
        exports.parser = jsonlint;
        exports.Parser = jsonlint.Parser;
        exports.parse = function () { return jsonlint.parse.apply(jsonlint, arguments); };
        exports.main = function commonjsMain(args) {
            if (!args[1]) {
                console.log('Usage: '+args[0]+' FILE');
                process.exit(1);
            }
            var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
            return exports.parser.parse(source);
        };
        if (typeof module !== 'undefined' && require.main === module) {
            exports.main(process.argv.slice(1));
        }
    }
},{"__browserify_process":33,"fs":29,"path":30}],8:[function(require,module,exports){
    module.exports = element;
    module.exports.pair = pair;

    function element(x, dims) {
        return search(x, dims).val;
    }

    function search(x, dims, r) {
        if (!dims) dims = 'NSEW';
        if (typeof x !== 'string') return { val: null, regex: r };
        r = r || /[\s\,]*([\-|\—|\―]?[0-9.]+)°? *(?:([0-9.]+)['’′‘] *)?(?:([0-9.]+)(?:''|"|”|″) *)?([NSEW])?/gi;
        var m = r.exec(x);
        if (!m) return { val: null, regex: r };
        else if (m[4] && dims.indexOf(m[4]) === -1) return { val: null, regex: r };
        else return {
                val: (((m[1]) ? parseFloat(m[1]) : 0) +
                    ((m[2] ? parseFloat(m[2]) / 60 : 0)) +
                    ((m[3] ? parseFloat(m[3]) / 3600 : 0))) *
                    ((m[4] && m[4] === 'S' || m[4] === 'W') ? -1 : 1),
                regex: r,
                raw: m[0],
                dim: m[4]
            };
    }

    function pair(x, dims) {
        x = x.trim();
        var one = search(x, dims);
        if (one.val === null) return null;
        var two = search(x, dims, one.regex);
        if (two.val === null) return null;
        // null if one/two are not contiguous.
        if (one.raw + two.raw !== x) return null;
        if (one.dim) return swapdim(one.val, two.val, one.dim);
        else return [one.val, two.val];
    }

    function swapdim(a, b, dim) {
        if (dim == 'N' || dim == 'S') return [a, b];
        if (dim == 'W' || dim == 'E') return [b, a];
    }

},{}],9:[function(require,module,exports){
    var process=require("__browserify_process");toGeoJSON = (function() {
        'use strict';

        var removeSpace = (/\s*/g),
            trimSpace = (/^\s*|\s*$/g),
            splitSpace = (/\s+/);
        // generate a short, numeric hash of a string
        function okhash(x) {
            if (!x || !x.length) return 0;
            for (var i = 0, h = 0; i < x.length; i++) {
                h = ((h << 5) - h) + x.charCodeAt(i) | 0;
            } return h;
        }
        // all Y children of X
        function get(x, y) { return x.getElementsByTagName(y); }
        function attr(x, y) { return x.getAttribute(y); }
        function attrf(x, y) { return parseFloat(attr(x, y)); }
        // one Y child of X, if any, otherwise null
        function get1(x, y) { var n = get(x, y); return n.length ? n[0] : null; }
        // https://developer.mozilla.org/en-US/docs/Web/API/Node.normalize
        function norm(el) { if (el.normalize) { el.normalize(); } return el; }
        // cast array x into numbers
        function numarray(x) {
            for (var j = 0, o = []; j < x.length; j++) o[j] = parseFloat(x[j]);
            return o;
        }
        function clean(x) {
            var o = {};
            for (var i in x) if (x[i]) o[i] = x[i];
            return o;
        }
        // get the content of a text node, if any
        function nodeVal(x) { if (x) {norm(x);} return x && x.firstChild && x.firstChild.nodeValue; }
        // get one coordinate from a coordinate array, if any
        function coord1(v) { return numarray(v.replace(removeSpace, '').split(',')); }
        // get all coordinates from a coordinate array as [[],[]]
        function coord(v) {
            var coords = v.replace(trimSpace, '').split(splitSpace),
                o = [];
            for (var i = 0; i < coords.length; i++) {
                o.push(coord1(coords[i]));
            }
            return o;
        }
        function coordPair(x) { return [attrf(x, 'lon'), attrf(x, 'lat')]; }

        // create a new feature collection parent object
        function fc() {
            return {
                type: 'FeatureCollection',
                features: []
            };
        }

        var serializer;
        if (typeof XMLSerializer !== 'undefined') {
            serializer = new XMLSerializer();
            // only require xmldom in a node environment
        } else if (typeof exports === 'object' && typeof process === 'object' && !process.browser) {
            serializer = new (require('xmldom').XMLSerializer)();
        }
        function xml2str(str) { return serializer.serializeToString(str); }

        var t = {
            kml: function(doc, o) {
                o = o || {};

                var gj = fc(),
                // styleindex keeps track of hashed styles in order to match features
                    styleIndex = {},
                // atomic geospatial types supported by KML - MultiGeometry is
                // handled separately
                    geotypes = ['Polygon', 'LineString', 'Point', 'Track'],
                // all root placemarks in the file
                    placemarks = get(doc, 'Placemark'),
                    styles = get(doc, 'Style');

                for (var k = 0; k < styles.length; k++) {
                    styleIndex['#' + attr(styles[k], 'id')] = okhash(xml2str(styles[k])).toString(16);
                }
                for (var j = 0; j < placemarks.length; j++) {
                    gj.features = gj.features.concat(getPlacemark(placemarks[j]));
                }
                function gxCoord(v) { return numarray(v.split(' ')); }
                function gxCoords(root) {
                    var elems = get(root, 'coord', 'gx'), coords = [];
                    for (var i = 0; i < elems.length; i++) coords.push(gxCoord(nodeVal(elems[i])));
                    return coords;
                }
                function getGeometry(root) {
                    var geomNode, geomNodes, i, j, k, geoms = [];
                    if (get1(root, 'MultiGeometry')) return getGeometry(get1(root, 'MultiGeometry'));
                    if (get1(root, 'MultiTrack')) return getGeometry(get1(root, 'MultiTrack'));
                    for (i = 0; i < geotypes.length; i++) {
                        geomNodes = get(root, geotypes[i]);
                        if (geomNodes) {
                            for (j = 0; j < geomNodes.length; j++) {
                                geomNode = geomNodes[j];
                                if (geotypes[i] == 'Point') {
                                    geoms.push({
                                        type: 'Point',
                                        coordinates: coord1(nodeVal(get1(geomNode, 'coordinates')))
                                    });
                                } else if (geotypes[i] == 'LineString') {
                                    geoms.push({
                                        type: 'LineString',
                                        coordinates: coord(nodeVal(get1(geomNode, 'coordinates')))
                                    });
                                } else if (geotypes[i] == 'Polygon') {
                                    var rings = get(geomNode, 'LinearRing'),
                                        coords = [];
                                    for (k = 0; k < rings.length; k++) {
                                        coords.push(coord(nodeVal(get1(rings[k], 'coordinates'))));
                                    }
                                    geoms.push({
                                        type: 'Polygon',
                                        coordinates: coords
                                    });
                                } else if (geotypes[i] == 'Track') {
                                    geoms.push({
                                        type: 'LineString',
                                        coordinates: gxCoords(geomNode)
                                    });
                                }
                            }
                        }
                    }
                    return geoms;
                }
                function getPlacemark(root) {
                    var geoms = getGeometry(root), i, properties = {},
                        name = nodeVal(get1(root, 'name')),
                        styleUrl = nodeVal(get1(root, 'styleUrl')),
                        description = nodeVal(get1(root, 'description')),
                        extendedData = get1(root, 'ExtendedData');

                    if (!geoms.length) return [];
                    if (name) properties.name = name;
                    if (styleUrl && styleIndex[styleUrl]) {
                        properties.styleUrl = styleUrl;
                        properties.styleHash = styleIndex[styleUrl];
                    }
                    if (description) properties.description = description;
                    if (extendedData) {
                        var datas = get(extendedData, 'Data'),
                            simpleDatas = get(extendedData, 'SimpleData');

                        for (i = 0; i < datas.length; i++) {
                            properties[datas[i].getAttribute('name')] = nodeVal(get1(datas[i], 'value'));
                        }
                        for (i = 0; i < simpleDatas.length; i++) {
                            properties[simpleDatas[i].getAttribute('name')] = nodeVal(simpleDatas[i]);
                        }
                    }
                    return [{
                        type: 'Feature',
                        geometry: (geoms.length === 1) ? geoms[0] : {
                            type: 'GeometryCollection',
                            geometries: geoms
                        },
                        properties: properties
                    }];
                }
                return gj;
            },
            gpx: function(doc, o) {
                var i,
                    tracks = get(doc, 'trk'),
                    routes = get(doc, 'rte'),
                    waypoints = get(doc, 'wpt'),
                // a feature collection
                    gj = fc();
                for (i = 0; i < tracks.length; i++) {
                    gj.features.push(getLinestring(tracks[i], 'trkpt'));
                }
                for (i = 0; i < routes.length; i++) {
                    gj.features.push(getLinestring(routes[i], 'rtept'));
                }
                for (i = 0; i < waypoints.length; i++) {
                    gj.features.push(getPoint(waypoints[i]));
                }
                function getLinestring(node, pointname) {
                    var j, pts = get(node, pointname), line = [];
                    for (j = 0; j < pts.length; j++) {
                        line.push(coordPair(pts[j]));
                    }
                    return {
                        type: 'Feature',
                        properties: getProperties(node),
                        geometry: {
                            type: 'LineString',
                            coordinates: line
                        }
                    };
                }
                function getPoint(node) {
                    var prop = getProperties(node);
                    prop.ele = nodeVal(get1(node, 'ele'));
                    prop.sym = nodeVal(get1(node, 'sym'));
                    return {
                        type: 'Feature',
                        properties: prop,
                        geometry: {
                            type: 'Point',
                            coordinates: coordPair(node)
                        }
                    };
                }
                function getProperties(node) {
                    var meta = ['name', 'desc', 'author', 'copyright', 'link',
                            'time', 'keywords'],
                        prop = {},
                        k;
                    for (k = 0; k < meta.length; k++) {
                        prop[meta[k]] = nodeVal(get1(node, meta[k]));
                    }
                    return clean(prop);
                }
                return gj;
            }
        };
        return t;
    })();

    if (typeof module !== 'undefined') module.exports = toGeoJSON;

},{"__browserify_process":33,"xmldom":32}],10:[function(require,module,exports){
    var Place = require('./lib/draw.place.js'),
        Point = require('./lib/draw.point.js'),
        fs = require('fs');

    var templates = {
        map_tip_message: _("<div class='small pad1x clearfix truncate'>\n  <span class='inline icon info pad1y'><%=obj.message%></span>\n  <% if (!obj.noclose) { %>\n  <a id='cancel-tip' href='#browse' class='pin-right unround button quiet icon close pad1 inline'>Cancel</a>\n  <% } %>\n</div>\n").template()
    };

    module.exports = function(App, markers, editor) {

        var exports = {};

        exports.mode = null;

        exports.handlers = {
            place: Place(App, editor.map),
            point: Point(editor.map),
            polygon: new L.Draw.Polygon(editor.map),
            linestring: new L.Draw.Polyline(editor.map, {
                showLength: false
            })
        };

        editor.map.on('place:created', addAndEdit)
            .on('point:created', addAndEdit)
            .on('draw:created', addAndEdit)
            .on('draw:edited', update)
            .on('draw:deleted', update);

        exports.onhashchange = function() {
            if (window.location.hash === '#app') exports.clear();
        };

        exports.activate = function(type, editing) {
            exports.handlers.point.disable();
            exports.handlers.polygon.disable();
            exports.handlers.linestring.disable();
            exports.handlers.place.disable();
            hideHint();

            type = type || 'browse';
            $('.draw-controls a.active').removeClass('active');
            $('a#draw-' + type).addClass('active');

            if (type === 'menu') {
                $('#data').addClass('mode-menu');
            } else {
                $('#data').removeClass('mode-menu');
            }

            if (editing) {
                $('#data').addClass('mode-edit');
            } else {
                $('#data').removeClass('mode-edit');
                markers.clear();
                if (type === 'polygon') {
                    showHint('Click first point to close this polygon.');
                    exports.handlers.polygon.enable();
                } else if (type === 'linestring') {
                    showHint('Click last point to finish the line.');
                    exports.handlers.linestring.enable();
                } else if (type === 'point') {
                    showHint('Click anywhere on the map to place a point.');
                    exports.handlers.point.enable();
                } else if (type === 'browse') {
                    showHint("Draw or <a href='#' class='marker-import-manual'>import</a> .geojson, .csv, .kml, or .gpx files.", true);
                    exports.handlers.place.disable();
                }
            }
            exports.mode = type;
        };

        // Wrapper around exports.activate that resets to default draw state.
        exports.clear = function() {
            exports.activate('browse');
        };

        markers.on('del', onDel);
        markers.on('edit', exports.activate);

        // Explicitly trigger a place being created.
        exports.place = function(ev) {
            exports.activate('browse');
            exports.handlers.place.popup(ev);
        };

        function update(e) {
            editor.changed();
        }

        function addAndEdit(e) {
            var feature = markers.addFeature(
                markers.initializeFeature(e.layer.toGeoJSON()));
            markers.highlightFeature(feature);
            markers.syncUI();
            analytics.track('Drew a ' + feature.geometry.type);
            markers.edit(feature.properties.id, false);
            // Disable redraw for now which is conceptually wonky in sequence
            // with edit form being non-persistent.
            // hideHint();
            // setTimeout(function() {
            //     exports.activate(mode);
            // }, 10);
        }

        function showHint(msg, noclose) {
            $('#marker-help').addClass('active');
            $('#marker-help').html(templates.map_tip_message({
                message: msg,
                noclose: noclose
            }));
        }

        function hideHint() {
            $('#marker-help').removeClass('active');
        }

        // on marker deletion
        function onDel() {
            exports.activate(exports.mode);
        }


        // Initialize.
        exports.clear();

        return exports;
    };

},{"./lib/draw.place.js":17,"./lib/draw.point.js":18,"fs":29}],11:[function(require,module,exports){
    var toGeoJSON = require('togeojson'),
        geojsonFlatten = require('geojson-flatten'),
        csv2geojson = require('csv2geojson'),
        fs = require('fs');

    var templates = {
        propertyassign: _("<div id='import' class='limiter modal-popup'>\n  <div class='col8 margin2 modal-body fill-white contain'>\n    <a href='#close' class='quiet big icon fr close'></a>\n    <div class='pad2y pad4x center'>\n      <h2>Import features</h2>\n    </div>\n    <div class='clearfix'>\n      <div class='col10 margin1'>\n        <% var popupProperties = [{\n            name: 'title',\n            help: 'Choose an imported property to give each feature a popup title.'\n          }, {\n            name: 'description',\n            help: 'Choose an imported property to give each feature a popup description.'\n        }]; %>\n        <div class='tabs col12 space-bottom clearfix'>\n          <% if (allpoints) { %>\n            <% if (!geojson) { %>\n              <a href='#active1' class='active col6'>Style</a>\n              <a href='#active2' class='col6'>Symbol</a>\n            <% } else { %>\n              <a href='#active1' class='active col3'>Title</a>\n              <a href='#active2' class='col3'>Description</a>\n              <a href='#active3' class='col3'>Style</a>\n              <a href='#active4' class='col3'>Symbol</a>\n            <% } %>\n          <% } else { %>\n            <a href='#active1' class='active col6'>Title</a>\n            <a href='#active2' class='col6'>Description</a>\n          <% } %>\n        </div>\n\n        <div class='property-panes sliding h active1 col12 row5 clip contain'>\n          <% if (geojson) { %>\n            <% _(popupProperties).each(function(field) { %>\n            <div class='col12 animate'>\n              <div class='col12 scroll-v round keyline-all row4'>\n                <% _(_(obj.geojson).pairs()).each(function(f, i) { %>\n                <input id='<%= field.name %>-<%= f[0] %>' class='label-select' data-geojson='<%= field.name %>.<%= f[0] %>' type='radio' name='<%= field.name %>' value='<%= f[0] %>' <% if (f[0].toLowerCase().replace(/\\s/g, '') === field.name) { %>checked=true<% } %> />\n                <label class='col12 truncate <% if (i !== 0) { %>keyline-top<% } %> pad1y pad2x row1' for='<%= field.name %>-<%= f[0] %>'>\n                  <%= f[0].replace(/<[^<]+>/g, '').trim() %>\n                  <% if (f[1]) { %>\n                    <% var example = (typeof f[1] === 'string') ? f[1].replace(/<[^<]+>/g, '').trim() : f[1]; %>\n                    <em class='small quiet'>(<%= example %>)</em>\n                  <% } %>\n                </label>\n                <% }); %>\n              </div>\n              <div class='center pad1y'>\n                <p><%= field.help %></p>\n              </div>\n            </div>\n            <% }); %>\n          <% } %>\n\n          <% if (allpoints) { %>\n            <div class='col12 animate'>\n              <div class='fill-darken0 pad1'>\n                <% print(obj.style_template(_({\n                    context: 'import'\n                  }).defaults({ properties: obj.markerDefaults })));\n                %>\n              </div>\n              <div class='center pad1y'>\n                <p>Style each imported marker with a size &amp; color.</p>\n              </div>\n            </div>\n            <div class='col12 animate'>\n              <% print(obj.symbol_template(_({\n                  context: 'import'\n                }).defaults({ properties: obj.markerDefaults }))); %>\n              <div class='center pad1y'>\n                <p>Provide each imported marker with a symbol icon.</p>\n              </div>\n            </div>\n          <% } %>\n        </div>\n      </div>\n    </div>\n    <div class='clearfix pad2y'>\n      <a href='#' id='import-assign' class='col6 margin3 button icon up'>Finish importing</a>\n    </div>\n  </div>\n</div>\n").template(),
        symbol: _("<div class='pager js-tabs pad1 pill pin-right'>\n  <a href='#marker-edit-symbol-pages' class='col12 quiet full button icon big up round-top quiet'></a>\n  <a href='#marker-edit-symbol-pages' class='col12 quiet full button icon big down round-bottom quiet'></a>\n</div>\n<div id='marker-edit-symbol-pages' class='marker-edit-symbol sliding v active1 clip row4'>\n  <%\n  if (!window.MakiFull) {\n    var icons = window.Maki.slice(0);\n    icons.unshift({ alpha:true, icon:'' });\n    icons = icons.concat(_(10).chain().range().map(function(v) { return { alpha:true, icon:v } }).value());\n    icons = icons.concat(_(26).chain().range().map(function(v) { return { alpha:true, icon:String.fromCharCode(97 + v) } }).value());\n    window.MakiFull = icons;\n  }\n  _(window.MakiFull).chain()\n  .filter(function(icon) { return !icon.tags || icon.tags.indexOf('deprecated') === -1 })\n  .groupBy(function(icon, i) {\n    return Math.floor(i/60);\n  })\n  .each(function(group, i) { %>\n    <div class='animate col12 clearfix row5'>\n    <% _(group).each(function(icon) { %>\n        <input id='<%= context %>-marker-symbol-<%=icon.icon%>' class='label-select' data-geojson='marker-symbol.<%= icon.icon %>' type='radio' name='marker-symbol' value='<%=icon.icon%>' <%= obj['marker-symbol'] === icon.icon ? 'checked' : '' %> />\n      <% if (icon.alpha) { %>\n      <label for='<%= context %>-marker-symbol-<%=icon.icon%>' class='col1 symbol center round'><span class='maki-icon strong alpha'><%=icon.icon%></span></label>\n      <% } else { %>\n      <label for='<%= context %>-marker-symbol-<%=icon.icon%>' class='col1 symbol center round' title='<%=icon.name%>'><span class='maki-icon <%=icon.icon%>'></span></label>\n      <% } %>\n    <% }); %>\n  </div>\n  <% }); %>\n</div>\n").template(),
        style: _("<div class='clearfix space-bottom js-tabs pill'><!--\n--><input id='<%= context %>-marker-size-small' class='label-select' data-geojson='marker-size.small' type='radio' name='marker-size' value='small' <%= obj.properties['marker-size'] === 'small' ? 'checked' : '' %> /><!--\n--><label for='<%= context %>-marker-size-small' class='col3 button'>Small</label><!--\n--><input id='<%= context %>-marker-size-medium' class='label-select' data-geojson='marker-size.medium' type='radio' name='marker-size' value='medium' <%= obj.properties['marker-size'] === 'medium' ? 'checked' : '' %> /><!--\n--><label for='<%= context %>-marker-size-medium' class='col3 button'>Medium</label><!--\n--><input id='<%= context %>-marker-size-large' class='label-select' data-geojson='marker-size.large' type='radio' name='marker-size' value='large' <%= obj.properties['marker-size'] === 'large' ? 'checked' : '' %> /><!--\n--><label for='<%= context %>-marker-size-large' class='col3 button'>Large</label>\n  <div class='col3 row1 style-input-wrapper'>\n    <input id='marker-color' name='marker-color' type='text' class='center code col12 row1 js-noTabExit color-hex' maxlength='7' style=\"padding: 10px 5px;\" <%= obj.properties['marker-color'] ? ' placeholder=\"' + obj.properties['marker-color'] + '\"' : 'placeholder=\"#7d7d7d\"' %> />\n  </div>\n</div>\n<div class='clearfix clip round'>\n  <% _(App.colors).each(function(color) { %>\n  <input id='<%= context %>-marker-color-<%=color%>' class='label-select' type='radio' data-geojson='marker-color.<%= color %>' name='marker-color' value='#<%=color%>' <%= obj.properties['marker-color'] === '#' + color ? 'checked' : '' %> />\n  <label for='<%= context %>-marker-color-<%=color%>' class='dark swatch center clip icon check row1 col1' style='background-color:#<%=color%>'></label>\n  <% }); %>\n</div>\n").template()
    };

    exports.mapDragEnter = function(ev) {
        ev.originalEvent.dataTransfer.dropEffect = 'copy';
        ev.preventDefault();
        ev.stopPropagation();
        this.dropzone.toggleClass('active', true);
    };

    exports.mapDragLeave = function(ev) {
        ev.originalEvent.dataTransfer.dropEffect = 'copy';
        ev.preventDefault();
        ev.stopPropagation();
        this.dropzone.toggleClass('active', false);
    };

    exports.mapDrop = function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var event = ev.originalEvent;
        var view = this;
        var manual = $(ev.currentTarget).val();

        if (manual || event.dataTransfer &&
            event.dataTransfer.files && event.dataTransfer.files.length) {
            var file = (event.dataTransfer) ?
                event.dataTransfer.files[0] :
                ev.currentTarget.files[0];
            this.dropzone.toggleClass('active loading', true);
            handleFile(file, done);
        } else {
            done('No files were dropped');
        }

        function done(err, geojson) {
            view.dropzone.toggleClass('active loading', false);
            if (err && err.code != 'closed') return Views.modal.show('err', { message: err });
            if (geojson) return view.markers.concat(geojson);
        }
    };

    exports.handleFile = handleFile;

    function handleFile(file, cb) {
        switch (detectType(file)) {
            case 'geojson':
                readGeoJSON(file, cb);
                analytics.track('supported drop', {
                    type: 'geojson'
                });
                break;
            case 'kml':
                readKML(file, cb);
                analytics.track('supported drop', {
                    type: 'kml'
                });
                break;
            case 'dsv':
                readDSV(file, cb);
                analytics.track('supported drop', {
                    type: 'csv'
                });
                break;
            case 'gpx':
                readGPX(file, cb);
                analytics.track('supported drop', {
                    type: 'gpx'
                });
                break;
            case 'shp':
            case 'zip':
            case 'shx':
            case 'dbf':
            case 'qpj':
            case 'prj':
                analytics.track('unsupported drop', {
                    type: otherType(file)
                });
                return cb('File type ' + otherType(file) +
                    ' is unsupported.<div class="pad2y">Uploading a shapefile?' +
                    'Try using <a href="http://www.shpescape.com/" target="_blank">Shape Escape</a> to convert your data to another format before uploading.</div><small class="quiet">Supported formats: .geojson, .csv, .kml, or .gpx</small>');
            default:
                analytics.track('unsupported drop', {
                    type: otherType(file)
                });
                return cb('File type ' + otherType(file) + ' is unsupported.');
        }
    }

    function detectType(f) {
        var filename = f.name ? f.name.toLowerCase() : '';
        function ext(_) {
            return filename.indexOf(_) !== -1;
        }
        if (f.type === 'application/vnd.google-earth.kml+xml' || ext('.kml')) {
            return 'kml';
        }
        if (ext('.gpx')) return 'gpx';
        if (ext('.geojson') || ext('.json') || ext('.topojson')) return 'geojson';
        if (f.type === 'text/csv' || ext('.csv') || ext('.tsv') || ext('.dsv')) {
            return 'dsv';
        }
        if (ext('.xml') || ext('.osm')) return 'xml';
    }

    function otherType(f) {
        var filename = f.name ? f.name.toLowerCase() : '',
            pts = filename.split('.');
        if (pts.length > 1) return pts[pts.length - 1];
        else return 'unknown';
    }

    function readAsText(f, callback) {
        try {
            var reader = new FileReader();
            reader.readAsText(f);
            reader.onload = function(e) {
                if (e.target && e.target.result) callback(null, e.target.result);
                else callback({
                    message: 'Dropped file could not be loaded'
                });
            };
            reader.onerror = function(e) {
                callback({
                    message: 'Dropped file was unreadable'
                });
            };
        } catch (e) {
            callback({
                message: 'Dropped file was unreadable'
            });
        }
    }

    function showModal(geojson, callback) {
        if (geojson.features &&
            geojson.features.length &&
            'properties' in geojson.features[0]) {

            var noprops = _(geojson.features[0].properties).isEmpty();
            var allpoints = geojson.features.every(function(f) {
                return f && f.geometry && f.geometry.type === 'Point';
            });

            if (noprops && !allpoints) {
                callback(null, geojson);
            } else {
                Views.modal.show('propertyassign', {
                    template: templates.propertyassign,
                    symbol_template: templates.symbol,
                    style_template: templates.style,
                    geojson: (noprops) ? undefined : geojson.features[0].properties,
                    allpoints: allpoints,
                    markerDefaults: {
                        title: '',
                        description: ''
                    }
                }, function(err, res) {
                    if (err) return callback(err, res);
                    if (res) {
                        Views.modal.done('propertyassign');
                        callback(null, assignProps(geojson, res));
                    }
                });
            }
        } else {
            return callback('Could not parse file to build a .geojson document.');
        }
    }


    function normalizeGeoJSON(gj) {
        if (!gj) return null;
        switch (gj.type) {
            case 'FeatureCollection':
                return gj;
            case 'Feature':
                return {
                    type: 'FeatureCollection',
                    features: [gj]
                };
            case 'Point':
            case 'Polygon':
            case 'LineString':
                return {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: {},
                        geometry: gj
                    }]
                };
        }
    }

    function assignProps(geojson, props) {
        geojson.features.forEach(function(f) {
            f.properties.title = (props.title) ?
                f.properties[props.title] : '';
            f.properties.description = (props.description) ?
                f.properties[props.description] : '';
            f.properties['marker-color'] = (props['marker-color']) ?
                props['marker-color'] : '';
            f.properties['marker-size'] = (props['marker-size']) ?
                props['marker-size'] : '';
            f.properties['marker-symbol'] = (props['marker-symbol']) ?
                props['marker-symbol'] : '';
        });
        return geojson;
    }

    function readKML(file, cb) {
        readAsText(file, function(err, res) {
            if (err) return cb(err.message);
            var kmldom = toDom(res),
                geojson = toGeoJSON.kml(kmldom);
            if (geojson) {
                geojson = geojsonFlatten(geojson);
                geojson.features.forEach(renameTitle);
                showModal(geojson, cb);
            } else {
                return cb('Could not read dropped KML');
            }
        });
    }

    function readDSV(file, cb) {
        readAsText(file, function(err, res) {
            if (err) return cb(err.message);
            csv2geojson.csv2geojson(res, function(err, geojson) {
                if (geojson) {
                    showModal(geojson, cb);
                } else {
                    return cb('Could not read dropped CSV');
                }
            });
        });
    }

    function readGPX(file, cb) {
        readAsText(file, function(err, res) {
            if (err) return cb(err.message);
            var gpxdom = toDom(res),
                geojson = toGeoJSON.gpx(gpxdom);

            if (geojson) {
                geojson = geojsonFlatten(geojson);
                geojson.features.forEach(renameTitle);
                showModal(geojson, cb);
            } else {
                return cb('Could not read dropped GPX');
            }
        });
    }

    function readGeoJSON(file, cb) {
        readAsText(file, function(err, res) {
            if (err) return cb(err.message);
            try {
                var geojson = normalizeGeoJSON(JSON.parse(res));
                geojson = geojsonFlatten(geojson);
                if (geojson) {
                    showModal(geojson, cb);
                } else {
                    return cb('Could not read dropped GeoJSON');
                }
            } catch(e) {
                // invalid GeoJSON
                return cb('Could not read dropped GeoJSON: invalid JSON');
            }
        });
    }

    function renameTitle(f) {
        if (f.properties.name) f.properties.title = f.properties.name;
    }

    function toDom(x) {
        return (new DOMParser()).parseFromString(x, 'text/xml');
    }

},{"csv2geojson":2,"fs":29,"geojson-flatten":5,"togeojson":9}],12:[function(require,module,exports){
    var sexagesimal = require('sexagesimal'),
        fs = require('fs');

    var templates = {
        results: _("<% if (obj.length) _(obj.slice(0,5)).each(function(r, idx) { %>\n<% var name = r[0].name || [\n    Math.abs(r[0].lat).toFixed(4) + '&deg;' + (r[0].lat >= 0 ? 'N' : 'S'),\n    Math.abs(r[0].lon).toFixed(4) + '&deg;' + (r[0].lon >= 0 ? 'E' : 'W')\n].join(', '); %>\n<% var place = _(r.slice(1)).chain().filter(function(v) { return v.type !== 'zipcode' }).pluck('name').value().join(', '); %>\n<input id='search-result-<%=idx%>' class='label-select' type='radio' name='search-result' value='<%=idx%>' <%= !idx ? 'checked' : '' %>/>\n<label for='search-result-<%=idx%>' class='keyline-left keyline-right block truncate pad1y pad4x fill-light keyline-bottom contain row1'>\n  <span class='pin-left pad1y pad1x'><span class='maki-icon <%=r[0].maki || 'marker'%>'></span></span>\n  <strong><%=name%></strong>\n  <span class='small pad1x'><%=place%></span>\n</label>\n<% }); %>\n<% if (!obj.length) { %>\n<label class='block pad1y pad2x fill-light keyline-bottom keyline-left keyline-right row1'>No results</label>\n<% } %>\n").template()
    };

    module.exports = function(editor, map, draw) {
        var exports = {};
        exports.results = [];
        exports.wait = 0;
        exports.last = 0;
        exports.query = '';

        // @TODO the first URL here is a stopgap for local development because
        // of CORS request issues for geocoding endpoint.
        exports.carmen = L.mapbox.geocoder({
            geocoder: window.location.href.indexOf('http://') === 0 ?
                'https://api.tiles.mapbox.com/v3/examples.map-vyofok3q/geocode/{query}.json' :
                App.tileApi + '/v3/base.mapbox-streets/geocode/{query}.json'
        });
        exports.field = $('#search input');
        exports.input = $('#search input').get(0);

        // Set the map view to the currently highlighted result.
        exports.setview = function(el) {
            var idx = $(el || '#search-results input:checked').val();

            // No results, bail.
            if (idx === undefined) return;

            var data = _(exports.results[idx][0]).clone();
            data.lng = data.lon;
            data.title = data.name;
            if (data.bounds) {
                map.fitBounds([[data.bounds[1],data.bounds[0]], [data.bounds[3],data.bounds[2]]]);
            } else if (data.type === 'address') {
                map.setView(L.latLng(data.lat, data.lon), Math.max(16, map.getZoom()));
            } else if (data.type === 'street') {
                map.setView(L.latLng(data.lat, data.lon), Math.max(15, map.getZoom()));
            } else {
                map.setView(L.latLng(data.lat, data.lon), map.getZoom());
            }
            draw.place({ latlng: data });
            exports.highlight(idx);
        };

        // Update the current selected result.
        exports.select = function(dir) {
            var $results = $('#search-results input');
            var $result = $('#search-results input:checked');
            var index = $results.index($result);
            var size = $results.size();
            if (dir !== 1 && dir !== -1) throw new Error('dir must be either -1 or 1');
            if (size <= 0) return;

            index = index < 0 ? size : index;
            index = (index + dir) % size;
            index = index < 0 ? index + size : index;

            exports.highlight(index);
        };

        // Highlight a search result by index.
        exports.highlight = function(idx) {
            $('#search-results input:checked').removeAttr('checked');
            $('#search-results input').eq(idx).prop('checked', true);
        };

        // Focus search field.
        exports.focus = function(e) {
            if (exports.field.is(':focus')) return;
            exports.input.focus();
        };

        // Retrieve a search result.
        exports.search = function(query) {
            var $results = $('#search-results');

            // This query is empty or only whitespace.
            if (/^\s*$/.test(query)) {
                $results.empty();
                exports.query = '';
                return null;
            }

            // This query is too short. Wait for more input chars.
            if (query.length < 3) return;

            // The query matches what is currently displayed.
            if (exports.query === query) return;

            var latlon = (function(q) {
                var parts = sexagesimal.pair(q);
                if (parts) return { lat: parts[0], lon: parts[1] };
            })(query);

            // carmen expects lon/lat but we want to accept lat/lon
            if (latlon) query = latlon.lon + ', ' + latlon.lat;

            var count = ++exports.wait;
            $('#search fieldset').addClass('spinner');
            exports.carmen.query(query, function(err, data) {
                // A more recent query finished before this one. Bail.
                if (count < exports.last) return;
                $('#search fieldset').removeClass('spinner');
                exports.last = count;
                exports.query = query;
                exports.results = (data && data.results) ? data.results : [];
                if (latlon) {
                    exports.results[0] = exports.results[0] || [];
                    exports.results[0].unshift(latlon);
                }
                $results.html(templates.results(exports.results));
            });
        };

        exports.debounced = _(exports.search).debounce(100);

        return exports;
    };

},{"fs":29,"sexagesimal":8}],13:[function(require,module,exports){
    var fs = require('fs');

    var templates = {
        project_info: _("<div class='space-bottom1 small clearfix'>\n  <div class='col8 truncate strong project-name'>\n    <%- obj.name %>\n  </div>\n  <div class='col4'>\n    <a href='/help' class='text-right col12 help'>Need help?</a>\n  </div>\n</div>\n\n<div class='space-bottom1 keyline-all small'>\n  <div class='clearfix'>\n    <label for='mapid' class='icon pad1 truncate col5 id'>Map ID</label>\n    <div class='clipboard-container clip row1 col7'>\n      <input id='mapid' class='mapid code stretch readonly' type='text' value='<%= obj.id %>' readonly />\n      <a title=\"Copy Map ID to clipboard\" data-clipboard-text=\"<%= obj.id %>\" class=\"row1 keyline-left pad1 icon clipboard quiet js-clipboard\"></a>\n    </div>\n  </div>\n  <div class='fill-light pad1 info-details contain keyline-top'>\n    <label class='block'>\n      For <a class='track-js-docs' href='/mapbox.js/'>JavaScript</a>,\n      <a class='track-ios-docs' href='/mapbox-ios-sdk/'>iOS</a>, and\n      <a class='track-api-docs' href='/developers/api/'>Web services</a>.</label>\n  </div>\n</div>\n\n<div id='downloads' class='space-bottom1 <% if (!obj.markers) { %> hidden <% } %> clip keyline-all row1 small'>\n  <div class='icon pad1 col5 truncate data'>Data</div>\n  <div class='col7 text-right'>\n    <a href='https://a.tiles.mapbox.com/v3/<%=obj.id%>/markers.geojson' class='track-geojson-download pad1 inline'>GeoJSON</a><!--\n    --><a href='https://a.tiles.mapbox.com/v3/<%=obj.id%>/markers.kml' class='track-kml-download keyline-left pad1 inline'>KML</a>\n  </div>\n</div>\n\n\n<div class='keyline-all clearfix space-bottom1 small'>\n  <label for='map-link' class='icon pad1 truncate col5 link'>Share link</label>\n  <div class='clipboard-container clip col7'>\n      <input id='map-link' class='readonly code stretch' type='text' value='<%= obj.share %>' />\n      <a title='Copy link to clipboard' data-clipboard-text='<%= obj.share %>' class='row1 pad1 keyline-left icon clipboard quiet js-clipboard'></a>\n  </div>\n</div>\n\n<div class='clearfix keyline-all'>\n  <div class='clearfix'>\n    <label for='map-embed' class='small contain pad1 icon row1 brackets col5'>Embed</label>\n    <div class='clipboard-container clip row1 col7'>\n        <input id='map-embed' class='readonly code stretch' type='text' value='' />\n        <a title='Copy link to clipboard' data-clipboard-text='' id='js-clipboard-embed' class='row1 pad1 icon keyline-left clipboard quiet js-clipboard'></a>\n    </div>\n  </div>\n  <ul class='keyline-top fill-light info-details clearfix contain' id='embed-options'>\n    <li class='col6 checkbox'>\n      <input class='embed-option' type='checkbox' checked='true' id='zoompan' />\n      <label for='zoompan' class='pad0 truncate block small icon check'>Zoom &amp; Pan</label>\n    </li>\n    <li class='col6 checkbox'>\n      <input class='embed-option' type='checkbox' checked='true' id='zoomwheel' />\n      <label for='zoomwheel' class='pad0 truncate block small icon check'>Zoom Wheel</label>\n    </li>\n    <li class='col6 checkbox'>\n      <input class='embed-option' type='checkbox' checked='true' id='geocoder' />\n      <label for='geocoder' class='pad0 truncate block small icon check'>Geocoder</label>\n    </li>\n    <li class='col6 checkbox'>\n      <input class='embed-option' type='checkbox' checked='true' id='share' />\n      <label for='share' class='pad0 truncate block small icon check'>Share</label>\n    </li>\n  </ul>\n</div>\n\n<% if (!obj._rev) { %>\n<div class='pin-top pin-bottom fill-lighten3 pad2'>\n  <div class='pad2 fill-gray'>\n    <h3 class='title'>Save your project in order to:</h3>\n    <ul class='project-actions'>\n      <li class='clearfix contain space-bottom2'>\n        <span class='pin-left big fill-purple dark dot icon brackets'></span>\n        <p>Develop web and mobile apps with the project's <strong>Map ID</strong>.</p>\n      </li>\n      <li class='clearfix contain space-bottom2'>\n        <span class='pin-left fill-purple dark dot big icon link'></span>\n        <p>Easily share or embed your project.</p>\n      </li>\n      <li class='clearfix contain'>\n        <span class='pin-left fill-purple dark dot big icon down'></span>\n        <p>Download your data as <strong>geoJSON or KML</strong>.</p>\n      </li>\n    </ul>\n  </div>\n</div>\n<% } %>\n").template()
    };

    module.exports = function(editor, map, markers) {
        var exports = {};
        var $info = $('#project-info');

        function hashFormat(obj) {
            // trust the Bostock
            var precision = Math.max(0, Math.ceil(Math.log(obj.center[2]) / Math.LN2));
            return obj.center[2] + '/' +
                obj.center[1].toFixed(precision) + '/' +
                obj.center[0].toFixed(precision);
        }

        exports.render = function() {
            var project = _(editor.model.attributes).clone();
            project.share = 'https://a.tiles.mapbox.com/v3/' + project.id + '/page.html?secure=1#' + hashFormat(project);
            project.markers = editor.markers.model ? editor.markers.model.get('features').length : null;

            $info.html(templates.project_info(project));
        };

        return exports;
    };

},{"fs":29}],14:[function(require,module,exports){
    var fs = require('fs');

    var templates = {
        layers_browse: _("<div id='layers-browse' class='limiter modal-popup'><div class='col6 margin3 modal-body fill-white contain'>\n  <a href='#close' class='quiet big icon fr close'></a>\n  <div class='pad1y pad4x center'>\n    <h3>Add layers</h3>\n  </div>\n  <div id='project-data-browse' class='row6 contain scroll-v fill-grey'></div>\n  <div class='searchbar'><fieldset class='with-icon block'>\n    <span class='icon search'></span>\n    <input id='project-data-search' type='text' class='stretch'/>\n  </fieldset></div>\n</div></div>\n").template(),
        project_layer: _("<a href='#project' class='quiet contain keyline-bottom data-layer clip clearfix <%= obj.active ? 'active': '' %>' data-id='<%=item.id%>'>\n  <span class='col9 truncate small icon document'>\n    <%- item.name || item.id %>\n  </span>\n  <% if (item.id.indexOf('base.') === -1) { %>\n  <span class='col3 truncate text-right'><!--\n    --><span class='icon quiet close inline'></span>\n  </span>\n  <% } else { %>\n  <span class='col3 truncate text-right'><!--\n    --><small class='quiet inline'>Baselayer</small><!--\n    --><span class='icon quiet lock inline'></span>\n  </span>\n  <% } %>\n</a>\n").template()
    };

    module.exports = function(App, map, editor) {
        var exports = {};
        var $layers = $('#project-layers');
        exports.rendered = false;
        exports.infos = null;
        exports.layers = null;

        exports.toggle = function(id) {
            var b = _(exports.layers).find(function(m) { return m.id === id; });
            return b ? exports.remove(id) : exports.add(id);
        };

        exports.add = function(id) {
            if (!exports.infos || !exports.layers) return;
            var a = _(exports.infos).find(function(m) { return m.id === id; });
            var b = _(exports.layers).find(function(m) { return m.id === id; });
            if (!a || b) return;
            exports.layers.push(a);
            exports.refresh();
        };

        exports.remove = function(id) {
            if (!exports.layers) return;
            exports.layers = _(exports.layers).filter(function(m) { return m.id !== id; });
            exports.refresh();
        };

        exports.setview = function(id) {
            if (!exports.infos || !exports.layers) return;
            var l = _(exports.layers).find(function(m) { return m.id === id; });
            if (!l || !l.center) return;
            var center = l.center;
            map.setView([center[1], center[0]], center[2]);
        };

        exports.refresh = function() {
            if (!exports.layers) return;
            var active = _(exports.layers).pluck('id');
            // Remove unused layers.
            _($('a.data-layer', $layers)).each(function(el) {
                if (active.indexOf($(el).data('id')) === -1) $(el).remove();
            });
            // Add active layers.
            _(exports.layers).each(function(l) {
                if ($('a:not(.removed)[data-id="' + l.id + '"]',$layers).size()) return;
                var el = $(templates.project_layer({
                    item:l,
                    active:active.indexOf(l.id) !== -1
                }));
                if (/^base\./.test(l.id)) {
                    $('div.base', $layers).prepend(el);
                } else {
                    $('div.plus', $layers).prepend(el);
                }
            });
            // Update state of browser if present.
            var $browse = $('#project-data-browse');
            _($('a.data-layer', $browse)).each(function(el) {
                if (active.indexOf($(el).data('id')) === -1) {
                    $(el).removeClass('active');
                } else {
                    $(el).addClass('active');
                }
            });
            $('div.plus', $layers).sortable('destroy').sortable();
            // Redraw map.
            exports.redraw();
            $('#layers-tab').text((active.length > 1 ? active.length: '' )+ ' layers');
        };

        exports.redraw = _(function() {
            // Set model layers preserving any base.* layers which
            // is the domain of the style editor (for now).
            var base = _(editor.model.get('layers'))
                .filter(function(id) { return id.indexOf('base.') === 0; });
            var plus = _(exports.layers).chain()
                .pluck('id')
                .filter(function(id) { return id.indexOf('base.') === -1; })
                .value();
            var layers = base.concat(plus);
            if (_(editor.model.get('layers')).isEqual(layers)) return;
            editor.model.set({layers:layers});
        }).throttle(500);

        exports.search = function(query) {
            if (!App.user) return;

            var $browse = $('#project-data-browse');
            var account = editor.model.id.split('.')[0];
            if (account === 'api') account = App.user.id;

            if (!exports.infos) {
                $browse.addClass('loading');
                return App.fetch('/api/Map?account=' + account + '&_type=tileset&private=1', function(err, loaded) {
                    $browse.removeClass('loading');
                    if (err) return Views.modal.show('err', err);
                    exports.infos = _(loaded.models).pluck('attributes');
                    return exports.search(query);
                });
            } else {
                $browse.html(project_data({
                    browse: exports.infos,
                    search: query,
                    active: _(exports.layers).pluck('id')
                }));
            }
        };

        function project_data(options) {
            var search = (options.search || '').toLowerCase();
            var items = _(options.browse).chain()
                .sortBy(function(item) {
                    return (item.name||'').toLowerCase();
                })
                .filter(function(item) {
                    return (item.name||'').toLowerCase().indexOf(options.search.toLowerCase()) !== -1;
                })
                .filter(function(item) {
                    return item.format !== 'pbf';
                })
                .filter(function(item) {
                    return item.status === 'available';
                }).value();

            return items.map(function(item, i) {
                return templates.project_layer({
                    item: item,
                    active: options.active.indexOf(item.id) !== -1
                });
            }).join('\n');
        }

        exports.browse = function() {
            if (!App.user) return;

            // Attempt a render in case it has not run to date.
            // Will no-op if previously rendered.
            exports.render();

            Views.modal.show('layers-browse', {
                template: templates.layers_browse
            });
            exports.search('');
        };

        exports.render = function() {
            if (exports.rendered) return;
            if (!App.user) return;

            exports.rendered = true;
            $layers.addClass('loading');
            var queue = _(editor.model.get('layers')).map(function(id) {
                return id.split('+')[0];
            });
            function get(queue, loaded) {
                if (queue.length) {
                    App.tilejson(queue.shift(), function(err, tilejson) {
                        if (err && err.status !== 404) return Views.modal.show('err', err);
                        if (tilejson) loaded.push(tilejson);
                        get(queue, loaded);
                    });
                } else {
                    exports.layers = loaded;
                    $layers.removeClass('loading');
                    $('div.plus', $layers).sortable();
                    $('div.plus', $layers).bind('sortupdate', function(ev, ui) {
                        var order = _($('a',$layers)).map(function(el) { return $(el).data('id'); });
                        exports.layers.sort(function(a, b) {
                            var ai = order.indexOf(a.id);
                            var bi = order.indexOf(b.id);
                            return ai < bi ? 1 : ai > bi ? -1 : 0;
                        });
                        exports.redraw();
                    });
                    exports.refresh();
                }
            }
            get(queue, []);
        };

        return exports;
    };

},{"fs":29}],15:[function(require,module,exports){
    module.exports.colorHSL = _(function(ev) {
        if (!ev.which) return;
        var target, id, x, y, w, h;
        if (this.colorSelectMode === 'sl') {
            target = this.colorSelectTarget;
            id = this.style.id({currentTarget:target});
            x = (ev.clientX - $(target).offset().left + window.pageXOffset);
            y = (ev.clientY - $(target).offset().top + window.pageYOffset);
            w = $(target).width();
            h = $(target).height();
            this.style.styles[id].s = Math.min(1,Math.max(0,x/w));
            this.style.styles[id].l = Math.min(1,Math.max(0,(1-(this.style.styles[id].s*0.5)) * (1-y/h)));
            this.style.render(id);
            ev.preventDefault();
        } else if (this.colorSelectMode === 'h') {
            target = this.colorSelectTarget;
            id = this.style.id({currentTarget:target});
            x = (ev.clientX - $(target).offset().left + window.pageXOffset);
            w = $(target).width();
            this.style.styles[id].h = Math.min(1,Math.max(0,x/w));
            this.style.render(id);
            ev.preventDefault();
        }
    }).throttle(20);

    module.exports.colorHex = _(function(ev) {
        var id = this.style.id(ev);
        var hex = $(ev.currentTarget).val();
        if (hex[0] !== '#') $(ev.currentTarget).val('#' + hex);

        hex = formatHex(hex);
        if ((/^#?([0-9a-f]{6})$/i).test(hex)) {
            var hsl = Streets.parseTintString(hex);
            this.style.styles[id].h = Streets.avg(hsl.h);
            this.style.styles[id].s = Streets.avg(hsl.s);
            this.style.styles[id].l = Streets.avg(hsl.l);
            this.style.render(id, true);
        }
    }).throttle(20);

    module.exports.colorClamp = _(function(ev) {
        var id = this.style.id(ev);
        var v = +$(ev.currentTarget).val();
        if ($(ev.currentTarget).attr('name') === 'a') {
            this.style.styles[id].a = +v;
        } else {
            this.style.styles[id][$(ev.currentTarget).attr('name')] = 0.5 - v;
        }
        this.style.render(id, true);
    }).throttle(20);

    module.exports.formatHex = formatHex;

    function formatHex(hex) {
        if ((/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i).test(hex)) {
            hex = hex.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '#$1$1$2$2$3$3');
        }
        return hex;
    }

},{}],16:[function(require,module,exports){
    module.exports.reset = function() {
        module.exports.Point = {
            title: '',
            description: '',
            'marker-size': 'medium',
            'marker-color': '#1087bf',
            'marker-symbol': ''
        };

        module.exports.LineString = {
            title: '',
            description: '',
            'stroke': '#1087bf',
            'stroke-width': 4,
            'stroke-opacity': 1
        };

        module.exports.Polygon = {
            title: '',
            description: '',
            'stroke': '#1087bf',
            'stroke-width': 4,
            'stroke-opacity': 1,
            'fill': '#1087bf',
            'fill-opacity': 0.2
        };
    };

    module.exports.reset();

},{}],17:[function(require,module,exports){
    var latlngToFeature = require('./latlngtofeature'),
        fs = require('fs');

    var templates = {
        popup: _("<div class='place-popup round'>\n  <a href='#data' class='place-marker small contain strong center round fill-white quiet pad1 block'>\n    <span class='maki-icon <%= obj.maki || 'marker' %>'></span>\n    <%= obj.title || 'New marker' %>\n  </a>\n</div>\n").template()
    };

// Draw-like handler for place => marker interactions.
// Emits a map 'place:created' event when a marker is added.
    module.exports = function(App, map) {
        var exports = {};
        exports.layer = null;

        // Use a flag + 200ms timeout to determine if a click is "really" a
        // single click before placing the marker UI.
        var single = false;

        exports.clear = function() {
            if (!exports.layer) return;
            var layer = exports.layer;
            exports.layer = null;
            map.removeLayer(layer);
        };

        exports.popup = function(ev) {
            exports.clear();
            exports.layer = L.marker(ev.latlng, {
                icon: L.divIcon({
                    className: 'place-tmp'
                }),
                id: 'place-tmp'
            }).addTo(map);
            exports.layer.bindPopup(templates.popup(ev.latlng), {
                closeButton: false,
                className: 'place-popup-wrapper',
                maxWidth: 150
            });
            exports.layer.openPopup();
            $('.place-popup-wrapper .place-marker').click(clickPlace);
            exports.layer.on('popupclose', exports.clear);

            function clickPlace() {
                var feature = latlngToFeature(ev.latlng);
                var event = { layer: { toGeoJSON: function() { return feature; } } };
                map.fire('place:created', event);
                exports.clear();
                analytics.track('Placed a Marker');
            }
        };

        exports.disable = function() {
            exports.clear();
            map.on('mousedown', function() {
                exports.clear();
            });
        };

        return exports;
    };

},{"./latlngtofeature":21,"fs":29}],18:[function(require,module,exports){
    var latlngToFeature = require('./latlngtofeature');

// Draw-like handler for direct point addition.
// Emits a map 'point:created' event when a point is added.
    module.exports = function(map) {
        var exports = {};

        exports.enable = function() {
            map.on('click', onclick);
            $('#map-app').addClass('crosshair-mode');
        };

        exports.disable = function() {
            map.off('click', onclick);
            $('#map-app').removeClass('crosshair-mode');
        };

        function onclick(ev) {
            var feature = latlngToFeature(ev.latlng);
            var event = { layer: { toGeoJSON: function() { return feature; } } };
            map.fire('point:created', event);
        }

        return exports;
    };

},{"./latlngtofeature":21}],19:[function(require,module,exports){
    module.exports = function(l) {
        if (l instanceof L.Marker) return l.getLatLng();

        var latlngs = l._latlngs,
            len = latlngs.length,
            i, j, p1, p2, f, center;

        for (i = 0, j = len - 1, area = 0, lat = 0, lng = 0; i < len; j = i++) {
            p1 = latlngs[i];
            p2 = latlngs[j];
            f = p1.lat * p2.lng - p2.lat * p1.lng;
            lat += (p1.lat + p2.lat) * f;
            lng += (p1.lng + p2.lng) * f;
            area += f / 2;
        }

        center = area ? new L.LatLng(lat / (6 * area), lng / (6 * area)) : latlngs[0];
        center.area = area;

        return center;
    };

},{}],20:[function(require,module,exports){
    module.exports = function(ev) {
        var $target = $(ev.currentTarget),
            $input = $target.siblings('input'),
            changed = false;

        $input.val(function(index, value) {
            var max = parseFloat($input.attr('max'));
            var min = parseFloat($input.attr('min'));
            var step = parseFloat($input.attr('step')) || 1;
            var increment = ($target.hasClass('increase')) ? step : 0 - step;
            newVal = parseFloat(value) + increment;

            if (newVal >= min && newVal <= max) {
                changed = true;
                return Math.round(newVal * 100) / 100;
            } else return value;
        });

        if (changed) { $input.trigger('change'); }
    };

},{}],21:[function(require,module,exports){
    var util = require('./util'),
        defaults = require('./defaults');

    module.exports = function latlngToFeature(data) {
        return {
            type: 'Feature',
            properties: _({
                id: util.makeId(),
                title: data.title,
                description: data.description
            }).defaults(defaults.point),
            geometry: {
                type: 'Point',
                coordinates: [data.lng, data.lat]
            }
        };
    };

},{"./defaults":16,"./util":24}],22:[function(require,module,exports){
    module.exports = function(ev) {
        var el = $(ev.currentTarget);
        var dir = el.is('.up') ? -1 : 1;
        var parent = $('#' + el.attr('href').split('#').pop());

        // Pager requires the target to be a sliding container.
        if (!parent.is('.sliding')) return;

        // Bail on empty containers.
        var size = parent.children().size();
        if (size <= 0) return;

        // Search for a .activeN class and nuke it.
        var current = parent.attr('class').match(/active[0-9]+/);
        // Add the new appropriate active class.
        if (current) {
            var index = parseInt(current[0].split('active')[1],10) - 1;
            index = index + dir;
            if (index >= 0 && index < size) {
                parent.removeClass(current[0]);
                parent.addClass('active' + (index+1));
            }
        } else {
            parent.addClass('active1');
        }
        return false;
    };

},{}],23:[function(require,module,exports){
// this is from simplestyle.js in mapbox.js
    var defaults = {
        stroke: '#940000',
        'stroke-width': 2,
        'stroke-opacity': 1,
        fill: '#C78383',
        'fill-opacity': 0.1
    };

    var mapping = [
        ['stroke', 'color'],
        ['stroke-width', 'weight'],
        ['stroke-opacity', 'opacity'],
        ['fill', 'fillColor'],
        ['fill-opacity', 'fillOpacity']
    ];

    function fallback(a, b) {
        var c = {};
        for (var k in b) {
            if (a[k] === undefined) c[k] = b[k];
            else c[k] = a[k];
        }
        return c;
    }

    function remap(a) {
        var d = {};
        for (var i = 0; i < mapping.length; i++) {
            d[mapping[i][1]] = a[mapping[i][0]];
        }
        return d;
    }

    module.exports = function style(feature) {
        return remap(fallback(feature.properties || {}, defaults));
    };

},{}],24:[function(require,module,exports){
    var counter = 0;
    module.exports.makeId = function() {
        return 'marker-' + (+new Date()).toString(36) + (counter++).toString(36);
    };

},{}],25:[function(require,module,exports){
    exports.zoomToggle = function() {
        var view = this; // `this` is the map object
        var zoomIn = $('#zoom-in');
        var zoomOut = $('#zoom-out');
        var max = view.getMaxZoom();
        var min = view.getMinZoom();

        if (view.getZoom() >= max) {
            zoomIn.addClass('disabled');
        } else {
            zoomIn.removeClass('disabled');
        }

        if (view.getZoom() <= min) {
            zoomOut.addClass('disabled');
        } else {
            zoomOut.removeClass('disabled');
        }
    };

    exports.zoomIn = function(ev) {
        var zoom = this.map.getZoom(),
            max = this.map.getMaxZoom();

        if (zoom <= max) this.map.zoomIn(1);
        return false;
    };

    exports.zoomOut = function(ev) {
        var zoom = this.map.getZoom(),
            min = this.map.getMinZoom();

        if (zoom >= min) this.map.zoomOut(1);
        return false;
    };

},{}],26:[function(require,module,exports){
    var simplestylePath = require('./lib/simplestyle'),
        getCenter = require('./lib/getcenter'),
        geojsonHint = require('geojsonhint'),
        util = require('./lib/util'),
        defaults = require('./lib/defaults'),
        fs = require('fs');

    var templates = {
        polygon_edit: _("<div class='pin-bottom row1 fill-gray keyline-top'>\n  <div class='pin-bottom row1 js-tabs tabs'><!--\n    --><a href='#poly-edit-text' class='col4 active'>Text</a><!--\n    --><a href='#edit-poly-stroke' class='col4'><!--\n        --><span id='color-stroke' class='color' style='background-color:<%=feature.properties.stroke%>'></span>Stroke</a><!--\n    --><a href='#edit-poly-fill' class='col4'><!--\n        --><span id='color-fill' class='color' style='background-color:<%=feature.properties.fill%>'></span>Fill</a>\n  </div>\n  <div class='pin-right pad1 dark'>\n    <a href='#<%=feature.properties.id%>' class='icon trash inline fill-darken2 round'></a>\n  </div>\n</div>\n\n<div class='clip sliding h active1 col12 row5'>\n  <div id='poly-edit-text' class='animate col12 clearfix row5 pad2'>\n    <div class='space-bottom1'>\n      <input type='text' placeholder='Untitled' class='big stretch' value='<%=_(feature.properties.title).escape()%>' name='title' />\n      <label>Name this polygon</label>\n    </div>\n    <div>\n      <textarea placeholder='Description' class='big stretch js-noTabExit' name='description'><%=feature.properties.description%></textarea>\n      <label>Add a description</label>\n    </div>\n  </div>\n  <div id='edit-poly-stroke' class='animate col12 row5 pad2'>\n    <% print(stroke_template(_({\n        context: 'marker'\n      }).defaults(obj.feature))); %>\n  </div>\n  <div id='edit-poly-fill' class='animate col12 row5 pad2'>\n    <% print(fill_template(_({\n        context: 'marker'\n      }).defaults(obj.feature))); %>\n  </div>\n</div>\n").template(),
        line_edit: _("<div class='pin-bottom row1 fill-gray keyline-top'>\n  <div class='pin-bottom row1 js-tabs tabs'><!--\n    --><a href='#poly-edit-text' class='col6 active'>Text</a><!--\n    --><a href='#edit-poly-stroke' class='col6'><span id='color-stroke' class='color' style='background-color:<%=feature.properties.stroke%>'></span>Stroke</a>\n  </div>\n  <div class='pin-right pad1 dark'>\n    <a href='#<%=feature.properties.id%>' class='icon trash inline fill-darken2 round'></a>\n  </div>\n</div>\n\n<div class='clip sliding h active1 col12 row5'>\n  <div id='poly-edit-text' class='animate col12 clearfix row5 pad2'>\n    <div class='space-bottom1'>\n      <input type='text' placeholder='Untitled' class='big stretch' value='<%=_(feature.properties.title).escape()%>' name='title' />\n      <label>Name this line</label>\n    </div>\n    <div>\n      <textarea placeholder='Description' class='big stretch js-noTabExit' name='description'><%=feature.properties.description%></textarea>\n      <label>Add a description</label>\n    </div>\n  </div>\n  <div id='edit-poly-stroke' class='animate col12 row5 pad2'>\n    <% print(stroke_template(_({\n        context: 'marker'\n      }).defaults(obj.feature))); %>\n  </div>\n</div>\n").template(),
        marker_tray: _("<a class='truncate strong quiet keyline-bottom block contain small tray-item' id='<%=properties.id%>' href='#edit-<%=properties.id%>'>\n  <%\n    var icon;\n    switch (geometry.type) {\n      case 'Point':\n        icon = 'marker';\n      break;\n      case 'LineString':\n        icon = 'polyline';\n      break;\n      case 'Polygon':\n        icon = 'polygon';\n      break;\n    }\n  %>\n  <span title='<%= icon %>' class='icon <%= icon %> inline quiet'></span>\n  <span class='title pad1y'><%= $('<div>' + properties.title + '</div>').text() %></span>\n  <span class='icon trash quiet button unround'></span>\n</a>\n").template(),
        marker_edit: _("<div class='pin-bottom fill-gray keyline-top row1'>\n  <div class='pin-bottom row1 js-tabs tabs'><!--\n    --><a href='#marker-edit-text' class='col3 active'>Text</a><!--\n    --><a href='#marker-edit-style' class='col3'>Style</a><!--\n    --><a href='#marker-edit-symbol' class='col3'>Symbol</a><!--\n    --><a href='#marker-edit-coordinates' class='col3'>Lat/Lon</a>\n  </div>\n  <div class='pin-right pad1 dark'>\n    <a href='#<%=feature.properties.id%>' class='icon trash inline fill-darken2 round'></a>\n  </div>\n</div>\n\n<div class='clip sliding h active1 col12 row5'>\n  <div id='marker-edit-text' class='animate col12 clearfix row5 pad2'>\n    <div class='space-bottom1'>\n      <input type='text' placeholder='Untitled' class='big stretch' value='<%=_(feature.properties.title).escape()%>' name='title' />\n      <label>Name this feature</label>\n    </div>\n    <div>\n      <textarea placeholder='Description' class='big stretch js-noTabExit' name='description'><%=feature.properties.description%></textarea>\n      <label>Add a description</label>\n    </div>\n  </div>\n  <div id='marker-edit-style' class='animate col12 row5 pad2'>\n    <% print(style_template(_({\n        context: 'marker'\n      }).defaults(feature))); %>\n  </div>\n  <div id='marker-edit-symbol' class='animate col12 row5 pad2'>\n    <% print(symbol_template(_({\n        context: 'marker'\n      }).defaults(feature))); %>\n  </div>\n  <div id='marker-edit-coordinates' class='animate col12 row5 pad2'>\n    <div class='col6'>\n      <fieldset class='with-icon'>\n        <span class='icon u-d-arrow quiet'></span>\n        <input id='latitude' name='latitude' type='number' min='-90' max='90' class='code col12 js-noTabExit' value=\"<%= feature.geometry.coordinates[1] !== undefined ? feature.geometry.coordinates[1] : 0 %>\" />\n        <label>Latitude</label>\n      </fieldset>\n    </div>\n    <div class='col6'>\n      <fieldset class='with-icon'>\n        <span class='icon l-r-arrow quiet'></span>\n        <input id='longitude' name='longitude' type='number' min='-180' max='180' class='code col12'\n            value=\"<%= feature.geometry.coordinates[0] !== undefined ? feature.geometry.coordinates[0] : 0 %>\" />\n        <label>Longitude</label>\n      </fieldset>\n    </div>\n  </div>\n</div>\n</div>\n\n").template(),
        stroke: _("<div id='poly-edit-stroke' class='clearfix col12 animate row4'>\n  <div class='small clearfix pad1y space-bottom1'>\n    <div class='style-input-wrapper col4'>\n      <fieldset class='with-icon'>\n        <span class='icon quiet opacity'></span>\n        <input id='stroke-opacity' name='stroke-opacity' type='number' min='0' max='1' step='.1' class='col12 code js-noTabExit' <%= obj.properties['stroke-opacity'] ? ' value=\"' + obj.properties['stroke-opacity'] + '\"' : '' %> />\n\n        <div class='increment increase icon plus keyline-left'></div>\n        <div class='increment decrease icon minus keyline-left keyline-top'></div>\n      </fieldset>\n    </div>\n    <div class='style-input-wrapper col4'>\n      <fieldset class='with-icon'>\n        <span class='icon quiet adjust-stroke'></span>\n        <input id='stroke-width' name='stroke-width' type='number' min='0' max='20' class='code col12' <%= obj.properties['stroke-width'] ? ' value=\"' + obj.properties['stroke-width'] + '\"' : '' %> />\n\n        <div class='increment increase icon plus keyline-left'></div>\n        <div class='increment decrease icon minus keyline-left keyline-top'></div>\n      </fieldset>\n    </div>\n    <div class='style-input-wrapper col4'>\n      <input id='stroke' name='stroke' type='text' class='code center col12 color-hex' maxlength='7' <%= obj.properties['stroke'] ? ' placeholder=\"' + obj.properties['stroke'] + '\"' : '' %> />\n    </div>\n\n  </div>\n  <div class='clearfix clip round'>\n    <% _(App.pigment_colors).each(function(color) { %>\n      <input id='<%= context %>-stroke-<%=color%>' class='label-select' type='radio' data-geojson='stroke.<%= color %>' name='stroke' value='#<%=color%>' <%= obj.properties['stroke'] === '#' + color ? 'checked' : '' %> />\n      <label for='<%= context %>-stroke-<%=color%>' class='dark swatch center clip icon check row1 col1' style='background-color:#<%=color%>'></label>\n    <% }); %>\n  </div>\n</div>\n").template(),
        fill: _("<div id='poly-edit-fill' class='clearfix col12 animate row4'>\n  <div class='small clearfix pad1y space-bottom1'>\n\n    <div class='style-input-wrapper col4'>\n      <fieldset class='clearfix with-icon'>\n        <span class='icon quiet opacity'></span>\n        <input id='fill-opacity' name='fill-opacity' type='number' min='0' max='1' step='.1' class='col12 code js-noTabExit'<%= obj.properties['stroke-opacity'] ? ' value=\"' + obj.properties['fill-opacity'] + '\"' : '' %> />\n\n        <div class='increment increase icon plus keyline-left'></div>\n        <div class='increment decrease icon minus keyline-left keyline-top'></div>\n      </fieldset>\n    </div>\n    <div class='style-input-wrapper margin4 col4'>\n      <input id='fill' name='fill' type='text' class='code center col12' maxlength='7' <%= obj.properties['fill'] ? ' placeholder=\"' + obj.properties['fill'] + '\"' : '' %> />\n    </div>\n\n  </div>\n  <div class='clearfix clip round'>\n    <% _(App.pigment_colors).each(function(color) { %>\n      <input id='<%= context %>-fill-<%=color%>' class='label-select' type='radio' data-geojson='fill.<%= color %>' name='fill' value='#<%=color%>' <%= obj.properties['fill'] === '#' + color ? 'checked' : '' %> />\n      <label for='<%= context %>-fill-<%=color%>' class='dark swatch center clip icon check row1 col1' style='background-color:#<%=color%>'></label>\n    <% }); %>\n  </div>\n</div>\n").template(),
        symbol: _("<div class='pager js-tabs pad1 pill pin-right'>\n  <a href='#marker-edit-symbol-pages' class='col12 quiet full button icon big up round-top quiet'></a>\n  <a href='#marker-edit-symbol-pages' class='col12 quiet full button icon big down round-bottom quiet'></a>\n</div>\n<div id='marker-edit-symbol-pages' class='marker-edit-symbol sliding v active1 clip row4'>\n  <%\n  if (!window.MakiFull) {\n    var icons = window.Maki.slice(0);\n    icons.unshift({ alpha:true, icon:'' });\n    icons = icons.concat(_(10).chain().range().map(function(v) { return { alpha:true, icon:v } }).value());\n    icons = icons.concat(_(26).chain().range().map(function(v) { return { alpha:true, icon:String.fromCharCode(97 + v) } }).value());\n    window.MakiFull = icons;\n  }\n  _(window.MakiFull).chain()\n  .filter(function(icon) { return !icon.tags || icon.tags.indexOf('deprecated') === -1 })\n  .groupBy(function(icon, i) {\n    return Math.floor(i/60);\n  })\n  .each(function(group, i) { %>\n    <div class='animate col12 clearfix row5'>\n    <% _(group).each(function(icon) { %>\n        <input id='<%= context %>-marker-symbol-<%=icon.icon%>' class='label-select' data-geojson='marker-symbol.<%= icon.icon %>' type='radio' name='marker-symbol' value='<%=icon.icon%>' <%= obj['marker-symbol'] === icon.icon ? 'checked' : '' %> />\n      <% if (icon.alpha) { %>\n      <label for='<%= context %>-marker-symbol-<%=icon.icon%>' class='col1 symbol center round'><span class='maki-icon strong alpha'><%=icon.icon%></span></label>\n      <% } else { %>\n      <label for='<%= context %>-marker-symbol-<%=icon.icon%>' class='col1 symbol center round' title='<%=icon.name%>'><span class='maki-icon <%=icon.icon%>'></span></label>\n      <% } %>\n    <% }); %>\n  </div>\n  <% }); %>\n</div>\n").template(),
        style: _("<div class='clearfix space-bottom js-tabs pill'><!--\n--><input id='<%= context %>-marker-size-small' class='label-select' data-geojson='marker-size.small' type='radio' name='marker-size' value='small' <%= obj.properties['marker-size'] === 'small' ? 'checked' : '' %> /><!--\n--><label for='<%= context %>-marker-size-small' class='col3 button'>Small</label><!--\n--><input id='<%= context %>-marker-size-medium' class='label-select' data-geojson='marker-size.medium' type='radio' name='marker-size' value='medium' <%= obj.properties['marker-size'] === 'medium' ? 'checked' : '' %> /><!--\n--><label for='<%= context %>-marker-size-medium' class='col3 button'>Medium</label><!--\n--><input id='<%= context %>-marker-size-large' class='label-select' data-geojson='marker-size.large' type='radio' name='marker-size' value='large' <%= obj.properties['marker-size'] === 'large' ? 'checked' : '' %> /><!--\n--><label for='<%= context %>-marker-size-large' class='col3 button'>Large</label>\n  <div class='col3 row1 style-input-wrapper'>\n    <input id='marker-color' name='marker-color' type='text' class='center code col12 row1 js-noTabExit color-hex' maxlength='7' style=\"padding: 10px 5px;\" <%= obj.properties['marker-color'] ? ' placeholder=\"' + obj.properties['marker-color'] + '\"' : 'placeholder=\"#7d7d7d\"' %> />\n  </div>\n</div>\n<div class='clearfix clip round'>\n  <% _(App.colors).each(function(color) { %>\n  <input id='<%= context %>-marker-color-<%=color%>' class='label-select' type='radio' data-geojson='marker-color.<%= color %>' name='marker-color' value='#<%=color%>' <%= obj.properties['marker-color'] === '#' + color ? 'checked' : '' %> />\n  <label for='<%= context %>-marker-color-<%=color%>' class='dark swatch center clip icon check row1 col1' style='background-color:#<%=color%>'></label>\n  <% }); %>\n</div>\n").template()
    };

    /*
     * API
     *
     * .addFeature: add a GeoJSON feature to the layer
     * .syncUI: make the markers try match features in the layer
     * .enforceDefaults: ensure that a layer has properties, an id, and order
     */
    module.exports = function(App, editor) {
        var exports = _({}).extend(Backbone.Events);
        var halo;

        exports.layer = null;
        exports.model = null;
        exports.editing = null;

        exports.onhashchange = function() {
            if (window.location.hash === '#app') exports.clear();
        };

        exports.addFeature = function(feature) {
            exports.layer.addData(feature);
            return feature;
        };

        function removeHighlight() {
            if (editor.map.hasLayer(halo)) editor.map.removeLayer(halo);
        }

        exports.highlightFeature = function(feature) {
            removeHighlight();
            if (feature.geometry.type == 'Point') {
                var coords = feature.geometry.coordinates;
                halo = L.circleMarker([coords[1], coords[0]], {
                    radius: 30,
                    className: 'marker-highlight'
                });
                editor.map.addLayer(halo);
            }
        };

        exports.enforceDefaults = function(feature) {
            feature.properties = feature.properties || {};
            feature.properties.title = feature.properties.title || '';
            feature.properties.description = feature.properties.description || '';
            feature.properties.id = feature.properties.id || util.makeId();

            var nextOrder = exports.geojson().features.length + 1;
            feature.properties.__order__ = nextOrder;
            return feature;
        };

        // Initialize a fully-new feature, including properties and default styles.
        exports.initializeFeature = function(feature) {
            feature = exports.enforceDefaults(feature);
            feature.properties = _.defaults(feature.properties, defaults[feature.geometry.type]);
            return feature;
        };

        // `silent` can be set to redraw the UI without signaling a change of
        // the Save UI, as used when the page initially loads.
        exports.syncUI = function(silent) {
            var $tray = $('#marker-tray'),
                $items = $tray.find('.tray-item'),
                map = idMap(),
                ids = _.keys(map),
                dirty = false;
            $('#features-tab').text((ids.length > 1 ? ids.length : '') + ' features');
            $items.map(function(idx) {
                var id = $(this).attr('id');
                if (!map[id]) {
                    $(this).remove();
                    dirty = true;
                } else {
                    var title = map[id].toGeoJSON().properties.title;
                    title = (typeof title === 'string') ?
                        title.replace(/<[^<]+>/g, '').trim() :
                        title.toString();

                    $(this).find('.title').text(title);
                    ids = _.without(ids, id);
                }
            });
            ids.forEach(function(id) {
                $tray.append(templates.marker_tray(map[id].toGeoJSON()));
                dirty = true;
            });
            $tray.sortable('destroy').sortable();
            if (dirty && !silent) editor.changed();
            // Enforce DOM emptiness for empty state selectors.
            if (!$('#marker-tray .tray-item').size()) $('#marker-tray').empty();
        };

        var _id = 0;

        exports.concat = function(data) {
            data.features
                .filter(isValid)
                .map(exports.initializeFeature)
                .map(exports.addFeature)
                .map(function(feature) {
                    exports.refresh(feature.properties.id, true);
                });
            exports.syncUI();
            exports.fitFeatures();
            analytics.track('Concatenated Markers');

            function isValid(f) {
                var hints = geojsonHint.hint(JSON.stringify(f));
                if (hints.length) return false;
                return (f.geometry &&
                    (f.geometry.type == 'Polygon' ||
                        f.geometry.type == 'Point' ||
                        f.geometry.type == 'LineString'));
            }
        };

        exports.setAll = function(data) {
            exports.layer.clearLayers();
            exports.concat(data);
        };

        exports.fitFeatures = function() {
            var bounds = exports.layer.getBounds();
            if (bounds.isValid()) editor.map.fitBounds(bounds, {
                paddingTopLeft: [0, 240],
                paddingBottomRight: [0, 40]
            });
        };

        // Clear active editing state.
        exports.clear = function() {
            if (exports.layer) exports.layer.eachLayer(disableLayer);
            $('#marker-edit').empty();
            removeHighlight();
            delete exports.editing;
        };

        // Open the editing UI for a marker given id
        exports.edit = function(id, noedit) {
            // Don't re-initialize edit interface when clicking on current marker.
            if (exports.editing && exports.editing.properties.id === id) return;

            // Enable dragging only on active marker
            exports.layer.eachLayer(disableLayer);

            var layer = layerById(id);
            exports.highlightFeature(layer.toGeoJSON());

            var feature = layer.toGeoJSON();
            var props = feature.properties;
            var popup = (props.title || props.description) &&
                L.mapbox.marker.createPopup(feature);

            // Bind popup
            if (popup) {
                layer.bindPopup(popup, { closeButton: false });
            } else {
                layer.closePopup();
            }

            // center if geometry is outside of view
            var geom = (layer.feature.geometry.type == "Point") ? layer._latlng : layer.getBounds();
            if (!editor.map.getBounds().contains(geom)) {
                if (layer.feature.geometry.type == "Point") {
                    editor.map.panTo(geom);
                } else {
                    editor.map.fitBounds(geom);
                }
            }

            if (!noedit) {
                if (layer instanceof L.Marker) {
                    layer._icon.className += ' marker-editing';
                    layer.dragging.enable();
                } else {
                    layer.editing.enable();
                }
            }
            editor.map.closePopup();
            layer.openPopup(getCenter(layer));
            exports.editing = layer.toGeoJSON();

            var $selectedMarker = $('#' + id);

            var type = layer.toGeoJSON().geometry.type;
            if (type === 'Point') {
                var coords = exports.editing.geometry.coordinates;
                coords = L.latLng(coords[1], coords[0]).wrap();
                exports.editing.geometry.coordinates[0] = coords.lng;
                exports.editing.geometry.coordinates[1] = coords.lat;
                $('#marker-edit').html(templates.marker_edit({
                    feature: exports.editing,
                    symbol_template: templates.symbol,
                    style_template: templates.style
                }));
            } else {
                var template = (type === 'Polygon') ?
                    templates.polygon_edit:
                    templates.line_edit;
                $('#marker-edit').html(template({
                    feature: exports.editing,
                    fill_template: templates.fill,
                    stroke_template: templates.stroke
                }));
                window.location.hash = '#data';
            }

            exports.trigger('edit', type.toLowerCase(), true);
        };

        // Delete the given marker.
        exports.del = function(id) {
            if (!exports.layer) throw new Error('No layer to edit');

            exports.clear();
            exports.layer.eachLayer(removeLayer);
            exports.model.set('features', exports.layer.toGeoJSON().features);
            exports.syncUI();

            function removeLayer(l) {
                if (l.toGeoJSON().properties.id === id) {
                    exports.layer.removeLayer(l);
                }
            }

            exports.trigger('del');
        };

        // Save the markers.
        exports.save = function(callback) {
            if (!exports.model) return callback();
            var features = exports.layer.toGeoJSON().features;
            exports.model.set('features', serializeOrder(features));
            App.save(exports.model, callback);
        };


        exports.geojson = function() {
            return exports.layer.toGeoJSON();
        };

        // Refresh the icon, popup on a given feature to show a live preview
        // while editing
        //
        // `silent` means that this is part of a large group of features
        exports.refresh = function(id, silent) {
            var l = layerById(id),
                feature = l.toGeoJSON();

            // Set editing class + set the new default marker template.
            if (exports.editing && exports.editing.properties.id === id) {
                if (l instanceof L.Marker) {
                    l._icon.className += ' marker-editing';
                    defaults.Point = _(exports.editing.properties).reduce(function(memo, val, key) {
                        if ((/marker-(color|symbol|size)/).test(key)) memo[key] = val;
                        return memo;
                    }, { title:'', description:'' });
                    l.setIcon(L.mapbox.marker.icon(feature.properties));
                } else {
                    defaults[feature.geometry.type] = _(exports.editing.properties).reduce(function(memo, val, key) {
                        if ((/stroke/).test(key)) memo[key] = val;
                        if ((/fill/).test(key)) memo[key] = val;
                        return memo;
                    }, { title:'', description:'' });
                    l.setStyle(simplestylePath(feature));
                }
            }

            // Refresh popup, disable fading for re-rendering.
            var fade = editor.map.options.fadeAnimation;
            if (l._popup) editor.map.options.fadeAnimation = false;

            var props = feature.properties;
            var popup = (props.title || props.description) &&
                L.mapbox.marker.createPopup(feature);

            if (popup) {
                l.unbindPopup();
                l.bindPopup(popup, { closeButton: false });
                if (!silent) l.openPopup(getCenter(l));
            } else {
                l.closePopup();
                l.unbindPopup();
            }

            // Update color swatches in vtabs
            $('#color-stroke').css('background',props.stroke);
            $('#color-fill').css('background',props.fill);

            editor.map.options.fadeAnimation = fade;
        };

        // Initialize.
        // Skip fetch if map is new -- there are no prior markers made.
        var fetch = !editor.model.get('new') ? App.fetch : function(url,cb) { return cb(); };

        fetch('/api/Markers/' + editor.model.id, markersLoaded);

        function markersLoaded(err, model) {
            if (err && err.status !== 404) return Views.modal.show('err', err);
            if (!model) {
                exports.model = new Backbone.Model({ id: editor.model.id, features: [] });
                exports.model.url = App.api + '/api/Markers/' + editor.model.id;
            } else {
                exports.model = model;
            }

            exports.layer = new L.geoJson(null, {
                pointToLayer: pointToLayer,
                style: simplestylePath
            }).addTo(editor.map)
                .on('layeradd', augmentLayer)
                .on('click', layerClick);

            function pointToLayer(feature, latlon) {
                if (!feature.properties) feature.properties = {};
                return L.mapbox.marker.style(feature, latlon);
            }

            exports.layer.addData(assignOrder(exports.model.toJSON()));

            $('#marker-tray')
                .sortable()
                .bind('sortupdate', onSortUpdate);

            exports.syncUI(true);

            // @TODO done currently to set dragging to disabled on init.
            exports.clear();

            // needed here because the project_info template is rendered before markers are initialized
            if (exports.layer.toGeoJSON().features.length) $('#downloads').show();

            function augmentLayer(e) {
                var l = e.layer;
                l.on('dragstart', removeHighlight)
                    .on('dragend', onfeatureedit)
                    .on('edit', onfeatureedit)
                    .on('move', onfeatureedit);
                // if for multipolygon error, need to investigate
                if (l.options) l.options.draggable = true;
            }

            function onfeatureedit(e) {
                var feature = e.target.toGeoJSON();
                exports.highlightFeature(feature);
                exports.model.set('features', exports.layer.toGeoJSON());
                if (e.type == 'dragend') {
                    $('#latitude').val(feature.geometry.coordinates[1]);
                    $('#longitude').val(feature.geometry.coordinates[0]);
                }
                editor.changed();
            }
        }

        function assignOrder(f) {
            for (var i = 0; i < f.features.length; i++) {
                if (!f.features[i].properties) {
                    f.features[i].properties = {};
                    f.features[i].properties.id = 'marker-' + (+new Date()).toString(36);
                }
                f.features[i].properties.__order__ = i;
            }
            return f;
        }

        function panToLayer(map, feature) {
            var zoomLevel;
            if (feature instanceof L.Marker) {
                map.setView(feature.getLatLng());
            } else if ('getBounds' in feature && feature.getBounds().isValid()) {
                map.fitBounds(feature.getBounds(), {
                    paddingTopLeft: [0, 240],
                    paddingBottomRight: [0, 40]
                });
            }
        }

        function layerClick(e) {
            if (App.canedit) {
                exports.edit(e.layer.toGeoJSON().properties.id);
                window.location.hash = '#data';
            }
        }

        function onSortUpdate(ev, ui) {
            var map = idMap();
            $('#marker-tray a').each(function(idx) {
                map[$(this).attr('id')].toGeoJSON().properties.__order__ = idx;
            });
            editor.changed();
        }

        function disableLayer(l) {
            if (l instanceof L.Marker) {
                l._icon.className = l._icon.className.replace(/ marker-editing/g, '');
                l.dragging.disable();
                l.closePopup();
            } else {
                // multipolygons don't like this, need a way of handling them
                if (l.editing) l.editing.disable();
            }
        }

        function idMap() {
            var m = {};
            exports.layer.eachLayer(function(l) {
                m[l.toGeoJSON().properties.id] = l;
            });
            return m;
        }

        function layerById(id) {
            return idMap()[id];
        }

        exports.layerById = layerById;

        return exports;
    };

    function serializeOrder(features) {
        return features
            .sort(sortByOrder)
            .map(removeOrder);
    }

    function sortByOrder(a, b) {
        return a.properties.__order__ - b.properties.__order__;
    }

    function removeOrder(feat) {
        var cloned = _.clone(feat);
        cloned.properties = _.clone(cloned.properties);
        delete cloned.properties.__order__;
        return cloned;
    }

},{"./lib/defaults":16,"./lib/getcenter":19,"./lib/simplestyle":23,"./lib/util":24,"fs":29,"geojsonhint":6}],27:[function(require,module,exports){
    var fs = require('fs');

    var templates = {
        style_tint: _("<%\n  var keys = {};\n  keys['whiz'] = 'Recipe';\n  keys['streets'] = 'Streets';\n  if (type !== 'satellite') keys['buildings'] = 'Buildings';\n  if (type === 'streets') keys['landuse']   = 'Areas';\n  if (type === 'terrain') keys['base.live-landuse-tr'] = 'Areas';\n  if (type !== 'satellite') keys['water'] = 'Water';\n  if (type === 'streets') keys['bg'] = 'Land';\n  if (type === 'terrain') keys['base.live-land-tr'] = 'Terrain';\n  if (type === 'satellite') keys['base.live-satellite'] = 'Satellite';\n  %>\n<div class='animate col12 clip keyline-top style-container sliding h active3 row4'>\n  <% _(keys).each(function(label, id) { %>\n  <% if (id === 'whiz') { %>\n  <div id='style-swatches' class='animate col12 row4 pad1y pad2x'>\n    <div class='round clip col12 clearfix'>\n      <% _(Streets.recipes.streets.swatches).each(function(color) { %>\n      <input id='style-swatches-<%=color%>' class='label-select' type='radio' name='style-tint-whiz-swatches' value='#<%=color%>' />\n      <label for='style-swatches-<%=color%>' class='swatch center big clip icon dark check col4' style='background-color:#<%=color%>'></label>\n      <% }); %>\n    </div>\n    <div class='col12 pad1y'>\n      <span class='hint small icon info'>Select a preset style.</span>\n      <a href='#style' id='palette-custom' class='fr small palette icon levels'>Customize</a>\n    </div>\n  </div>\n  <% } %>\n  <div id='style-tint-<%=id.replace('.','-')%>' class='animate col12 color-picker row4 pad1y pad2x'>\n    <input type='hidden' name='id' value='<%=id%>' />\n    <% if (id !== 'whiz') { %>\n    <div class='clearfix'>\n      <div class='col8 animate contain picker'>\n        <div class='color-sl'><a></a></div>\n        <div class='color-h clip'><a></a></div>\n        <fieldset class='hex'>\n          <input type='text' placeholder='#000000' class='center code animate stretch color-hex js-noTabExit' maxlength='7'/>\n        </fieldset>\n      </div>\n      <div class='row3 col4 filter-sliders'>\n        <label class='block quiet truncate'>Filter intensity</label>\n        <small class='clearfix contain'>\n          <input class='clamp col8' name='hd' type='range' value='0' min='0' max='0.5' step='0.01' />\n          <span class='col2 micro center'>H</span>\n          <span class='col1 micro quiet value'></span>\n        </small>\n        <small class='clearfix contain'>\n          <input class='clamp col8' name='sd' type='range' value='0' min='0' max='0.5' step='0.01' />\n          <span class='col2 micro center'>S</span>\n          <span class='col1 micro quiet value'></span>\n        </small>\n        <small class='clearfix contain'>\n          <input class='clamp col8' name='ld' type='range' value='0' min='0' max='0.5' step='0.01' />\n          <span class='col2 micro center'>L</span>\n          <span class='col1 micro quiet value'></span>\n        </small>\n        <% if (['bg','base.live-satellite','base.live-land-tr'].indexOf(id) === -1) { %>\n        <small class='clearfix contain'>\n          <input class='clamp col8' name='a' type='range' value='0' min='0' max='1' step='0.01' />\n          <span class='col2 micro center'>A</span>\n          <span class='col1 micro quiet value'></span>\n        </small>\n        <% } %>\n      </div>\n    </div>\n    <div class='col12 pad1y clearfix'>\n      <% if (['base.live-satellite','base.live-land-tr'].indexOf(id) === -1) { %>\n      <a href='#style-tint-<%=id.replace('.','-')%>' class='small quiet disable icon eye'>Hide</a>\n      <a href='#style-tint-<%=id.replace('.','-')%>' class='small quiet enable icon noeye'>Show</a>\n      <% } %>\n      <% if (id !== 'bg') { %>\n        <a href='#' class='pad1x small quiet icon l-r-arrow inline invert'>Invert</a>\n      <% } %>\n      <a href='#style' id='palette-streets' class='fr small palette icon close'>Discard palette</a>\n    </div>\n    <% } else { %>\n    <div class='col12 animate contain picker'>\n      <div class='color-sl'><a></a></div>\n      <div class='color-h clip'><a></a></div>\n      <fieldset class='hex'>\n        <input type='text' placeholder='#000000' class='center code animate stretch color-hex js-noTabExit' maxlength='7'/>\n      </fieldset>\n    </div>\n    <div class='col12 pad1y clearfix'>\n      <span class='hint small inline icon info'>Generate a new style.</span>\n      <a href='#style' id='palette-custom' class='fr small palette icon levels'>Customize</a>\n    </div>\n    <% } %>\n  </div>\n<% }); %>\n</div>\n<div class='palette-tabs animate clip row1 pin-top'>\n  <div id='palette-tabs-recipes' class='js-tabs pill animate row1 pin-top pad2x'>\n    <% _(Streets.recipes).each(function(recipe, id) { %>\n    <a href='#style-tint' id='palette-<%=id%>' class='<%=id === \"streets\" ? \"active\" : \"\"%> button palette col3'><%= recipe.name.replace('Streets','Presets') %></a>\n    <% }); %>\n  </div>\n  <div class='color-tabs animate row1 clip contain animate pin-top pad2x'><!--\n    <% _(keys).each(function(label, id) { %>\n    <% if (id === 'whiz') { %>\n    --><a href='#style-tint-whiz-swatches' class='hidden'></a><!--\n    --><a href='#style-tint-whiz' class='hidden'></a><!--\n    <% } else { %>\n    --><a href='#style-tint-<%=id.replace('.','-')%>' class='center quiet row1 pad1 contain fl <%= id === 'streets' ? 'active' : '' %>'>\n      <span class='swatch animate pin-top pin-bottom' id='style-tab-<%=id.replace('.','-')%>'><span class='small'><%=label.replace(/Building*s?/i,'bdgs').replace('landuse','areas')%></span></span>\n    </a><!--\n    <% } %>\n    <% }); %>\n  --></div>\n</div>\n").template()
    };

    module.exports = function(App, editor) {
        var exports = {};

        // Work on styles get stashed here if the map `type` is switched so
        // that they can be restored later if the type is switched back.
        exports.stash = {};

        // The current set of styles being edited.
        exports.styles = null;

        // Return the parent color picker for a given event.
        exports.id = function(ev) {
            return $('input[name=id]', $(ev.currentTarget).parents('.color-picker')).val();
        };

        // Refresh the current map layer to reflect style changes.
        // @TODO should the _setTileJSON method be public upstream?
        exports.refresh = _(function() {
            var plus = _(editor.model.get('layers')).filter(function(id) { return id.indexOf('base.') === -1; });
            var layers = Streets.styles2layers(exports.styles).concat(plus);
            if (_(editor.model.get('layers')).isEqual(layers)) return;
            editor.model.set({layers:layers});
        }).debounce(500);

        // Set/get the abstract "type" represented by a combination of styles.
        exports.type = function(val) {
            if (val && !(/^(streets|satellite|terrain)$/).test(val))
                throw new Error('style: type must be one of streets, terrain, satellite');

            // A stash for this type exists. Switch to it.
            // @TODO handling other layers this way? Or do they exist in
            // some other hash/management config entirely?
            if (val && exports.stash[val]) {
                exports.styles = exports.stash[val];
            } else if (val) {
                exports.styles = exports.stash[val] = Streets.styles({
                    streets: ['base.mapbox-streets+bg-e8e0d8_landuse_water_buildings_streets'],
                    terrain: ['base.live-land-tr','base.live-landuse-tr','base.mapbox-streets+bg-e8e0d8_landuse_water_buildings_streets'],
                    satellite: ['base.live-satellite','base.mapbox-streets+streets-0.00x0.00;0.00x0.00;1.00x0.00;0x1.00']
                }[val]);
            }
            return Streets.type(exports.styles);
        };

        // Set/get the l10n option of base.mapbox-streets.
        exports.l10n = function(val) {
            if (typeof val === 'string') {
                exports.styles.l10n = val;
            }
            return exports.styles.l10n || '';
        };

        // Set/get the scale option of base.mapbox-streets.
        exports.scale = function(val) {
            if (val) exports.styles.scale = val;
            return exports.styles.scale;
        };

        // Set/get the active whiz palette.
        exports.palette = function(id, skiprefresh) {
            if (!exports.styles.whiz) throw new Error('No whiz style found.');
            if (id) {
                $('#palette-' + id).addClass('active').siblings().removeClass('active');
                $('#style-tint .sliding.h')
                    .removeClass('active1 active2 active3 active4 active5 active6 active7')
                    .addClass(Streets.recipes[id].swatches ? 'active1' : 'active2');
                var palette = exports.palettes(exports.styles.whiz)[id];
                _(palette).each(function(hsl, i) {
                    if (!exports.styles[i]) return;
                    exports.styles[i].h = hsl.h;
                    exports.styles[i].s = hsl.s;
                    exports.styles[i].l = hsl.l;
                    exports.styles[i].a = hsl.a;
                    exports.styles[i].hd = hsl.hd;
                    exports.styles[i].sd = hsl.sd;
                    exports.styles[i].ld = hsl.ld;
                    exports.styles[i].on = hsl.on;
                    exports.styles[i].inv = !!hsl.inv;
                    exports.render(i, null, skiprefresh);
                });
                if (palette.swatch) $('#style-swatches-' + palette.swatch).prop('checked', true);
                exports.styles.whiz.palette = id;
            }
            return exports.styles.whiz.palette;
        };

        // Generate palette data from an HSL.
        exports.palettes = function(hsl) {
            return _(Streets.recipes).reduce(function(memo, op, id) {
                memo[id] = op.hsl(hsl, exports.type());
                return memo;
            }, {});
        };

        // Render results of alterations to form and map display.
        exports.render = function(id, skipinput, skiprefresh) {
            // Bail if requested id has no style.
            if (typeof exports.styles[id] !== 'object') return;

            var s = exports.styles[id];
            var p = $(document.getElementById('style-tint-' + id.replace('.','-')));
            var tab = $(document.getElementById('style-tab-' + id.replace('.','-')));
            $('div.color-h > a',p).css({'left':s.h*100+'%'});
            $('div.color-sl',p).css({'background-color':'#'+Streets.style2hue(s)});
            $('div.color-sl > a',p).css({'left':s.s*100+'%', 'bottom':Math.min(1, s.l / (1-(s.s*0.5)))*100+'%'});
            $('input.color-hex',p).css({'background-color':Streets.style2rgba(s)});
            $('fieldset.hex',p)[s.l > 0.5 ? 'removeClass' : 'addClass']('dark');
            tab.css({'background-color':Streets.hsl2rgba(Streets.style2swatch(s, id))});
            if (s.inv) {
                $(tab)[s.l < 0.75 || s.ld > 0.4 ? 'addClass' : 'removeClass']('dark');
            } else {
                $(tab)[s.l > 0.5 || s.ld > 0.25 ? 'removeClass' : 'addClass']('dark');
            }
            p[s.inv?'addClass':'removeClass']('inverted');
            p[s.on?'removeClass':'addClass']('disabled');
            tab[s.on?'removeClass':'addClass']('disabled');
            if (!skipinput) {
                $('input[name="hd"]', p).val(0.5 - s.hd);
                $('input[name="sd"]', p).val(0.5 - s.sd);
                $('input[name="ld"]', p).val(0.5 - s.ld);
                $('input[name="a"]', p).val(s.a);
                $('input.color-hex',p).val('#' + Streets.style2hex(s));
            }
            var shorthd = (1 - s.hd.toFixed(2)) * 100 + '%';
            var shortsd = (1 - s.sd.toFixed(2)) * 100 + '%';
            var shortld = (1 - s.ld.toFixed(2)) * 100 + '%';
            var shorta = s.a.toFixed(2) * 100 + '%';
            $('input[name="hd"]', p).siblings('.value').text(shorthd);
            $('input[name="sd"]', p).siblings('.value').text(shortsd);
            $('input[name="ld"]', p).siblings('.value').text(shortld);
            $('input[name="a"]', p).siblings('.value').text(shorta);

            if (id === 'whiz' && !skiprefresh && exports.palette()) {
                exports.palette(exports.palette());
            } else if (!skiprefresh) {
                exports.refresh();
            }
        };

        // Template and setup markup for coloring interface. Needs to be re-run
        // whenever the baselayer type is changed.
        exports.make = function() {
            $('#style-tint').html(templates.style_tint({
                type:exports.type()
            }));
            _(exports.styles).each(function(style, id) {
                exports.render(id, false, true);
            });
        };

        // Init sequence.
        exports.styles = Streets.styles(editor.model.get('layers'));
        exports.stash[exports.type()] = exports.styles;
        exports.make();
        $('#style-type-' + exports.type()).prop('checked', true);
        $('#style-l10n-' + exports.l10n()).prop('checked', true);
        $('#style-2x').prop('checked', exports.scale() === 2);
        return exports;
    };

},{"fs":29}],28:[function(require,module,exports){


//
// The shims in this file are not fully implemented shims for the ES5
// features, but do work for the particular usecases there is in
// the other modules.
//

    var toString = Object.prototype.toString;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

// Array.isArray is supported in IE9
    function isArray(xs) {
        return toString.call(xs) === '[object Array]';
    }
    exports.isArray = typeof Array.isArray === 'function' ? Array.isArray : isArray;

// Array.prototype.indexOf is supported in IE9
    exports.indexOf = function indexOf(xs, x) {
        if (xs.indexOf) return xs.indexOf(x);
        for (var i = 0; i < xs.length; i++) {
            if (x === xs[i]) return i;
        }
        return -1;
    };

// Array.prototype.filter is supported in IE9
    exports.filter = function filter(xs, fn) {
        if (xs.filter) return xs.filter(fn);
        var res = [];
        for (var i = 0; i < xs.length; i++) {
            if (fn(xs[i], i, xs)) res.push(xs[i]);
        }
        return res;
    };

// Array.prototype.forEach is supported in IE9
    exports.forEach = function forEach(xs, fn, self) {
        if (xs.forEach) return xs.forEach(fn, self);
        for (var i = 0; i < xs.length; i++) {
            fn.call(self, xs[i], i, xs);
        }
    };

// Array.prototype.map is supported in IE9
    exports.map = function map(xs, fn) {
        if (xs.map) return xs.map(fn);
        var out = new Array(xs.length);
        for (var i = 0; i < xs.length; i++) {
            out[i] = fn(xs[i], i, xs);
        }
        return out;
    };

// Array.prototype.reduce is supported in IE9
    exports.reduce = function reduce(array, callback, opt_initialValue) {
        if (array.reduce) return array.reduce(callback, opt_initialValue);
        var value, isValueSet = false;

        if (2 < arguments.length) {
            value = opt_initialValue;
            isValueSet = true;
        }
        for (var i = 0, l = array.length; l > i; ++i) {
            if (array.hasOwnProperty(i)) {
                if (isValueSet) {
                    value = callback(value, array[i], i, array);
                }
                else {
                    value = array[i];
                    isValueSet = true;
                }
            }
        }

        return value;
    };

// String.prototype.substr - negative index don't work in IE8
    if ('ab'.substr(-1) !== 'b') {
        exports.substr = function (str, start, length) {
            // did we get a negative start, calculate how much it is from the beginning of the string
            if (start < 0) start = str.length + start;

            // call the original function
            return str.substr(start, length);
        };
    } else {
        exports.substr = function (str, start, length) {
            return str.substr(start, length);
        };
    }

// String.prototype.trim is supported in IE9
    exports.trim = function (str) {
        if (str.trim) return str.trim();
        return str.replace(/^\s+|\s+$/g, '');
    };

// Function.prototype.bind is supported in IE9
    exports.bind = function () {
        var args = Array.prototype.slice.call(arguments);
        var fn = args.shift();
        if (fn.bind) return fn.bind.apply(fn, args);
        var self = args.shift();
        return function () {
            fn.apply(self, args.concat([Array.prototype.slice.call(arguments)]));
        };
    };

// Object.create is supported in IE9
    function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = { '__proto__' : null };
        }
        else {
            if (typeof prototype !== 'object') {
                throw new TypeError(
                    'typeof prototype[' + (typeof prototype) + '] != \'object\''
                );
            }
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            object.__proto__ = prototype;
        }
        if (typeof properties !== 'undefined' && Object.defineProperties) {
            Object.defineProperties(object, properties);
        }
        return object;
    }
    exports.create = typeof Object.create === 'function' ? Object.create : create;

// Object.keys and Object.getOwnPropertyNames is supported in IE9 however
// they do show a description and number property on Error objects
    function notObject(object) {
        return ((typeof object != "object" && typeof object != "function") || object === null);
    }

    function keysShim(object) {
        if (notObject(object)) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var result = [];
        for (var name in object) {
            if (hasOwnProperty.call(object, name)) {
                result.push(name);
            }
        }
        return result;
    }

// getOwnPropertyNames is almost the same as Object.keys one key feature
//  is that it returns hidden properties, since that can't be implemented,
//  this feature gets reduced so it just shows the length property on arrays
    function propertyShim(object) {
        if (notObject(object)) {
            throw new TypeError("Object.getOwnPropertyNames called on a non-object");
        }

        var result = keysShim(object);
        if (exports.isArray(object) && exports.indexOf(object, 'length') === -1) {
            result.push('length');
        }
        return result;
    }

    var keys = typeof Object.keys === 'function' ? Object.keys : keysShim;
    var getOwnPropertyNames = typeof Object.getOwnPropertyNames === 'function' ?
        Object.getOwnPropertyNames : propertyShim;

    if (new Error().hasOwnProperty('description')) {
        var ERROR_PROPERTY_FILTER = function (obj, array) {
            if (toString.call(obj) === '[object Error]') {
                array = exports.filter(array, function (name) {
                    return name !== 'description' && name !== 'number' && name !== 'message';
                });
            }
            return array;
        };

        exports.keys = function (object) {
            return ERROR_PROPERTY_FILTER(object, keys(object));
        };
        exports.getOwnPropertyNames = function (object) {
            return ERROR_PROPERTY_FILTER(object, getOwnPropertyNames(object));
        };
    } else {
        exports.keys = keys;
        exports.getOwnPropertyNames = getOwnPropertyNames;
    }

// Object.getOwnPropertyDescriptor - supported in IE8 but only on dom elements
    function valueObject(value, key) {
        return { value: value[key] };
    }

    if (typeof Object.getOwnPropertyDescriptor === 'function') {
        try {
            Object.getOwnPropertyDescriptor({'a': 1}, 'a');
            exports.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        } catch (e) {
            // IE8 dom element issue - use a try catch and default to valueObject
            exports.getOwnPropertyDescriptor = function (value, key) {
                try {
                    return Object.getOwnPropertyDescriptor(value, key);
                } catch (e) {
                    return valueObject(value, key);
                }
            };
        }
    } else {
        exports.getOwnPropertyDescriptor = valueObject;
    }

},{}],29:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],30:[function(require,module,exports){
    var process=require("__browserify_process");// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

    var util = require('util');
    var shims = require('_shims');

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
    function normalizeArray(parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === '.') {
                parts.splice(i, 1);
            } else if (last === '..') {
                parts.splice(i, 1);
                up++;
            } else if (up) {
                parts.splice(i, 1);
                up--;
            }
        }

        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
            for (; up--; up) {
                parts.unshift('..');
            }
        }

        return parts;
    }

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
    var splitPathRe =
        /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var splitPath = function(filename) {
        return splitPathRe.exec(filename).slice(1);
    };

// path.resolve([from ...], to)
// posix version
    exports.resolve = function() {
        var resolvedPath = '',
            resolvedAbsolute = false;

        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = (i >= 0) ? arguments[i] : process.cwd();

            // Skip empty and invalid entries
            if (!util.isString(path)) {
                throw new TypeError('Arguments to path.resolve must be strings');
            } else if (!path) {
                continue;
            }

            resolvedPath = path + '/' + resolvedPath;
            resolvedAbsolute = path.charAt(0) === '/';
        }

        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)

        // Normalize the path
        resolvedPath = normalizeArray(shims.filter(resolvedPath.split('/'), function(p) {
            return !!p;
        }), !resolvedAbsolute).join('/');

        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
    };

// path.normalize(path)
// posix version
    exports.normalize = function(path) {
        var isAbsolute = exports.isAbsolute(path),
            trailingSlash = shims.substr(path, -1) === '/';

        // Normalize the path
        path = normalizeArray(shims.filter(path.split('/'), function(p) {
            return !!p;
        }), !isAbsolute).join('/');

        if (!path && !isAbsolute) {
            path = '.';
        }
        if (path && trailingSlash) {
            path += '/';
        }

        return (isAbsolute ? '/' : '') + path;
    };

// posix version
    exports.isAbsolute = function(path) {
        return path.charAt(0) === '/';
    };

// posix version
    exports.join = function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return exports.normalize(shims.filter(paths, function(p, index) {
            if (!util.isString(p)) {
                throw new TypeError('Arguments to path.join must be strings');
            }
            return p;
        }).join('/'));
    };


// path.relative(from, to)
// posix version
    exports.relative = function(from, to) {
        from = exports.resolve(from).substr(1);
        to = exports.resolve(to).substr(1);

        function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
                if (arr[start] !== '') break;
            }

            var end = arr.length - 1;
            for (; end >= 0; end--) {
                if (arr[end] !== '') break;
            }

            if (start > end) return [];
            return arr.slice(start, end - start + 1);
        }

        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));

        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
            }
        }

        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push('..');
        }

        outputParts = outputParts.concat(toParts.slice(samePartsLength));

        return outputParts.join('/');
    };

    exports.sep = '/';
    exports.delimiter = ':';

    exports.dirname = function(path) {
        var result = splitPath(path),
            root = result[0],
            dir = result[1];

        if (!root && !dir) {
            // No dirname whatsoever
            return '.';
        }

        if (dir) {
            // It has a dirname, strip trailing slash
            dir = dir.substr(0, dir.length - 1);
        }

        return root + dir;
    };


    exports.basename = function(path, ext) {
        var f = splitPath(path)[2];
        // TODO: make this comparison case-insensitive on windows?
        if (ext && f.substr(-1 * ext.length) === ext) {
            f = f.substr(0, f.length - ext.length);
        }
        return f;
    };


    exports.extname = function(path) {
        return splitPath(path)[3];
    };

},{"__browserify_process":33,"_shims":28,"util":31}],31:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

    var shims = require('_shims');

    var formatRegExp = /%[sdj%]/g;
    exports.format = function(f) {
        if (!isString(f)) {
            var objects = [];
            for (var i = 0; i < arguments.length; i++) {
                objects.push(inspect(arguments[i]));
            }
            return objects.join(' ');
        }

        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function(x) {
            if (x === '%%') return '%';
            if (i >= len) return x;
            switch (x) {
                case '%s': return String(args[i++]);
                case '%d': return Number(args[i++]);
                case '%j':
                    try {
                        return JSON.stringify(args[i++]);
                    } catch (_) {
                        return '[Circular]';
                    }
                default:
                    return x;
            }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
            if (isNull(x) || !isObject(x)) {
                str += ' ' + x;
            } else {
                str += ' ' + inspect(x);
            }
        }
        return str;
    };

    /**
     * Echos the value of a value. Trys to print the value out
     * in the best way possible given the different types.
     *
     * @param {Object} obj The object to print out.
     * @param {Object} opts Optional options object that alters the output.
     */
    /* legacy: obj, showHidden, depth, colors*/
    function inspect(obj, opts) {
        // default options
        var ctx = {
            seen: [],
            stylize: stylizeNoColor
        };
        // legacy...
        if (arguments.length >= 3) ctx.depth = arguments[2];
        if (arguments.length >= 4) ctx.colors = arguments[3];
        if (isBoolean(opts)) {
            // legacy...
            ctx.showHidden = opts;
        } else if (opts) {
            // got an "options" object
            exports._extend(ctx, opts);
        }
        // set default options
        if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
        if (isUndefined(ctx.depth)) ctx.depth = 2;
        if (isUndefined(ctx.colors)) ctx.colors = false;
        if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
        if (ctx.colors) ctx.stylize = stylizeWithColor;
        return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    inspect.colors = {
        'bold' : [1, 22],
        'italic' : [3, 23],
        'underline' : [4, 24],
        'inverse' : [7, 27],
        'white' : [37, 39],
        'grey' : [90, 39],
        'black' : [30, 39],
        'blue' : [34, 39],
        'cyan' : [36, 39],
        'green' : [32, 39],
        'magenta' : [35, 39],
        'red' : [31, 39],
        'yellow' : [33, 39]
    };

// Don't use 'blue' not visible on cmd.exe
    inspect.styles = {
        'special': 'cyan',
        'number': 'yellow',
        'boolean': 'yellow',
        'undefined': 'grey',
        'null': 'bold',
        'string': 'green',
        'date': 'magenta',
        // "name": intentionally not styling
        'regexp': 'red'
    };


    function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];

        if (style) {
            return '\u001b[' + inspect.colors[style][0] + 'm' + str +
                '\u001b[' + inspect.colors[style][1] + 'm';
        } else {
            return str;
        }
    }


    function stylizeNoColor(str, styleType) {
        return str;
    }


    function arrayToHash(array) {
        var hash = {};

        shims.forEach(array, function(val, idx) {
            hash[val] = true;
        });

        return hash;
    }


    function formatValue(ctx, value, recurseTimes) {
        // Provide a hook for user-specified inspect functions.
        // Check that value is an object with an inspect function on it
        if (ctx.customInspect &&
            value &&
            isFunction(value.inspect) &&
            // Filter out the util module, it's inspect function is special
            value.inspect !== exports.inspect &&
            // Also filter out any prototype objects using the circular check.
            !(value.constructor && value.constructor.prototype === value)) {
            var ret = value.inspect(recurseTimes);
            if (!isString(ret)) {
                ret = formatValue(ctx, ret, recurseTimes);
            }
            return ret;
        }

        // Primitive types cannot have properties
        var primitive = formatPrimitive(ctx, value);
        if (primitive) {
            return primitive;
        }

        // Look up the keys of the object.
        var keys = shims.keys(value);
        var visibleKeys = arrayToHash(keys);

        if (ctx.showHidden) {
            keys = shims.getOwnPropertyNames(value);
        }

        // Some type of object without properties can be shortcutted.
        if (keys.length === 0) {
            if (isFunction(value)) {
                var name = value.name ? ': ' + value.name : '';
                return ctx.stylize('[Function' + name + ']', 'special');
            }
            if (isRegExp(value)) {
                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
            }
            if (isDate(value)) {
                return ctx.stylize(Date.prototype.toString.call(value), 'date');
            }
            if (isError(value)) {
                return formatError(value);
            }
        }

        var base = '', array = false, braces = ['{', '}'];

        // Make Array say that they are Array
        if (isArray(value)) {
            array = true;
            braces = ['[', ']'];
        }

        // Make functions say that they are functions
        if (isFunction(value)) {
            var n = value.name ? ': ' + value.name : '';
            base = ' [Function' + n + ']';
        }

        // Make RegExps say that they are RegExps
        if (isRegExp(value)) {
            base = ' ' + RegExp.prototype.toString.call(value);
        }

        // Make dates with properties first say the date
        if (isDate(value)) {
            base = ' ' + Date.prototype.toUTCString.call(value);
        }

        // Make error with message first say the error
        if (isError(value)) {
            base = ' ' + formatError(value);
        }

        if (keys.length === 0 && (!array || value.length == 0)) {
            return braces[0] + base + braces[1];
        }

        if (recurseTimes < 0) {
            if (isRegExp(value)) {
                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
            } else {
                return ctx.stylize('[Object]', 'special');
            }
        }

        ctx.seen.push(value);

        var output;
        if (array) {
            output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
        } else {
            output = keys.map(function(key) {
                return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
            });
        }

        ctx.seen.pop();

        return reduceToSingleString(output, base, braces);
    }


    function formatPrimitive(ctx, value) {
        if (isUndefined(value))
            return ctx.stylize('undefined', 'undefined');
        if (isString(value)) {
            var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                .replace(/'/g, "\\'")
                .replace(/\\"/g, '"') + '\'';
            return ctx.stylize(simple, 'string');
        }
        if (isNumber(value))
            return ctx.stylize('' + value, 'number');
        if (isBoolean(value))
            return ctx.stylize('' + value, 'boolean');
        // For some reason typeof null is "object", so special case here.
        if (isNull(value))
            return ctx.stylize('null', 'null');
    }


    function formatError(value) {
        return '[' + Error.prototype.toString.call(value) + ']';
    }


    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];
        for (var i = 0, l = value.length; i < l; ++i) {
            if (hasOwnProperty(value, String(i))) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                    String(i), true));
            } else {
                output.push('');
            }
        }

        shims.forEach(keys, function(key) {
            if (!key.match(/^\d+$/)) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                    key, true));
            }
        });
        return output;
    }


    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = shims.getOwnPropertyDescriptor(value, key) || { value: value[key] };
        if (desc.get) {
            if (desc.set) {
                str = ctx.stylize('[Getter/Setter]', 'special');
            } else {
                str = ctx.stylize('[Getter]', 'special');
            }
        } else {
            if (desc.set) {
                str = ctx.stylize('[Setter]', 'special');
            }
        }

        if (!hasOwnProperty(visibleKeys, key)) {
            name = '[' + key + ']';
        }
        if (!str) {
            if (shims.indexOf(ctx.seen, desc.value) < 0) {
                if (isNull(recurseTimes)) {
                    str = formatValue(ctx, desc.value, null);
                } else {
                    str = formatValue(ctx, desc.value, recurseTimes - 1);
                }
                if (str.indexOf('\n') > -1) {
                    if (array) {
                        str = str.split('\n').map(function(line) {
                            return '  ' + line;
                        }).join('\n').substr(2);
                    } else {
                        str = '\n' + str.split('\n').map(function(line) {
                            return '   ' + line;
                        }).join('\n');
                    }
                }
            } else {
                str = ctx.stylize('[Circular]', 'special');
            }
        }
        if (isUndefined(name)) {
            if (array && key.match(/^\d+$/)) {
                return str;
            }
            name = JSON.stringify('' + key);
            if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                name = name.substr(1, name.length - 2);
                name = ctx.stylize(name, 'name');
            } else {
                name = name.replace(/'/g, "\\'")
                    .replace(/\\"/g, '"')
                    .replace(/(^"|"$)/g, "'");
                name = ctx.stylize(name, 'string');
            }
        }

        return name + ': ' + str;
    }


    function reduceToSingleString(output, base, braces) {
        var numLinesEst = 0;
        var length = shims.reduce(output, function(prev, cur) {
            numLinesEst++;
            if (cur.indexOf('\n') >= 0) numLinesEst++;
            return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
        }, 0);

        if (length > 60) {
            return braces[0] +
                (base === '' ? '' : base + '\n ') +
                ' ' +
                output.join(',\n  ') +
                ' ' +
                braces[1];
        }

        return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
    function isArray(ar) {
        return shims.isArray(ar);
    }
    exports.isArray = isArray;

    function isBoolean(arg) {
        return typeof arg === 'boolean';
    }
    exports.isBoolean = isBoolean;

    function isNull(arg) {
        return arg === null;
    }
    exports.isNull = isNull;

    function isNullOrUndefined(arg) {
        return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;

    function isNumber(arg) {
        return typeof arg === 'number';
    }
    exports.isNumber = isNumber;

    function isString(arg) {
        return typeof arg === 'string';
    }
    exports.isString = isString;

    function isSymbol(arg) {
        return typeof arg === 'symbol';
    }
    exports.isSymbol = isSymbol;

    function isUndefined(arg) {
        return arg === void 0;
    }
    exports.isUndefined = isUndefined;

    function isRegExp(re) {
        return isObject(re) && objectToString(re) === '[object RegExp]';
    }
    exports.isRegExp = isRegExp;

    function isObject(arg) {
        return typeof arg === 'object' && arg;
    }
    exports.isObject = isObject;

    function isDate(d) {
        return isObject(d) && objectToString(d) === '[object Date]';
    }
    exports.isDate = isDate;

    function isError(e) {
        return isObject(e) && objectToString(e) === '[object Error]';
    }
    exports.isError = isError;

    function isFunction(arg) {
        return typeof arg === 'function';
    }
    exports.isFunction = isFunction;

    function isPrimitive(arg) {
        return arg === null ||
            typeof arg === 'boolean' ||
            typeof arg === 'number' ||
            typeof arg === 'string' ||
            typeof arg === 'symbol' ||  // ES6 symbol
            typeof arg === 'undefined';
    }
    exports.isPrimitive = isPrimitive;

    function isBuffer(arg) {
        return arg && typeof arg === 'object'
            && typeof arg.copy === 'function'
            && typeof arg.fill === 'function'
            && typeof arg.binarySlice === 'function'
            ;
    }
    exports.isBuffer = isBuffer;

    function objectToString(o) {
        return Object.prototype.toString.call(o);
    }


    function pad(n) {
        return n < 10 ? '0' + n.toString(10) : n.toString(10);
    }


    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
    function timestamp() {
        var d = new Date();
        var time = [pad(d.getHours()),
            pad(d.getMinutes()),
            pad(d.getSeconds())].join(':');
        return [d.getDate(), months[d.getMonth()], time].join(' ');
    }


// log is just a thin wrapper to console.log that prepends a timestamp
    exports.log = function() {
        console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
    };


    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * The Function.prototype.inherits from lang.js rewritten as a standalone
     * function (not on Function.prototype). NOTE: If this file is to be loaded
     * during bootstrapping this function needs to be rewritten using some native
     * functions as prototype setup using normal JavaScript does not work as
     * expected during bootstrapping (see mirror.js in r114903).
     *
     * @param {function} ctor Constructor function which needs to inherit the
     *     prototype.
     * @param {function} superCtor Constructor function to inherit prototype from.
     */
    exports.inherits = function(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = shims.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    };

    exports._extend = function(origin, add) {
        // Don't do anything if add isn't an object
        if (!add || !isObject(add)) return origin;

        var keys = shims.keys(add);
        var i = keys.length;
        while (i--) {
            origin[keys[i]] = add[keys[i]];
        }
        return origin;
    };

    function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

},{"_shims":28}],32:[function(require,module,exports){

},{}],33:[function(require,module,exports){
// shim for using process in browser

    var process = module.exports = {};

    process.nextTick = (function () {
        var canSetImmediate = typeof window !== 'undefined'
            && window.setImmediate;
        var canPost = typeof window !== 'undefined'
                && window.postMessage && window.addEventListener
            ;

        if (canSetImmediate) {
            return function (f) { return window.setImmediate(f) };
        }

        if (canPost) {
            var queue = [];
            window.addEventListener('message', function (ev) {
                if (ev.source === window && ev.data === 'process-tick') {
                    ev.stopPropagation();
                    if (queue.length > 0) {
                        var fn = queue.shift();
                        fn();
                    }
                }
            }, true);

            return function nextTick(fn) {
                queue.push(fn);
                window.postMessage('process-tick', '*');
            };
        }

        return function nextTick(fn) {
            setTimeout(fn, 0);
        };
    })();

    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];

    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    }

// TODO(shtylman)
    process.cwd = function () { return '/' };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };

},{}]},{},[1])
;