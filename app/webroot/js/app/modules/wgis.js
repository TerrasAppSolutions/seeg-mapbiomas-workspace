angular.module('MapBiomas.wgis', []);

angular.module('MapBiomas.wgis').factory('Wgis', [
    function () {

        var Wgis = function () {
            var _wgisCtrl = this;

            this.wgis = {};

            this.setWgis = function (wgis) {
                _wgisCtrl = $.extend(_wgisCtrl, wgis);
                events.onLoad();
            };

            this.onLoad = function (callback) {
                events.onLoad = callback;
            };

            var events = {
                onLoad: function () {}
            };
        };

        return new Wgis();
    }
]);

angular.module('MapBiomas.wgis').directive('wgisWorkspace', ['StylesGeoJSON', 'Wgis',
    function (StylesGeoJSON, Wgis) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, element, attrs) {

                var $wgis;

                var layoutContentHeight = $('#layout-content').height().toString() + 'px';

                var init = function () {

                    element.html("");

                    $wgis = $(element).wgis({
                        styles: StylesGeoJSON,
                        osm: false,
                        switchLayer: false,
                        height: layoutContentHeight
                    });

                    Wgis.setWgis($wgis);
                };

                init();
            }
        };
    }
]);

angular.module('MapBiomas.wgis').factory('WorkspaceLayers', ['AppConfig', '$filter',
    function (AppConfig, $filter) {
        return {
            imgsref: function (wgis) {                

                var mapfilepath = AppConfig.MAPSERVER.mapfilepath;
                var mapfilehost = AppConfig.MAPSERVER.mapfilehost;

                /*
                 * MapBiomas Consolidado
                 */
                wgis.addNodeLabel($filter('translate')('CONSOLIDADO'));

                var consolidado = {};

                consolidado[$filter('translate')('AMAZONIA')] = {
                    "collection": "AMAZONIA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                consolidado[$filter('translate')('CAATINGA')] = {
                    "collection": "CAATINGA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                consolidado[$filter('translate')('CERRADO')] = {
                    "collection": "CERRADO",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                consolidado[$filter('translate')('MATAATLANTICA')] = {
                    "collection": "MATAATLANTICA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                consolidado[$filter('translate')('PAMPA')] = {
                    "collection": "PAMPA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                consolidado[$filter('translate')('PANTANAL')] = {
                    "collection": "PANTANAL",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                consolidado[$filter('translate')('ZONACOSTEIRA')] = {
                    "collection": "ZONACOSTEIRA",
                    "anos": []
                };

                var consolidadoClasses = {
                    1: $filter('translate')('FLORESTA'),
                    2: $filter('translate')('NAOFLORESTA'),
                    3: $filter('translate')('AGUA'),
                    4: "Vegetação não florestal",
                    5: $filter('translate')('PASTAGEM'),
                    6: $filter('translate')('AGRICULTURA'),
                    7: $filter('translate')('FLORESTAPLANTADA')
                        //8: "Floresta da zona costeira"
                }

                angular.forEach(consolidado, function (bioma, biomaName) {
                    if (bioma.anos.length > 0) {
                        wgis.addNodeLabel(biomaName, $filter('translate')('CONSOLIDADO'));
                    }
                    if (biomaName == $filter('translate')('MATAATLANTICA')) {
                        angular.forEach(bioma.anos, function (ano, anoKey) {
                            angular.forEach(consolidadoClasses, function (className, classId) {
                                wgis.addLayerWMS({
                                        url: mapfilehost,
                                        params: {
                                            map: mapfilepath + "/classification/bioma_integrate.map",
                                            layers: 'bioma',
                                            year: ano,
                                            bioma_collection: bioma.collection,
                                            classification_ids: classId,
                                            format: 'image/png',
                                            transparent: true
                                        }
                                    },
                                    className, $filter('translate')('CONSOLIDADO') + "+>" + biomaName + "+>" + ano, false, 'img/legendas/integracao_' + classId + '.png');
                            });
                        });
                    } else {
                        angular.forEach(bioma.anos, function (ano, anoKey) {
                            wgis.addLayerWMS({
                                    url: mapfilehost,
                                    params: {
                                        map: mapfilepath + "/classification/bioma_integrate.map",
                                        layers: 'bioma',
                                        year: ano,
                                        bioma_collection: bioma.collection,
                                        classification_ids: [1, 2, 3, 4, 5, 6, 7, 8],
                                        format: 'image/png',
                                        transparent: true
                                    }
                                },
                                ano, $filter('translate')('CONSOLIDADO') + "+>" + biomaName, false, 'img/layergroup.png');
                        });
                    }
                });

                /*
                 * MapBiomas Consolidado
                 */
                wgis.addNodeLabel($filter('translate')('CLASSSIFICACAO'));

                var biomasAnos = {};

                biomasAnos[$filter('translate')('AMAZONIA')] = {
                    "collection": "AMAZONIA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                biomasAnos[$filter('translate')('CAATINGA')] = {
                    "collection": "CAATINGA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                biomasAnos[$filter('translate')('CERRADO')] = {
                    "collection": "CERRADO",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };
                biomasAnos[$filter('translate')('MATAATLANTICA')] = {
                    "collection": "MATAATLANTICA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                biomasAnos[$filter('translate')('PAMPA')] = {
                    "collection": "PAMPA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                biomasAnos[$filter('translate')('PANTANAL')] = {
                    "collection": "PANTANAL",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                biomasAnos[$filter('translate')('ZONACOSTEIRA')] = {
                    "collection": "ZONACOSTEIRA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
                };

                angular.forEach(biomasAnos, function (bioma, biomaName) {
                    if (bioma.anos.length > 0) {
                        wgis.addNodeLabel(biomaName, $filter('translate')('CLASSSIFICACAO'));
                    }

                    if (biomaName === $filter('translate')('ZONACOSTEIRA')) {
                        wgis.addNodeLabel($filter('translate')('AGRICULTURA'), $filter('translate')('CLASSSIFICACAO'));
                        wgis.addNodeLabel($filter('translate')('CANADEACUCAR'), $filter('translate')('CLASSSIFICACAO'));
                        wgis.addNodeLabel($filter('translate')('FLORESTAPLANTADA'), $filter('translate')('CLASSSIFICACAO'));
                        wgis.addNodeLabel($filter('translate')('PASTAGEM'), $filter('translate')('CLASSSIFICACAO'));
                    }

                    angular.forEach(bioma.anos, function (ano, anoKey) {

                        wgis.addLayerWMS({
                                url: mapfilehost,
                                params: {
                                    map: mapfilepath + "/classification/bioma.map",
                                    layers: 'bioma',
                                    year: ano,
                                    bioma_collection: bioma.collection,
                                    classification_ids: 1,
                                    format: 'image/png',
                                    transparent: true
                                }
                            },
                            $filter('translate')('FLORESTA'), $filter('translate')('CLASSSIFICACAO') + "+>" + biomaName + "+>" + ano, false, "img/legendas/floresta.png");

                        wgis.addLayerWMS({
                                url: mapfilehost,
                                params: {
                                    map: mapfilepath + "/classification/bioma.map",
                                    layers: 'bioma',
                                    bioma_collection: bioma.collection,
                                    year: ano,
                                    classification_ids: 2,
                                    format: 'image/png',
                                    transparent: true
                                }
                            },
                            $filter('translate')('NAOFLORESTA'), $filter('translate')('CLASSSIFICACAO') + "+>" + biomaName + "+>" + ano, false, "img/legendas/naofloresta.png");

                        wgis.addLayerWMS({
                                url: mapfilehost,
                                params: {
                                    map: mapfilepath + "/classification/bioma.map",
                                    layers: 'bioma',
                                    year: ano,
                                    bioma_collection: bioma.collection,
                                    classification_ids: 3,
                                    format: 'image/png',
                                    transparent: true
                                }
                            },
                            $filter('translate')('AGUA'), $filter('translate')('CLASSSIFICACAO') + "+>" + biomaName + "+>" + ano, false, "img/legendas/agua.png");
                    });
                });

                // Cana
                var cana_florestaplantadaClasses = {};
                cana_florestaplantadaClasses[$filter('translate')('CANADEACUCAR')] = {
                    "icon": "img/legendas/cana.png",
                    "collection": "AMAZONIA",
                    "anos": {
                        "2008": "0708",
                        "2009": "0809",
                        "2010": "0910",
                        "2011": "1011",
                        "2013": "1113",
                        "2014": "1314"
                    }

                };
                cana_florestaplantadaClasses[$filter('translate')('FLORESTAPLANTADA')] = {
                    "icon": "img/legendas/florestaplantada.png",
                    "collection": "AMAZONIA",
                    "anos": {
                        "2008": "0708",
                        "2009": "0809",
                        "2010": "0910",
                        "2011": "1011",
                        "2013": "1113",
                        "2014": "1314"
                    }
                };

                angular.forEach(cana_florestaplantadaClasses, function (subclass, subclassName) {
                    angular.forEach(subclass.anos, function (ano, anoKey) {
                        wgis.addLayerWMS({
                                url: mapfilehost,
                                params: {
                                    map: mapfilepath + "/imgsref/cana_florestaplantada.map",
                                    layers: 'cana',
                                    year: ano,
                                    class_cana: subclassName === $filter('translate')('CANADEACUCAR'),
                                    class_florestaplantada: subclassName === $filter('translate')('FLORESTAPLANTADA'),
                                    format: 'image/png',
                                    transparent: true
                                }
                            },
                            anoKey, $filter('translate')('CLASSSIFICACAO') + "+>" + subclassName, false, subclass.icon);
                    });
                });

                // Agricultura

                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'crop',
                            years: '0708',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2008", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'crop',
                            years: '0809',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2009", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'crop',
                            years: '0910',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2010", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'crop',
                            years: '1011',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2011", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'crop',
                            years: '111213',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2013", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'crop',
                            years: '1314',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2014", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

                // Pastagem
                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'pasture',
                            years: '0708',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2008", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");

                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'pasture',
                            years: '0809',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2009", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");

                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'pasture',
                            years: '0910',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2010", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");

                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'pasture',
                            years: '1011',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2011", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");

                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'pasture',
                            years: '111213',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2013", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");

                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/croppasture.map",
                            layers: 'croppasture',
                            class: 'pasture',
                            years: '1314',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2014", $filter('translate')('CLASSSIFICACAO') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");

                /*
                 * Mapas de Referencia
                 */
                wgis.addNodeLabel($filter('translate')('MAPAREFERENCIA'));

                // Amazônia > TerraClass
                wgis.addNodeLabel($filter('translate')('AMAZONIA'), $filter('translate')('MAPAREFERENCIA'));

                var prodesClasses = {};

                prodesClasses[$filter('translate')('FLORESTA')] = {
                    "icon": "img/legendas/forest.png",
                    "collection": "FLORESTA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014"]
                };

                prodesClasses[$filter('translate')('NAOFLORESTA')] = {
                    "icon": "img/legendas/nonforest_pink.png",
                    "collection": "NAOFLORESTA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014"]
                };

                prodesClasses[$filter('translate')('AGUA')] = {
                    "icon": "img/legendas/water.png",
                    "collection": "AGUA",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014"]
                };

                prodesClasses[$filter('translate')('NUVEM')] = {
                    "icon": "img/legendas/cloud.png",
                    "collection": "NUVEM",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014"]
                };

                prodesClasses[$filter('translate')('DESMATAMENTO')] = {
                    "icon": "img/legendas/deforestation.png",
                    "collection": "DESMATAMENTO",
                    "anos": ["2008", "2009", "2010", "2011", "2012", "2013", "2014"]
                };

                angular.forEach(prodesClasses, function (subclass, subclassName) {
                    angular.forEach(subclass.anos, function (ano, anoKey) {
                        wgis.addLayerWMS({
                                url: mapfilehost,
                                params: {
                                    map: mapfilepath + "/imgsref/prodes.map",
                                    layers: 'prodes',
                                    year: ano,
                                    class_forest: subclassName === $filter('translate')('FLORESTA'),
                                    class_nonforest: subclassName === $filter('translate')('NAOFLORESTA'),
                                    class_water: subclassName === $filter('translate')('AGUA'),
                                    class_cloud: subclassName === $filter('translate')('NUVEM'),
                                    class_deforestation: subclassName === $filter('translate')('DESMATAMENTO'),
                                    format: 'image/png',
                                    transparent: true
                                }
                            },
                            subclassName, $filter('translate')('MAPAREFERENCIA') + "+>" + $filter('translate')('AMAZONIA') + "+>Prodes+>" + ano, false, subclass.icon);

                    });
                });

                var terraclasseClasses = {};

                terraclasseClasses[$filter('translate')('FLORESTA')] = {
                    "icon": "img/legendas/forest.png",
                    "collection": "FLORESTA",
                    "anos": ["2008"]
                };

                terraclasseClasses[$filter('translate')('NAOFLORESTA')] = {
                    "icon": "img/legendas/nonforest_pink.png",
                    "collection": "NAOFLORESTA",
                    "anos": ["2008"]
                };

                terraclasseClasses[$filter('translate')('AGUA')] = {
                    "icon": "img/legendas/water.png",
                    "collection": "AGUA",
                    "anos": ["2008"]
                };

                terraclasseClasses[$filter('translate')('NUVEM')] = {
                    "icon": "img/legendas/cloud.png",
                    "collection": "NUVEM",
                    "anos": ["2008"]
                };

                terraclasseClasses[$filter('translate')('DESMATAMENTO')] = {
                    "icon": "img/legendas/deforestation.png",
                    "collection": "DESMATAMENTO",
                    "anos": ["2008"]
                };

                angular.forEach(terraclasseClasses, function (subclass, subclassName) {
                    angular.forEach(subclass.anos, function (ano, anoKey) {
                        wgis.addLayerWMS({
                                url: mapfilehost,
                                params: {
                                    map: mapfilepath + "/imgsref/terraclass.map",
                                    layers: 'terraclass',
                                    class_forest: subclassName === $filter('translate')('FLORESTA'),
                                    class_nonforest: subclassName === $filter('translate')('NAOFLORESTA'),
                                    class_water: subclassName === $filter('translate')('AGUA'),
                                    class_cloud: subclassName === $filter('translate')('NUVEM'),
                                    class_deforestation: subclassName === $filter('translate')('DESMATAMENTO'),
                                    format: 'image/png',
                                    transparent: true
                                }
                            },
                            subclassName, $filter('translate')('MAPAREFERENCIA') + "+>" + $filter('translate')('AMAZONIA') + "+>Terraclass", false, subclass.icon);
                    });
                });

                var mapreferenceClass = {};

                mapreferenceClass[$filter('translate')('CAATINGA')] = {
                    "collection": "CAATINGA",
                    "layer": "caatinga",
                    "anos": ["2008"]
                };

                mapreferenceClass[$filter('translate')('CERRADO')] = {
                    "collection": "CERRADO",
                    "layer": "cerrado",
                    "anos": ["2008"]
                };
                mapreferenceClass[$filter('translate')('MATAATLANTICA')] = {
                    "collection": "MATAATLANTICA",
                    "layer": "mataatlantica",
                    "anos": ["2008"]
                };

                mapreferenceClass[$filter('translate')('PAMPA')] = {
                    "collection": "PAMPA",
                    "layer": "pampa",
                    "anos": ["2008"]
                };

                mapreferenceClass[$filter('translate')('PANTANAL')] = {
                    "collection": "PANTANAL",
                    "layer": "pantanal",
                    "anos": ["2008"]
                };

                mapreferenceClass[$filter('translate')('ZONACOSTEIRA')] = {
                    "collection": "ZONACOSTEIRA",
                    "layer": "zonacosteira",
                    "anos": ["2008"]
                };

                angular.forEach(mapreferenceClass, function (subclass, subclassName) {
                    angular.forEach(subclass.anos, function (ano, anoKey) {
                        wgis.addLayerWMS({
                                url: mapfilehost,
                                params: {
                                    map: mapfilepath + "/imgsref/" + subclass.layer + ".map",
                                    layers: subclass.layer,
                                    format: 'image/png',
                                    transparent: true
                                }
                            },
                            subclassName, $filter('translate')('MAPAREFERENCIA'), false, null);
                    });
                });
            },
            cartasInfo: function (wgis) {
                L.geoJson(cartas, {
                    style: function (feature) {
                        return {
                            color: feature.properties.color
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(feature.properties.description);
                    }
                }).addTo(wgis._wgis.lmap);
            }
        };
    }
]);

