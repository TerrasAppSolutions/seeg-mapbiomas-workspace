angular.module('MapBiomas.workmap')
    .factory('WorkmapAPI', ['$filter', 'WorkLayer',
        function($filter, WorkLayer) {

            // leaflet work map
            var workmap;

            // camada de cartas do workmap
            var cartasLayer;

            var cartaLayerSelected;

            var classificationParams;

            var styles = {
                default: {
                    "color": "#78b569",
                    "weight": 0.5,
                    "opacity": 0.1,
                    "fillOpacity": 0,
                },
                selected: {
                    "color": "#ffff00",
                    "weight": 2.0,
                    "opacity": 1,
                    "fillOpacity": 0.0
                }
            };

            // worklayers list
            var worklayerList = {};

            // select work layer
            var selectedWlayer = null;

            // popupOpened
            var popupOpened;

            var WorkmapAPI = {
                setMap: function(map) {
                    workmap = map;
                },
                getMap: function() {
                    return workmap;
                },
                buildWorkLayer: function(params) {

                    classificationParams = params.classificationParams;

                    var carta = params.classificationParams.Classificacao.carta;

                    // constroi uma nova worklayer
                    var worklayer = new WorkLayer(workmap, params);

                    // verifica uma se ja existe 
                    // uma worklayer da mesma carta
                    // e remove para para ser substituida                    
                    if (worklayerList[carta]) {
                        worklayerList[carta].removeFromMap();
                    }
                    worklayerList[carta] = worklayer;

                    // retira camada selecionada anteriormente
                    if (selectedWlayer) {
                        selectedWlayer.deselect();
                    }
                    // seta nova camada selecionada
                    selectedWlayer = worklayer;

                    // adiciona nova worklayer no mapa
                    worklayer.addToMap();

                    return worklayer;

                },
                setView: function(latlng, zoom) {
                    // workmap.setView(latlng, zoom);
                    workmap.setView(latlng);
                },
                setCartasLayer: function(layer) {
                    cartasLayer = layer;
                },
                getWorkLayer: function() {
                    return selectedWlayer;
                },
                getDTreeLayer: function() {
                    var dtreelayer = null;
                    if (selectedWlayer) {
                        dtreelayer = selectedWlayer.getDecisionTreeLayer();
                    }
                    return dtreelayer;
                },
                getDecisionTreeLayer: function() {
                    var dtreelayer = null;
                    if (selectedWlayer) {
                        dtreelayer = selectedWlayer.getDecisionTreeLayer();
                    }
                    return dtreelayer;
                },
                getDecisionTree: function() {
                    var dtree = null;
                    if (selectedWlayer) {
                        dtree = selectedWlayer.getDecisionTree();
                    }
                    return dtree;
                },

                showClasses: function(class_, enable) {
                    dtree_layer.layer.class_visibility(class_, enable);
                },
                setPopupOpened: function(popup) {
                    popupOpened = popup;
                },
                closePopups: function() {
                    workmap.closePopup(popupOpened);
                },
                selectCarta: function(carta) {

                    // desmarca worklayer selecionada anteriormente
                    if (selectedWlayer) {
                        selectedWlayer.deselect();
                    }

                    // verifica se ja existe worklayer instanciada
                    // para a carta selecionada
                    if (worklayerList[carta]) {
                        selectedWlayer = worklayerList[carta];
                        selectedWlayer.select();
                    } else {
                        selectedWlayer = null;
                    }

                    // zoom na carta selecionada                    
                    var cartaLayer = _.find(cartasLayer.getLayers(), function(l) {
                        return l.feature.properties.name == carta;
                    });

                    cartaLayerSelected = cartaLayer;

                    workmap.fitBounds(cartaLayer.getBounds(), {
                        maxZoom: 9
                    });

                    // seleciona a carta visualmente aplicando estilo                    
                    angular.forEach(cartasLayer.getLayers(), function(layer, key) {
                        if (layer.cartaSelected) {
                            layer.cartaSelected = false;
                            layer.setStyle(styles.default);
                        }
                        if (layer.feature.properties.name == carta) {
                            layer.cartaSelected = true;
                            layer.setStyle(styles.selected);
                        }
                    });

                    // verifica se existe worklayer que nao deve ser mantidas no mapa                    
                    angular.forEach(worklayerList, function(layer, key) {
                        if (!layer.getClassificationParams().Classificacao.keeponmap) {
                            layer.removeFromMap();
                            delete worklayerList[key];
                        }
                    });

                    // dispara evento de carta selecionada
                    this.onSelectedCarta(carta);

                },
                getWorkLayers: function() {
                    return worklayerList;
                },
                getWorkLayerCarta: function(carta) {
                    if (worklayerList[carta]) {
                        return worklayerList[carta];
                    } else {
                        return null;
                    }
                },
                getClassificationParams: function() {
                    return classificationParams;
                },
                getCartaClassification: function(carta) {
                    if (worklayerList[carta]) {
                        return worklayerList[carta].getClassificationParams();
                    } else {
                        return {
                            Classificacao: {
                                carta: carta
                            }
                        };
                    }
                },
                getCartaLayerSelected: function() {
                    return cartaLayerSelected;
                },
                onSelectedCarta: function(carta) {
                    return null;
                }
            };

            return WorkmapAPI;
        }
    ])
    .factory('WorkLayer', ['$filter', '$injector',
        function($filter, $injector) {
            // construtor WorkLayer
            var WorkLayer = function(workmap, params) {

                var DecisionTree = $injector.get('DecisionTree');

                var classificationParams = params.classificationParams;

                // google layer
                var googleLayer = new L.Google('SATELLITE');

                /*
                 * Layers
                 */

                // ndfi layer instance
                var ndfiLayer = L.tileLayer(params.ndfirgb.url, {
                    unloadInvisibleTiles: false
                });

                // reflectance layer instance
                var reflLayer = L.tileLayer(params.rgb.url, {
                    unloadInvisibleTiles: false
                });

                // classification dtree layer

                var validateDtreeLayers = function(paramsLayers, dtree) {

                    var layers = {};

                    var dtreeKeys = Object.keys(dtree);

                    dtreeKeys.forEach(function(dtreeKey) {
                        var dtreeNode = dtree[dtreeKey];
                        if (dtreeNode.kind == 'decision') {
                            layers[dtreeNode.rule.variable] = paramsLayers[dtreeNode.rule.variable];
                        }
                    });

                    return layers;
                };

                var decisionTree = new DecisionTree(classificationParams.DecisionTree.dtree);

                var decisionTreeLayer = new L.TileLayer.Classification({
                    layers: validateDtreeLayers(params, classificationParams.DecisionTree.dtree),
                    classification: function(data) {
                        var result = [0, 0, 0, 0];
                        try {
                            var datakeyTest = Object.keys(data.data)[0];
                            if (data.data[datakeyTest][3] != 0) {
                                result = decisionTree.classify(data.data);
                            }
                        } catch (e) {
                            result = [0, 0, 0, 0];
                        }
                        return result;
                    }
                });

                /*
                 * controls
                 */
                // control layers
                var layersControl = new L.Control.IconLayers(
                    [{
                        title: 'RGB',
                        layer: reflLayer,
                        icon: 'img/rgbIcon.png'
                    }, {
                        title: 'NDFI',
                        layer: ndfiLayer,
                        icon: 'img/ndfiIcon.png'
                    }, {
                        title: $filter('translate')('SATELITE'),
                        layer: googleLayer,
                        icon: 'img/satelliteIcon.png'
                    }], {
                        position: 'bottomright',
                        maxLayersInRow: 5
                    }
                );

                layersControl.on('activelayerchange', function(e) {
                    workmap.removeLayer(decisionTreeLayer);
                    workmap.addLayer(decisionTreeLayer);
                });

                var pixelControl = new L.Control.InspectPixel({
                    classification: decisionTreeLayer
                });

                var opacitySlider = new L.Control.Classification({
                    classification: decisionTreeLayer,
                    label: $filter('translate')('CLASSSIFICACAO'),
                    map: workmap
                });

                // get dtree classes
                var getDtreeClasses = function(dtree) {
                    var classes = [];
                    var dtreeKeys = Object.keys(dtree);
                    dtreeKeys.forEach(function(dtreeKey) {
                        var dtreeNode = dtree[dtreeKey];
                        if (dtreeNode.kind == 'class') {
                            classes.push({
                                name: dtreeNode.class.name,
                                color: dtreeNode.class.color
                            });
                        }
                    });
                    return _.uniq(classes, function(v) {
                        return v.name;
                    });
                };

                opacitySlider.setClasses(getDtreeClasses(classificationParams.DecisionTree.dtree));                

                /*
                 * ProgressBar
                 */
                var progressbarControl = new L.Control.LayerProgressBar({
                    layers: [{
                        label: "RGB",
                        layer: reflLayer,
                    }, {
                        label: "NDFI",
                        layer: ndfiLayer,
                    }, {
                        label: "Classification",
                        layer: decisionTreeLayer,
                    }]
                });

                /*
                 * public functions
                 */
                this.addToMap = function() {
                    workmap.addLayer(reflLayer, {
                        zIndex: 2
                    });

                    reflLayer.on('load', function() {
                        workmap.addLayer(decisionTreeLayer, {
                            zIndex: 100
                        });
                    });

                    decisionTreeLayer.on('load', function() {
                        /*workmap.addLayer(ndfiLayer, {
                            zIndex: 1
                        });*/
                    });                 

                    workmap.addControl(layersControl);
                    workmap.addControl(pixelControl);
                    workmap.addControl(opacitySlider);
                    workmap.addControl(progressbarControl);
                };

                this.removeFromMap = function() {
                    workmap.removeLayer(googleLayer);
                    workmap.removeLayer(ndfiLayer);
                    workmap.removeLayer(reflLayer);
                    workmap.removeLayer(decisionTreeLayer);
                    try {
                        workmap.removeControl(layersControl);
                        workmap.removeControl(pixelControl);
                        workmap.removeControl(opacitySlider);
                        workmap.removeControl(progressbarControl);
                    } catch (e) {
                        return;
                    }
                };

                this.select = function() {
                    workmap.addControl(layersControl);
                    workmap.addControl(pixelControl);
                    workmap.addControl(opacitySlider);
                    workmap.addControl(progressbarControl);
                };

                this.deselect = function() {
                    try {
                        workmap.removeControl(layersControl);
                        workmap.removeControl(pixelControl);
                        workmap.removeControl(opacitySlider);
                        workmap.removeControl(progressbarControl);
                    } catch (e) {
                        return;
                    }
                };

                this.getDTreeLayer = function() {
                    return decisionTreeLayer;
                };

                this.getDecisionTreeLayer = function() {
                    return decisionTreeLayer;
                };

                this.getDecisionTree = function() {
                    return decisionTree;
                };

                this.getWorkMap = function() {
                    return workmap;
                };

                this.getClassificationParams = function() {
                    return classificationParams;
                };

                this.setProcessedLayers = function(layers) {
                    if (decisionTreeLayer) {
                        decisionTreeLayer.setLayers(layers);
                    }
                };

                this.setDtree = function(dtree) {
                    if (decisionTree) {
                        decisionTree.setDtree(dtree);                        
                        opacitySlider.setClasses(getDtreeClasses(dtree));
                        decisionTreeLayer.reclassify();
                    }
                };
            };

            return WorkLayer
        }
    ])
    .factory('MapCartasAPI', ['WorkmapAPI', 'MapCartaAPI',
        function(WorkmapAPI, MapCartaAPI) {
            var mapCartas = null;

            var cartasLayer = null;

            var lastCartaSelected = null;
            var lastCartaMapCarta = null;

            var MapCartasAPI = {
                setMap: function(map) {
                    mapCartas = map;
                },
                setCartasLayer: function(layer) {
                    cartasLayer = layer;
                },
                getLayer: function() {
                    return workmap;
                },
                selectCartaLayer: function(layer) {
                    layer.setStyle({
                        "color": "red",
                        "weight": 1,
                        "opacity": 0.9,
                        "fillOpacity": 0.2,
                        "fillColor": "#ff6666"
                    });

                    if (lastCartaSelected) {
                        lastCartaSelected.setStyle({
                            "color": "#666666",
                            "weight": 0.4,
                            "opacity": 0.8,
                            "fillOpacity": 0.2,
                            "fillColor": "#ff6666"
                        });
                    }

                    lastCartaSelected = layer;

                    //Add carta in Map carta
                    var carta_style = {
                        "color": "#ffff00",
                        "weight": 1.0,
                        "opacity": 1,
                        "fillOpacity": 0.0,
                    };

                    var layerCartaMapcarta = L.geoJson(layer.feature, {
                        style: carta_style,
                        onEachFeature: MapCartaAPI.onEachFeature()
                    });

                    if (lastCartaMapCarta) {
                        MapCartaAPI.getMap().removeLayer(lastCartaMapCarta);
                    }

                    MapCartaAPI.getMap().addLayer(layerCartaMapcarta);
                    MapCartaAPI.getMap().fitBounds(layerCartaMapcarta.getBounds());

                    lastCartaMapCarta = layerCartaMapcarta;

                },
                selectCarta: function(carta) {

                    var clayers = cartasLayer.getLayers();

                    var cartaLayer = _.find(clayers, function(l) {
                        return l.feature.properties.name == carta;
                    });

                    this.selectCartaLayer(cartaLayer);
                }
            };

            return MapCartasAPI;
        }
    ])
    .factory('MapCartaAPI', ['WorkmapAPI',
        function(WorkmapAPI) {

            var mapcarta = null;
            var layerCarta = null;
            var last_marker = null;

            var MapCartaAPI = {
                setMap: function(map) {
                    mapcarta = map;
                },
                getMap: function() {
                    return mapcarta;
                },
                setLayer: function(layer) {
                    layerCarta = layer;
                },
                getLayer: function() {
                    return cartaLayer;
                },
                onEachFeature() {
                    // does this feature have a property named popupContent?
                    return function(feature, layer) {
                        layer.on('click', function(e) {
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
    ]);