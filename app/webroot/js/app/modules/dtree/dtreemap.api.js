angular.module('MapBiomas.dtree')
    .factory('DtreeMapAPI', ['$filter', 'DtreeLayer',
        function($filter, DtreeLayer) {

            // leaflet work map
            var dtreemap;

            // camada de cartas do dtreemap
            var cartasLayer;

            var cartaLayerSelected;

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

            // seleciona worklayer
            var selectedWlayer = null;

            // popupOpened
            var popupOpened;

            var DtreeMapAPI = {
                setMap: function(map) {
                    dtreemap = map;
                },
                getMap: function() {
                    return dtreemap;
                },
                buildDtreeLayer: function(params) {

                    // constroi uma nova dtreeLayer
                    var worklayer = new DtreeLayer(dtreemap, params);

                    // retira camada selecionada anteriormente
                    if (selectedWlayer) {
                        selectedWlayer.removeFromMap();
                        selectedWlayer = null;
                    }

                    // seta nova camada selecionada
                    selectedWlayer = worklayer;

                    // adiciona nova worklayer no mapa
                    worklayer.addToMap();

                    return worklayer;
                },
                setView: function(latlng, zoom) {
                    dtreemap.setView(latlng);
                },
                setCartasLayer: function(layer) {
                    cartasLayer = layer;
                },
                getWorkLayer: function() {
                    return selectedWlayer;
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
                    dtreemap.closePopup(popupOpened);
                },
                selectCarta: function(carta) {

                    // desmarca worklayer selecionada anteriormente                     
                    if (selectedWlayer) {
                        selectedWlayer.deselect();
                        selectedWlayer.removeFromMap();
                        selectedWlayer = null;
                    }

                    // zoom na carta selecionada                    
                    var cartaLayer = _.find(cartasLayer.getLayers(), function(l) {
                        return l.feature.properties.name == carta;
                    });

                    cartaLayerSelected = cartaLayer;

                    dtreemap.fitBounds(cartaLayer.getBounds(), {
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

                    // dispara evento de carta selecionada
                    this.onSelectedCarta(carta);

                },
                getCartaLayerSelected: function() {
                    return cartaLayerSelected;
                },
                onSelectedCarta: function(carta) {
                    return null;
                }
            };

            return DtreeMapAPI;
        }
    ])
    .factory('DtreeLayer', ['$filter', '$injector',
        function($filter, $injector) {
            // construtor DtreeLayer
            var DtreeLayer = function(dtreemap, params) {

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
                    dtreemap.removeLayer(decisionTreeLayer);
                    dtreemap.addLayer(decisionTreeLayer);
                });

                var pixelControl = new L.Control.InspectPixel({
                    classification: decisionTreeLayer
                });

                var opacitySlider = new L.Control.Classification({
                    classification: decisionTreeLayer,
                    label: $filter('translate')('CLASSSIFICACAO'),
                    map: dtreemap
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
                    dtreemap.addLayer(reflLayer, {
                        zIndex: 2
                    });

                    reflLayer.on('load', function() {
                        dtreemap.addLayer(decisionTreeLayer, {
                            zIndex: 100
                        });
                    });

                    decisionTreeLayer.on('load', function() {
                        /*dtreemap.addLayer(ndfiLayer, {
                            zIndex: 1
                        });*/
                    });

                    dtreemap.addControl(layersControl);
                    dtreemap.addControl(pixelControl);
                    dtreemap.addControl(opacitySlider);
                    dtreemap.addControl(progressbarControl);
                };

                this.removeFromMap = function() {
                    dtreemap.removeLayer(googleLayer);
                    dtreemap.removeLayer(ndfiLayer);
                    dtreemap.removeLayer(reflLayer);
                    dtreemap.removeLayer(decisionTreeLayer);
                    try {
                        dtreemap.removeControl(layersControl);
                        dtreemap.removeControl(pixelControl);
                        dtreemap.removeControl(opacitySlider);
                        dtreemap.removeControl(progressbarControl);
                    } catch (e) {
                        return;
                    }
                };

                this.select = function() {
                    dtreemap.addControl(layersControl);
                    dtreemap.addControl(pixelControl);
                    dtreemap.addControl(opacitySlider);
                    dtreemap.addControl(progressbarControl);
                };

                this.deselect = function() {
                    try {
                        dtreemap.removeControl(layersControl);
                        dtreemap.removeControl(pixelControl);
                        dtreemap.removeControl(opacitySlider);
                        dtreemap.removeControl(progressbarControl);
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
                    return dtreemap;
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

            return DtreeLayer
        }

    ]);
