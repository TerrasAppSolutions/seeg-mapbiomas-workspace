/**
 * Service de comunicação google earth engine
 * @argument func getElevation
 */

'use strict';

angular.module('MapBiomas.services').factory('MapTaskLeaflet', ['$http', 'AppConfig', 'GEEProcessDataService', '$rootScope',
            '$injector', function ($http, AppConfig, GEEProcessDataService, $rootScope, $injector) {
        // dependências 
        var Notify = $injector.get('Notify');

        var maps = {};

        var cartaLayer = {};

        // última carta selecionada
        var lastCartaSelected = {};

        // última url gerada
        var lastUrl;

        // botão de processamento da carta
        var buttonProcess = {};

        // ferramenta de pesquisa
        var searchControl = {};

        // layer control
        var layerControl = {};
        var panelLayer = {};

        var geeTemporalClassificationLayer;
        var geeTemporalFilteredLayer;
        var geeIntegrationLayer;
        var geeClassificationLayer;

        var mapTaskLeaflet = {
            setMap: function (name, map) {
                maps[name] = map;
            },
            getMap: function (name) {
                return maps[name];
            },
            setLayerControl: function (name, control) {
                layerControl[name] = control;
            },
            getLayerControl: function (name) {
                return layerControl[name];
            },
            setPanelLayer: function (name, control) {
                panelLayer[name] = control;
            },
            getPanelLayer: function (name) {
                return panelLayer[name];
            },
            removeLayerControl: function (name) {
                this.getLayerControl(name).removeFrom(this.getMap(name));
            },
            removePanelLayer: function (name) {
                this.getPanelLayer(name).removeFrom(this.getMap(name));
            },
            setLastCartaSelected: function (name, map) {
                lastCartaSelected[name] = map;
            },
            getLastCartaSelected: function (name) {
                return lastCartaSelected[name];
            },
            getButtonProcess: function (name) {
                return buttonProcess[name];
            },
            setButtonProcess: function (name, button) {
                buttonProcess[name] = button;
            },
            getSearchControl: function (name) {
                return searchControl[name];
            },
            /**
             * configura as cartas em plano de fundo
             */
            setCartaLayer: function (name) {
                // camada de cartas                     
                var cartasLayers = L.geoJson(cartas, {
                    style: {
                        "color": "#78b569",
                        "weight": 0.5,
                        "opacity": 0.1,
                        "fillOpacity": 0,
                    }
                });

                cartaLayer[name] = cartasLayers;

                this.getMap(name).addLayer(cartasLayers);
            },
            /**
             * Obtém as cartas de plano de fundo
             */
            getCartaLayer: function (name) {
                return cartaLayer[name];
            },
            /**
             * Encontra a carta layer
             * * define a carta selecionada como última carta selecionada
             * * volta o estilo para default
             * @param {name} name nome do mapa padrão
             * @param {layer} layer layer para ser adicionado
             */
            findCartaLayer: function (name, layer) {

                var clayers = this.getCartaLayer(name).getLayers();
                var cartaLayer = _.find(clayers, function (l) {
                    return l.feature.properties.name == layer.feature.properties.name;
                });

                if (this.getLastCartaSelected(name)) {
                    this.layerDefaultStyle(this.getLastCartaSelected(name));
                }
                this.setLastCartaSelected(name, cartaLayer);
                return cartaLayer;
            },
            /**
             * fit bound na carta com zoom menos para melhor visualização
             * * define o zoom do mapa ao selecionar carta
             * * timeout devido a problemas ocorridos ao fazer fitbound e zoom
             * @param {name} name nome do mapa
             * @param {layer} layer layer para ser adicionado
             */
            fitBounds: function (name, layer) {
                this.getMap(name).fitBounds(layer);
                setTimeout(function () {
                    mapTaskLeaflet.getMap(name).setZoom(9);
                }, 400);
            },
            /**
             * botão para processar ndvi
             * @param {buttonMap} buttonMap onde botão será adicionado
             * @param {resultMap} resultMap onde resultado será aplicado
             */
            processButtom: function (buttonMap, resultMap) {
                return L.easyButton('fa-cogs fa-lg', function () {

                    GEEProcessDataService.geeGetNdvi(this.getLastCartaSelected(resultMap), function (url) {
                        // progress bar
                        var progressbarControl = new L.Control.LayerProgressBar({
                            layers: [{
                                label: "Processing...",
                                layer: url,
                            }]
                        });

                        mapTaskLeaflet.getMap(resultMap).addControl(progressbarControl);

                        // remove layer caso já tenha sido processado
                        if (lastUrl) {
                            mapTaskLeaflet.getMap(resultMap).removeLayer(lastUrl);
                        }
                        lastUrl = url;
                        mapTaskLeaflet.getMap(resultMap).addLayer(url);
                    });
                }).addTo(this.getMap(buttonMap));
            },
            /**
             * Filtro temporal GEE
             * Receberá um conjunto de regras para processamento earth engine
             * @param {rules} rules
             */
            processTemporalFilterGee: function (rules, chart, biome, mapResult) {
                var progressbarControl1;
                var progressbarControl2;

                // formata as regras, retirando aquelas que não estão ativas
                if (rules.length) {
                    var formatedRules = this.formatRules(rules, 'TemporalFilter');

                    GEEProcessDataService
                        .geeTemporalFilter(formatedRules, chart, biome, 'filtered', function (url) {                            
                            /* if (progressbarControl1) {
                                mapTaskLeaflet.getMap(mapResult).removeControl(progressbarControl1);
                            } */

                            // progress bar
                            progressbarControl1 = new L.Control.LayerProgressBar({
                                layers: [{
                                    label: "Filtered data...",
                                    layer: url,
                                }]
                            });

                            mapTaskLeaflet.getMap(mapResult).addControl(progressbarControl1);

                            if (geeTemporalFilteredLayer) {
                                mapTaskLeaflet.getMap(mapResult).removeLayer(geeTemporalFilteredLayer);
                            }
                            geeTemporalFilteredLayer = url;
                            mapTaskLeaflet.getMap(mapResult).addLayer(geeTemporalFilteredLayer);
                        });

                    GEEProcessDataService
                        .geeTemporalFilter(formatedRules, chart, biome, 'classification', function (url) {
                            /* if (progressbarControl2) {
                                mapTaskLeaflet.getMap(mapResult).removeControl(progressbarControl2);
                            } */

                            // progress bar
                            progressbarControl2 = new L.Control.LayerProgressBar({
                                layers: [{
                                    label: "Classified data...",
                                    layer: url,
                                }]
                            });

                            mapTaskLeaflet.getMap(mapResult).addControl(progressbarControl2);

                            if (geeTemporalClassificationLayer) {
                                mapTaskLeaflet.getMap(mapResult).removeLayer(geeTemporalClassificationLayer);
                            }

                            if (mapTaskLeaflet.getPanelLayer(mapResult)) {
                                mapTaskLeaflet.removePanelLayer(mapResult);
                            }
                            geeTemporalClassificationLayer = url;

                            mapTaskLeaflet.getMap(mapResult).addLayer(geeTemporalClassificationLayer);
                        });
                        
                    $rootScope.$on('errorTemporalMap', function (ev, error) {                        
                        Notify.error(error);
                        mapTaskLeaflet.getMap(mapResult).removeControl(progressbarControl1);
                        mapTaskLeaflet.getMap(mapResult).removeControl(progressbarControl2);
                    });

                    // console.log("geeTemporalFilteredLayer", geeTemporalFilteredLayer);
                    // console.log("geeTemporalClassificationLayer", geeTemporalClassificationLayer);

                    /* this.setLayerControl(mapResult, L.control.layers({}, {
                        "Classification": geeTemporalClassificationLayer,
                        "Filtered": geeTemporalFilteredLayer,
                    }));

                    this.getLayerControl(mapResult).addTo(mapTaskLeaflet.getMap(mapResult)); */

                    this.setPanelLayer(mapResult, L.control.panelLayers(null, [{
                        group: "Layers",
                        layers: [{
                                active: true,
                                name: "Classification",
                                layer: geeTemporalClassificationLayer
                            },
                            {
                                active: true,
                                name: "Filtered",
                                layer: geeTemporalFilteredLayer
                            }
                        ]
                    }], {
                        position: 'topright',
                        buildItem: function (item) {

                            var $slider = $('<div class="layer-slider">');

                            var $input = $('<input type="text" value="' + item.layer.options.opacity + '" />');

                            $slider.append($input);

                            $input.ionRangeSlider({
                                min: 0,
                                max: 1,
                                step: 0.01,
                                hide_min_max: true,
                                hide_from_to: true,
                                from: item.layer.options.opacity,
                                onChange: function (o) {
                                    item.layer.setOpacity(o.from);
                                }
                            });

                            return $slider[0];
                        }
                    }));

                    this.getPanelLayer(mapResult).addTo(mapTaskLeaflet.getMap(mapResult));
                } else {
                    Notify.error('No project selected.');
                }
            },
            /**
             * Filtro integration GEE
             * Receberá um conjunto de regras para processamento earth engine
             * @param {rules} rules
             */
            processIntegrationFilterGee: function (rules, mapResult) {
                // formata as regras, retirando aquelas que não estão ativas
                /* if (rules) {} else {
                    Notify.error('No project selected.');
                } */
                //rules = this.formatIntegrationClasses(rules);
                
                /* GEEProcessDataService
                    .geeIntegrationFilter(rules, function (url) {
                        mapTaskLeaflet.getMap(mapResult).addLayer(url);
                    }); */

                // GEEProcessDataService
                //     .geeGetClassifications(rules, function (url) {
                //         mapTaskLeaflet.getMap(mapResult).addLayer(url);
                //     });

                var progressbarControl1;
                var progressbarControl2;

                // formata as regras, retirando aquelas que não estão ativas
                if (rules.length) {
                    GEEProcessDataService
                        .geeIntegrationFilter(rules, function (url) {

                            // progress bar
                            progressbarControl1 = new L.Control.LayerProgressBar({
                                layers: [{
                                    label: "Integrating data...",
                                    layer: url,
                                }]
                            });

                            mapTaskLeaflet.getMap(mapResult).addControl(progressbarControl1);

                            if (geeIntegrationLayer) {
                                mapTaskLeaflet.getMap(mapResult).removeLayer(geeIntegrationLayer);
                            }
                            geeIntegrationLayer = url;
                            mapTaskLeaflet.getMap(mapResult).addLayer(geeIntegrationLayer);
                        });

                    GEEProcessDataService
                        .geeGetClassifications(rules, function (url) {

                            // progress bar
                            progressbarControl2 = new L.Control.LayerProgressBar({
                                layers: [{
                                    label: "Classificating data...",
                                    layer: url,
                                }]
                            });

                            mapTaskLeaflet.getMap(mapResult).addControl(progressbarControl2);

                            if (geeClassificationLayer) {
                                mapTaskLeaflet.getMap(mapResult).removeLayer(geeClassificationLayer);
                            }

                            if (mapTaskLeaflet.getPanelLayer(mapResult)) {
                                mapTaskLeaflet.removePanelLayer(mapResult);
                            }
                            geeClassificationLayer = url;

                            mapTaskLeaflet.getMap(mapResult).addLayer(geeClassificationLayer);
                        });

                    $rootScope.$on('errorTemporalMap', function (ev, error) {
                        Notify.error(error);
                        mapTaskLeaflet.getMap(mapResult).removeControl(progressbarControl1);
                        mapTaskLeaflet.getMap(mapResult).removeControl(progressbarControl2);
                    });

                    this.setPanelLayer(mapResult, L.control.panelLayers(null, [{
                        group: "Layers",
                        layers: [{
                                active: true,
                                name: "Classification data",
                                layer: geeClassificationLayer
                            },
                            {
                                active: true,
                                name: "Integration data",
                                layer: geeIntegrationLayer
                            }
                        ]
                    }], {
                        position: 'topright',
                        buildItem: function (item) {

                            var $slider = $('<div class="layer-slider">');

                            var $input = $('<input type="text" value="' + item.layer.options.opacity + '" />');

                            $slider.append($input);

                            $input.ionRangeSlider({
                                min: 0,
                                max: 1,
                                step: 0.01,
                                hide_min_max: true,
                                hide_from_to: true,
                                from: item.layer.options.opacity,
                                onChange: function (o) {
                                    item.layer.setOpacity(o.from);
                                }
                            });

                            return $slider[0];
                        }
                    }));

                    this.getPanelLayer(mapResult).addTo(mapTaskLeaflet.getMap(mapResult));
                } else {
                    Notify.error('No project selected.');
                }
            },
            formatIntegrationClasses: function (rules) {
                console.log("RULES", rules);

                var prevalenceList = [];

                for (var i = 0; i < rules.length; i++) {
                    var el = rules[i];
                    
                    if (el.Asset.asset) {
                        prevalenceList.push({
                            'prevalence_id': el.IntegrationFilter.prevalence_id + 1,
                            'label': el.Classe.classe,
                            'rule': {
                                'class_input': el.Classe.id,
                                'class_output': el.Classe.id,
                                'source': el.Asset.asset + '/' + '1985'
                            },
                            'exception': null
                        });
                    } else {
                        prevalenceList.push({
                            'prevalence_id': el.IntegrationFilter.prevalence_id + 1,
                            'label': el.Classe.classe,
                            'rule': {
                                'class_input': el.Classe.id,
                                'class_output': el.Classe.id,
                                'source': null
                            },
                            'exception': null
                        });
                    }
                }

                console.log("prevalenceList", prevalenceList);
                

                return prevalenceList;
            },
            /**
             * Função que define carta com entorno azul
             * @param {layerBlueStyle} layer 
             */
            layerBlueStyle: function (layer) {
                layer.setStyle({
                    "color": "blue",
                    "weight": 1.5,
                    "opacity": 0.9,
                });
            },
            /**
             * @param {layerDefaultStyle}
             */
            layerDefaultStyle: function (layer) {
                layer.setStyle({
                    "color": "#78b569",
                    "weight": 0.5,
                    "opacity": 0.1,
                    "fillOpacity": 0,
                });
            },
            /**
             * Exibe a carta com borda vermelha
             * @param {layerRedStyle} layer 
             */
            layerRedStyle: function (layer) {
                layer.setStyle({
                    "color": "red",
                    "weight": 1,
                    "opacity": 0.9,
                });
            },
            /**
             * Função configura o estilo do layer
             * @param {layer} layer set the layer style
             */
            layerYellowStyle: function (layer) {
                layer.setStyle({
                    "color": "#ffff00",
                    "weight": 1.0,
                    "opacity": 1,
                    "fillOpacity": 0.0,
                });
            },
            /**
             * formata as regras e retira as que não estão ativas
             * @param {rules} rules regras
             * @param {objName} objName nome do objeto
             */
            formatRules: function (rules, objName) {
                var formatedRules = [];

                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i][objName];
                    if (rule.active) {
                        formatedRules.push(rule);
                    }
                }

                return formatedRules;
            },
            /**
             * Componente de pesquisa por nome da carta
             * @param {nameMap} nameMap nome do mapa
             */
            searchMap: function (nameMap, mapResult) {
                var map1 = this.getMap(nameMap);
                var map2 = this.getMap(mapResult);

                var markersLayer = new L.LayerGroup(); //layer contain searched elements

                map1.addLayer(markersLayer);

                searchControl[nameMap] = new L.Control.Search({
                    layer: markersLayer,
                    propertyName: 'name',
                    marker: false
                });

                map1.addControl(searchControl[nameMap]); //inizialize search control
                markersLayer.addLayer(this.getCartaLayer(nameMap));
            }
        };

        return mapTaskLeaflet;

    }
]);