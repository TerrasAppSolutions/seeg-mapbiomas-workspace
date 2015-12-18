angular.module('MapBiomas.directives')
    .directive('workmap', ['WorkmapAPI', 'WorkspaceLayers',
        function (WorkmapAPI, WorkspaceLayers) {
            return {
                restrict: 'A',
                scope: {
                    imagensProcessadas: "=imagensProcessadas",
                    classificacao: "=classificacao",
                },
                controller: ['$scope', function ($scope) {
                    $scope.init = function () {
                        $scope.$watch('imagensProcessadas',
                            function (newValue, oldValue) {
                                if (newValue) {
                                    console.log(newValue);
                                    WorkmapAPI.setNDFILayer(newValue.ndfi.url);
                                    WorkmapAPI.setReflectanceLayer(newValue.reflectance.url);
                                    //WorkmapAPI.setSpatialFilterLayer(newValue.classificationfilter.url);
                                    WorkmapAPI.setControlLayers();
                                    WorkmapAPI.setPixelPickerControl();
                                    WorkmapAPI.setOpacityLayer();
                                    WorkmapAPI.renderDtreeLayer(newValue,
                                        $scope.classificacao.Classificacao.dtv.dtv1,
                                        $scope.classificacao.Classificacao.dtv.dtv2,
                                        $scope.classificacao.Classificacao.dtv.dtv3,
                                        $scope.classificacao.Classificacao.dtv.dtv4);
                                }
                            });
                    };
                    $scope.init();
                }],
                link: function ($scope, element, attrs) {
                    element.attr('id', 'workmap');
                    // inicia mapa
                    //joao
                    $wgisWorkmap = $(element).wgis({
                        osm: false,
                        google: false,
                        switchLayer: true,
                        height: $('.workarea').height().toString() + 'px',
                        lmap: {
                            center: [-14.264383087562635, -59.0625],
                            zoom: 5,
                            minZoom: 5,
                            maxZoom: 15,
                            touchZoom: true,
                            scrollWheelZoom: true,
                            doubleClickZoom: true,
                            boxZoom: true,
                            zoomControl: true
                        }
                    });

                    WorkspaceLayers.imgsref($wgisWorkmap);

                    var workmap = $wgisWorkmap._wgis.lmap;

                    // adiciona camada google
                    var googleTerrain = new L.Google('SATELLITE');
                    workmap.addLayer(googleTerrain);

                    WorkmapAPI.setMap(workmap);

                    var dtreeLayer = dtreeLayer || {

                        init: function () {
                            this.layer = L.tileLayer.dtree();
                        },
                        render: function (layers, v1, v2, v3, v4) {
                            this.layer.v1 = v1;
                            this.layer.v2 = v2;
                            this.layer.v3 = v3;
                            this.layer.v4 = v4;
                            this.mapIds = {};
                            this.tokens = {};

                            var key;

                            key = 'classification';
                            this.mapIds[key] = layers[key].mapid;
                            this.tokens[key] = layers[key].token;

                            key = 'gv'
                            this.mapIds[key] = layers[key].mapid;
                            this.tokens[key] = layers[key].token;

                            key = 'cloud'
                            this.mapIds[key] = layers[key].mapid;
                            this.tokens[key] = layers[key].token;

                            key = 'soil'
                            this.mapIds[key] = layers[key].mapid;
                            this.tokens[key] = layers[key].token;

                            key = 'npv'
                            this.mapIds[key] = layers[key].mapid;
                            this.tokens[key] = layers[key].token;

                            key = 'elevationrescaled'
                            this.mapIds[key] = layers[key].mapid;
                            this.tokens[key] = layers[key].token;

                            this.layer.mapIds = this.mapIds
                            this.layer.tokens = this.tokens
                        },
                        setFilter: function (vv1, vv2, vv3, vv4) {
                            this.layer.v1 = vv1;
                            this.layer.v2 = vv2;
                            this.layer.v3 = vv3;
                            this.layer.v4 = vv4;
                            this.layer.filter_tiles_canvas();
                        },
                        addTo: function (map) {
                            map.addLayer(this.layer);
                        }
                    };
                    dtreeLayer.init();

                    WorkmapAPI.setDtreeLayer(dtreeLayer);
                }
            };
        }
    ])
    .factory('WorkmapAPI', ['$filter',
        function ($filter) {
            var workmap = null;
            var ndfi_layer = null;
            var refl_layer = null;
            var spatial_filter_layer = null;
            var dtreeLayer = null;
            var iconLayersControl = null;
            var pixelControl = null;
            var opacitySlider = null;

            var WorkmapAPI = {
                setMap: function (map) {
                    workmap = map;
                },
                getMap: function () {
                    return workmap;
                },
                setView: function (latlng, zoom) {
                    workmap.setView(latlng, zoom);
                },
                setNDFILayer: function (url) {
                    if (ndfi_layer) {
                        ndfi_layer.setUrl(url);
                        workmap.addLayer(ndfi_layer);
                    } else {
                        ndfi_layer = L.tileLayer(url, {
                            unloadInvisibleTiles: true
                        });
                        workmap.addLayer(ndfi_layer);
                    }
                },
                setReflectanceLayer: function (url) {
                    if (refl_layer) {
                        refl_layer.setUrl(url);
                        workmap.addLayer(refl_layer);
                    } else {
                        refl_layer = L.tileLayer(url, {
                            unloadInvisibleTiles: true
                        });
                        workmap.addLayer(refl_layer);
                    }
                },
                setSpatialFilterLayer: function (url) {
                    if (spatial_filter_layer) {
                        spatial_filter_layer.setUrl(url);
                        workmap.addLayer(spatial_filter_layer);
                    } else {
                        spatial_filter_layer = L.tileLayer(url, {
                            unloadInvisibleTiles: true
                        });
                        workmap.addLayer(spatial_filter_layer);
                    }
                },
                _setLayer: function (url, layer) {
                    if (layer) {
                        layer.setUrl(url);
                        workmap.addLayer(layer);
                    } else {
                        layer = L.tileLayer(url, {
                            unloadInvisibleTiles: true
                        });
                        workmap.addLayer(layer);
                    }
                },
                setDtreeLayer: function (layer) {
                    dtreeLayer = layer;
                },
                setElevation: function (max, min) {
                    if (max && min) {
                        dtreeLayer.layer.elevation_min = min;
                        dtreeLayer.layer.elevation_max = max;
                        dtreeLayer.layer.refresh();
                    }

                },
                getDTreeLayer: function () {
                    return dtreeLayer;
                },
                renderDtreeLayer: function (image_data, v1, v2, v3, v4) {
                    workmap.removeLayer(dtreeLayer.layer);
                    dtreeLayer.render(image_data, v1, v2, v3, v4);
                    workmap.addLayer(dtreeLayer.layer);
                },
                showClasses: function (class_, enable) {
                    dtreeLayer.layer.class_visibility(class_, enable);
                },
                setControlLayers: function () {
                    if (iconLayersControl === null) {
                        iconLayersControl = new L.Control.IconLayers(
                            [
                            {
                                title: 'RGB',
                                layer: refl_layer,
                                icon: 'img/rgbIcon.png'
                            }, {
                                title: 'NDFI',
                                layer: ndfi_layer,
                                icon: 'img/ndfiIcon.png'
                            }, {
                                title: $filter('translate')('SATELITE'),
                                layer: new L.Google('SATELLITE'),
                                icon: 'img/satelliteIcon.png'
                            }], {
                                position: 'bottomright',
                                maxLayersInRow: 5
                            }
                        );

                        workmap.addControl(iconLayersControl);

                    } else {
                        workmap.removeControl(iconLayersControl);
                        workmap.addControl(iconLayersControl);
                    }

                    iconLayersControl.on('activelayerchange', function (e) {
                        workmap.removeLayer(spatial_filter_layer);
                        workmap.removeLayer(dtreeLayer.layer);
                        workmap.addLayer(dtreeLayer.layer);
                        opacitySlider.enableSpatialFilter();
                    });

                },
                setPixelPickerControl: function () {

                    if (pixelControl) {
                        pixelControl.show();
                        pixelControl.setLayer(dtreeLayer.layer);
                    } else {
                        pixelControl = L.Control.InspectPixelControl(dtreeLayer.layer);
                        pixelControl.addTo(workmap);
                    }

                },
                setOpacityLayer: function () {
                    //var opacitySlider = new L.Control.opacitySlider();
                    if(opacitySlider === null){
                        opacitySlider = L.control.opacityclassification();
                        opacitySlider.setLayers(dtreeLayer.layer, spatial_filter_layer);
                        workmap.addControl(opacitySlider);
                    }else{
                        opacitySlider.setLayers(dtreeLayer.layer, spatial_filter_layer);
                        workmap.removeControl(opacitySlider);
                        workmap.addControl(opacitySlider);
                    }

                },
            };
            return WorkmapAPI;
        }
    ]).directive('mapcarta', ['MapCartaAPI', 'WorkmapAPI',
        function (MapCartaAPI, WorkmapAPI) {
            return {
                restrict: 'A',
                scope: {
                    mapcartaCtrl: '=ctrl'
                },
                link: function ($scope, element, attrs) {

                    element.attr('id', 'map-carta');

                    // inicia o mapa
                    var mapcarta = L.map('map-carta', {
                        center: [-14.264383087562635, -59.0625],
                        zoom: 7,
                        dragging: false,
                        touchZoom: false,
                        scrollWheelZoom: false,
                        doubleClickZoom: false,
                        boxZoom: false,
                        zoomControl: false,
                    });

                    // adiciona camada google
                    var googleTerrain = new L.Google('SATELLITE');
                    mapcarta.addLayer(googleTerrain);

                    MapCartaAPI.setMap(mapcarta);

                    setTimeout(function(){
                        var height = element.parent().height().toString() + "px";
                        element.css('height', height);
                        mapcarta.invalidateSize()
                    },500);
                }
            };
        }
    ]).factory('MapCartaAPI', ['WorkmapAPI',
        function (WorkmapAPI) {
            var mapcarta = null;
            var layerCarta = null;
            var last_marker = null;
            var MapCartaAPI = {
                setMap: function (map) {
                    mapcarta = map;
                },
                getMap: function () {
                    return mapcarta;
                },
                setLayer: function (layer) {
                    layerCarta = layer;
                },
                getLayer: function () {
                    return cartaLayer;
                },
                onEachFeature() {
                    // does this feature have a property named popupContent?
                    return function (feature, layer) {
                        layer.on('click', function (e) {
                            if (layer == e.target) {
                                WorkmapAPI.setView(e.latlng, 13);
                                var lat = e.latlng.lat;
                                var lng = e.latlng.lng;
                                var rectangle = [
                                    [lat - 0.050, lng + 0.075],
                                    [lat + 0.050, lng + 0.075],
                                    [lat + 0.050, lng - 0.075],
                                    [lat - 0.050, lng - 0.075]
                                ];
                                var marker = L.polygon(rectangle, {
                                    "color": "#e82525",
                                    "weight": 1.0,
                                    "fill": false,
                                    "opacity": 1,
                                    "fillOpacity": 0.0
                                });

                                if (last_marker) {
                                    mapcarta.removeLayer(last_marker);
                                }

                                mapcarta.addLayer(marker);

                                last_marker = marker;
                            }
                        });
                    }
                },
            };
            return MapCartaAPI;
        }
    ]).directive('mapcartas', ['MapCartasAPI', 'WorkmapAPI', 'MapCartaAPI',
        function (MapCartasAPI, WorkmapAPI, MapCartaAPI) {
            return {
                restrict: 'A',
                scope: {
                    options: "=options",
                    imageData: "=imageData",
                    imagensProcessadas: "=imagensProcessadas",
                    cartaEventClick: "=cartaEventClick"
                },
                controller: ['$scope', function ($scope) {
                    $scope.init = function () {
                        // $scope.$watch('imagensProcessadas',
                        //     function (newValue, oldValue) {
                        //         if (newValue) {
                        //             console.log(newValue);
                        //             WorkmapAPI.setNDFILayer(newValue.ndfi.url);
                        //             WorkmapAPI.setReflectanceLayer(newValue.reflectance.url);
                        //             WorkmapAPI.setClassificacaoLayer(newValue.classificacao.url);
                        //             WorkmapAPI.setControlLayers();
                        //             WorkmapAPI.setPixelPickerControl();
                        //             WorkmapAPI.renderDtreeLayer(newValue, 70, 40, 190, 180);
                        //         }
                        //     });
                    };
                    $scope.init();
                }],

                link: function ($scope, element, attrs) {
                    var mapcartas;
                    var cartasLayers;
                    var biomasLayer;

                    var last_carta_selected = null;
                    var last_carta_workmap = null;
                    var last_carta_map_carta = null;
                    $scope.imageData = {};

                    var onEachFeature = function (feature, layer) {
                        // does this feature have a property named popupContent?
                        if (feature.properties && feature.properties.name) {
                            //layer.bindPopup(feature.properties.name);
                            layer.on('click', function (e) {
                                if (layer == e.target) {
                                    $scope.options.cartaName = feature.properties.name;
                                    $scope.options.toolTipCarta = true;
                                    layer.setStyle({
                                        "color": "red",
                                        "weight": 1,
                                        "opacity": 0.9,
                                        "fillOpacity": 0.2,
                                        "fillColor": "#ff6666"
                                    });

                                    if (last_carta_selected) {
                                        last_carta_selected.setStyle({
                                            "color": "#666666",
                                            "weight": 0.4,
                                            "opacity": 0.8,
                                            "fillOpacity": 0.2,
                                            "fillColor": "#ff6666"
                                        });
                                    }
                                    last_carta_selected = layer;
                                    WorkmapAPI.setView(e.latlng, 13);

                                    //Add carta in Map carta
                                    var carta_style = {
                                        "color": "#ffff00",
                                        "weight": 1.0,
                                        "opacity": 1,
                                        "fillOpacity": 0.0,
                                    };

                                    var layer_carta_mapcarta = L.geoJson(feature, {
                                        style: carta_style,
                                        onEachFeature: MapCartaAPI.onEachFeature()
                                    });

                                    if (last_carta_map_carta) {
                                        MapCartaAPI.getMap().removeLayer(last_carta_map_carta);
                                    }

                                    MapCartaAPI.getMap().addLayer(layer_carta_mapcarta);
                                    MapCartaAPI.getMap().fitBounds(layer_carta_mapcarta.getBounds());

                                    //Add carta in Workmap
                                    var layer_carta__workmap = L.geoJson(feature, {
                                        style: carta_style,
                                        onEachFeature: MapCartaAPI.onEachFeature()
                                    });

                                    if (last_carta_workmap) {
                                        WorkmapAPI.getMap().removeLayer(last_carta_workmap);
                                    }

                                    WorkmapAPI.getMap().addLayer(layer_carta__workmap);

                                    last_carta_map_carta = layer_carta_mapcarta;
                                    last_carta_workmap = layer_carta__workmap;

                                    $scope.cartaEventClick($scope.options.cartaName);

                                    $scope.$apply();
                                }
                            });
                        }
                    };

                    var init = function () {
                        element.attr('id', 'map-cartas');

                        // inicia o mapa
                        mapcartas = L.map('map-cartas', {
                            center: [-14.264383087562635, -59.0625],
                            zoom: 4,
                            minZoom: 3,
                            maxZoom: 8
                        });

                        // adiciona camada OpenStreetMaps
                        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                        var osmAttrib = 'Map data &copy; OpenStreetMap contributors';
                        var osm = new L.TileLayer(osmUrl, {
                            minZoom: 0,
                            maxZoom: 18,
                            attribution: osmAttrib
                        });

                        mapcartas.addLayer(osm);

                        // adiciona camada de biomas
                        biomasLayer = L.geoJson(biomas, {
                            style: {
                                "color": "#006600",
                                "weight": 1.0,
                                "opacity": 0.6,
                                "fillOpacity": 0.0
                            }
                        });

                        mapcartas.addLayer(biomasLayer);


                        // adiciona camada de cartas
                        cartasLayers = L.geoJson(cartas, {
                            style: {
                                "color": "#666666",
                                "weight": 0.5,
                                "opacity": 0.9,
                                "fillOpacity": 0.2,
                                "fillColor": "#ff6666"
                            },
                            onEachFeature: onEachFeature
                        });

                        mapcartas.addLayer(cartasLayers);
                        MapCartasAPI.setMap(mapcartas);

                        mapcartas.panTo(biomasLayer.getBounds().getCenter());

                    };

                    init();
                }
            };
        }

    ]).factory('MapCartasAPI', ['WorkmapAPI',
        function (WorkmapAPI) {
            var mapCartas = null;
            var cartasLayer = null;
            var MapCartasAPI = {
                setMap: function (map) {
                    mapCartas = map;
                },
                setLayer: function (layer) {
                    cartasLayer = layer;
                },
                getLayer: function () {
                    return workmap;
                }
            };
            return MapCartasAPI;
        }
    ]);
