/**
 * Service de comunicação google earth engine
 * @argument func getElevation
 */

'use strict';

angular.module('MapBiomas.services').factory('MapTaskLeaflet', ['$http', 'AppConfig', 'GEEProcessDataService', '$injector',
    function ($http, AppConfig, GEEProcessDataService, $injector) {

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

        var geeTemporalClassificationLayer;
        var geeTemporalFilteredLayer;

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
            removeLayerControl: function (name) {
                this.getLayerControl(name).removeFrom(this.getMap(name));
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
             */
            findCartaLayer: function (nameMap, layer) {

                var clayers = this.getCartaLayer(nameMap).getLayers();
                var cartaLayer = _.find(clayers, function (l) {
                    return l.feature.properties.name == layer.feature.properties.name;
                });
                // define a carta selecionada como última carta selecionada
                // volta o estilo para default
                // console.log(nameMap, cartaLayer);

                if (this.getLastCartaSelected(nameMap)) {
                    this.layerDefaultStyle(this.getLastCartaSelected(nameMap));
                }
                this.setLastCartaSelected(nameMap, cartaLayer);
                return cartaLayer;
            },
            /**
             * fit bound na carta com zoom menos para melhor visualização
             */
            fitBounds: function (nameMap, layer) {
                this.getMap(nameMap).fitBounds(layer);

                // define o zoom do mapa ao selecionar carta
                // timeout devido a problemas ocorridos ao fazer fitbound e zoom
                setTimeout(function () {
                    mapTaskLeaflet.getMap(nameMap).setZoom(8);
                }, 400);
            },
            processButtom: function (mapButton, mapResult) {
                return L.easyButton('fa-cogs fa-lg', function () {

                    GEEProcessDataService.geeGetNdvi(this.getLastCartaSelected(mapResult), function (url) {
                        /*
                         * ProgressBar
                         */
                        var progressbarControl = new L.Control.LayerProgressBar({
                            layers: [{
                                label: "Processing...",
                                layer: url,
                            }]
                        });
                        console.log("URL", url);
                        mapTaskLeaflet.getMap(mapResult).addControl(progressbarControl);
                        // remove layer caso já tenha sido processado
                        if (lastUrl) {
                            mapTaskLeaflet.getMap(mapResult).removeLayer(lastUrl);
                        }
                        lastUrl = url;
                        mapTaskLeaflet.getMap(mapResult).addLayer(url);
                    });
                }).addTo(this.getMap(mapButton));
            },
            /**
             * Filtro temporal GEE
             * Receberá um conjunto de regras para processamento earth engine
             * @param {rules} rules
             */
            processTemporalFilterGee: function (rules, chart, biome, mapResult) {
                console.log("biome", biome);

                // console.log("REGRAS", rules);
                // formata as regras, retirando aquelas que não estão ativas
                if (rules.length) {
                    var formatedRules = this.formatRules(rules, 'TemporalFilter');

                    /* geeTemporalClassificationLayer = new L.TileLayer.GeeScript(
                        function (callback) {
                            var assetTileUrl = GEEProcessDataService
                                .geeTemporalFilter(formatedRules, chart, biome, 'classification');
                            callback(assetTileUrl);
                        }
                    );

                    geeTemporalFilteredLayer = new L.TileLayer.GeeScript(
                        function (callback) {
                            var assetTileUrl = GEEProcessDataService
                                .geeTemporalFilter(formatedRules, chart, biome, 'filtered');
                            callback(assetTileUrl);
                        }
                    ); */

                    GEEProcessDataService
                        .geeTemporalFilter(formatedRules, chart, biome, 'filtered', function (url) {
                            if (geeTemporalFilteredLayer) {
                                mapTaskLeaflet.getMap(mapResult).removeLayer(geeTemporalFilteredLayer);
                            }
                            geeTemporalFilteredLayer = url;
                            mapTaskLeaflet.getMap(mapResult).addLayer(geeTemporalFilteredLayer);
                        });

                    GEEProcessDataService
                        .geeTemporalFilter(formatedRules, chart, biome, 'classification', function (url) {
                            if (geeTemporalClassificationLayer) {
                                mapTaskLeaflet.getMap(mapResult).removeLayer(geeTemporalClassificationLayer);
                            }

                            if (mapTaskLeaflet.getLayerControl(mapResult)) {
                                mapTaskLeaflet.removeLayerControl(mapResult);
                            }
                            geeTemporalClassificationLayer = url;
                            mapTaskLeaflet.getMap(mapResult).addLayer(geeTemporalClassificationLayer);
                        });

                    this.setLayerControl(mapResult, L.control.layers({}, {
                        "Classification": geeTemporalClassificationLayer,
                        "Filtered": geeTemporalFilteredLayer,
                    }));



                    this.getLayerControl(mapResult).addTo(mapTaskLeaflet.getMap(mapResult));

                    /* setTimeout(function() {
                       // remove layer control e carta processada
                       if (mapTaskLeaflet.getLayerControl(mapResult)) {
                           console.log("geeTemporalClassificationLayer", geeTemporalClassificationLayer);

                           mapTaskLeaflet.removeLayerControl(mapResult);
                           mapTaskLeaflet.getMap(mapResult).removeLayer(geeTemporalClassificationLayer);
                           mapTaskLeaflet.getMap(mapResult).removeLayer(geeTemporalFilteredLayer);
                       }
                    }, 10000); */
                } else {
                    Notify.error('No project selected.');
                }
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
                    // "fillOpacity": 0.2,
                    // "fillColor": "#ff6666"
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
                    // "fillColor": "#ff6666"
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
                    // "fillOpacity": 0.2,
                    // "fillColor": "#ff6666"
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
                console.log(mapResult);


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