angular.module('MapBiomas.wgis').factory('StylesGeoJSON', [
    function () {
        var styles = {
            APRT: {
                fillColor: null,
                fillOpacity: 0,
                color: "#dffc10",
                opacity: 1,
                weight: 3,
                className: "feature feature-aprt"
            },
            AUAS: {
                fillColor: 'url(#pattern-auas)',
                fillOpacity: '0.8',
                color: '#000000',
                opacity: 1,
                weight: 3,
                className: "feature feature-auas"
            },
            APPD: {
                fillColor: '#F87C7C',
                fillOpacity: 1,
                color: "#9DACE5",
                opacity: 1,
                weight: 3,
                className: "feature feature-appd"
            },
            APP: {
                fillColor: 'url(#pattern-app)',
                fillOpacity: 1,
                color: "#6CD2F0",
                opacity: 1,
                weight: 3,
                className: "feature feature-app"
            },
            ARL: {
                fillColor: 'url(#pattern-arl)',
                fillOpacity: 1,
                color: "#000000",
                opacity: 1,
                weight: 3,
                className: "feature feature-arl"
            },
            talhao: {
                fillColor: 'url(#pattern-talhao)',
                fillOpacity: 1,
                color: "#B5802B",
                opacity: 1,
                weight: 1,
                className: "feature feature-talhao"
            },
            municipio: {
                fillColor: null,
                fillOpacity: 0,
                color: "#000000",
                opacity: 1,
                weight: 3,
                className: "feature feature-municipio"
            }
        };

        var patterns = "";
        patterns += "<svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\" xml:space=\"preserve\"> ";
        patterns += "  <defs>";
        patterns += "    <pattern id=\"pattern-auas\" patternUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"10\" height=\"10\">";
        patterns += "        <g style=\"fill:none; stroke:black; stroke-width:1\">";
        patterns += "        <path d=\"M0,0 l10,10\"\/>";
        patterns += "        <path d=\"M10,0 l-10,10\"\/>";
        patterns += "        <\/g>";
        patterns += "    <\/pattern>";
        patterns += "    <pattern id=\"pattern-arl\" patternUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"10\" height=\"10\">";
        patterns += "        <g style=\"fill:none; stroke:#CDCDCD; stroke-width:1\">";
        patterns += "        <path d=\"M 0,10 l 10,-10 M -2.5,2.5 l 5,-5M 7.5,12.5 l 5,-5\" stroke-width=\"1\" shape-rendering=\"auto\" stroke-linecap=\"square\"><\/path>";
        patterns += "        <\/g>";
        patterns += "    <\/pattern>";
        patterns += "    <pattern id=\"pattern-app\" patternUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"10\" height=\"10\">";
        patterns += "        <g style=\"fill:none; stroke:#6CD2F0; stroke-width:1\">";
        patterns += "        <path d=\"M 0,10 l 10,-10 M -2.5,2.5 l 5,-5M 7.5,12.5 l 5,-5\" stroke-width=\"1\" shape-rendering=\"auto\" stroke-linecap=\"square\"><\/path>";
        patterns += "        <\/g>";
        patterns += "    <\/pattern>";
        patterns += "    <pattern id=\"pattern-img\" patternUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"10\" height=\"10\">";
        patterns += "        <image xlink:href=\"APP.png\" x=\"0\" y=\"0\" width=\"10\" height=\"10\"> <\/image> ";
        patterns += "    <\/pattern>";
        patterns += "    <pattern id=\"pattern-talhao\" patternUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"10\" height=\"10\">";
        patterns += "        <g style=\"fill:none; stroke:#CE952B; stroke-width:1\">";
        patterns += "        <path d=\"M 0,10 l 10,-10 M -2.5,2.5 l 5,-5M 7.5,12.5 l 5,-5\" stroke-width=\"1\" shape-rendering=\"auto\" stroke-linecap=\"square\"><\/path>";
        patterns += "        <\/g>";
        patterns += "    <\/pattern>";
        patterns += "  <\/defs>    ";
        patterns += "<\/svg>";

        styles.patterns = patterns;

        return styles;
    }
]);