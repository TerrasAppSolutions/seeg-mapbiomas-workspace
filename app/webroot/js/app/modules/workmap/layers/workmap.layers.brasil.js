angular.module('MapBiomas.workmap').factory('WorkspaceLayers', ['AppConfig', '$filter', "$injector",
    function(AppConfig, $filter, $injector) {
        return {
            imgsref: function(wgis) {

                var mapfilepath = AppConfig.MAPSERVER.mapfilepath;
                var mapfilehost = AppConfig.MAPSERVER.mapfilehost;                

                var biomas = ['AMAZONIA', 'CAATINGA', 'CERRADO', 'PAMPA', 'PANTANAL', 'MATAATLANTICA'];

                var anos = [];

                // valores iniciais dos anos
                for (var i = 2000; i <= 2016; i++) {
                    anos.push(i);
                }

                /**
                 * COLEÇÂO 1
                 */

                wgis.addNodeLabel($filter('translate')('COLECAO') + " 1");
                wgis.addNodeLabel($filter('translate')('CONSOLIDADOCLASSIFICACAO'), $filter('translate')('COLECAO') + " 1");

                /*
                 * MapBiomas Consolidado
                 */

                wgis.addNodeLabel($filter('translate')('CLASSIFICACAONAOCONSOLIDADA'), $filter('translate')('COLECAO') + " 1");

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

                angular.forEach(biomasAnos, function(bioma, biomaName) {
                    if (bioma.anos.length > 0) {
                        wgis.addNodeLabel(biomaName, $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA'));
                        console.log(biomaName, $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA'));
                    }

                    if (biomaName === $filter('translate')('ZONACOSTEIRA')) {
                        wgis.addNodeLabel($filter('translate')('AGRICULTURA'), $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA'));
                        wgis.addNodeLabel($filter('translate')('CANADEACUCAR'), $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA'));
                        wgis.addNodeLabel($filter('translate')('FLORESTAPLANTADA'), $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA'));
                        wgis.addNodeLabel($filter('translate')('PASTAGEM'), $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA'));
                    }


                    angular.forEach(bioma.anos, function(ano, anoKey) {

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
                            $filter('translate')('FLORESTA'), $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + biomaName + "+>" + ano, false, "img/legendas/floresta.png");

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
                            $filter('translate')('NAOFLORESTA'), $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + biomaName + "+>" + ano, false, "img/legendas/naofloresta.png");

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
                            $filter('translate')('AGUA'), $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + biomaName + "+>" + ano, false, "img/legendas/agua.png");
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

                angular.forEach(cana_florestaplantadaClasses, function(subclass, subclassName) {
                    angular.forEach(subclass.anos, function(ano, anoKey) {
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
                            anoKey, $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + subclassName, false, subclass.icon);
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
                    "2008", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

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
                    "2009", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

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
                    "2010", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

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
                    "2011", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

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
                    "2013", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

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
                    "2014", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('AGRICULTURA'), false, "img/legendas/agricultura.png");

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
                    "2008", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");

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
                    "2009", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");

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
                    "2010", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");

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
                    "2011", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");

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
                    "2013", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");

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
                    "2014", $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')('PASTAGEM'), false, "img/legendas/pastagem.png");


                /*
                 * MapBiomas Consolidado
                 */
                // wgis.addNodeLabel($filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CONSOLIDADOCLASSIFICACAO'));

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
                };

                var legends_icons = {
                    0: "img/legendas/colecao1/nodata_0.png",
                    1: "img/legendas/colecao1/floresta_1.png",
                    2: "img/legendas/colecao1/naofloresta_2.png",
                    3: "img/legendas/colecao1/agua_3.png",
                    4: "img/legendas/colecao1/vegetacaonaoflorestal_4.png",
                    5: "img/legendas/colecao1/pastagem_5.png",
                    6: "img/legendas/colecao1/agricultura_6.png",
                    7: "img/legendas/colecao1/florestaplantada_7.png",
                    8: "img/legendas/colecao1/florestazonacosteira_8.png",
                };


                angular.forEach(consolidado, function(bioma, biomaName) {
                    if (bioma.anos.length > 0) {
                        wgis.addNodeLabel(biomaName, $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CONSOLIDADOCLASSIFICACAO'));
                    }

                    angular.forEach(bioma.anos, function(ano, anoKey) {
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
                            ano, $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CONSOLIDADOCLASSIFICACAO') + "+>" + biomaName, false, 'img/layergroup.png');

                        var DtreeClasses = $injector.get('DtreeClasses').getClasses("0");

                        angular.forEach(DtreeClasses, function(classedtree) {
                            var id = classedtree.id
                            var nameclass = classedtree.classe
                            var icon = legends_icons[id]
                            wgis.addNodeLabel(nameclass, $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CONSOLIDADOCLASSIFICACAO') + "+>" + biomaName + "+>" + ano,
                                icon
                            );

                        });


                    });

                });


                // wgis.addNodeLabel(subclassName, $filter('translate')('MAPAREFERENCIA') + "+>" + $filter('translate')('PAMPA')+ "+>" + ano,
                //  subclass.icon


                /**
                 * COLEÇÂO 2
                 */

                var assetServiceCol2 = new MapbiomasAssetService({
                    'assets': {
                        'regioes': 'projects/mapbiomas-workspace/AUXILIAR/regioes',
                        'mosaico': 'projects/mapbiomas-workspace/MOSAICOS/workspace',
                        'classificacao': 'projects/mapbiomas-workspace/COLECAO2/classificacao',
                        'classificacaoft': 'projects/mapbiomas-workspace/COLECAO2/classificacao-ft',
                    },
                    "palette": "#129912,#1f4423,#006400,#00ff00,#65c24b,#687537," +
                        "#76a5af,#29eee4,#77a605,#935132,#ffe599,#45c2a5,#f1c232,#b8af4f,#ffffb2," +
                        "#ffd966,#ffe599,#f6b26b,#e974ed,#d5a6bd,#c27ba0,#a64d79,#ea9999,#cc4125," +
                        "#dd7e6b,#e6b8af,#980000,#999999,#b7b7b7,#434343,#d9d9d9,#0000ff,#d5d5e5"

                });

                wgis.addNodeLabel($filter('translate')('COLECAO') + " 2");
                wgis.addNodeLabel($filter('translate')('MOSAICOIMAGENS') + " (Beta)", $filter('translate')('COLECAO') + " 2");
                wgis.addNodeLabel($filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " (Beta)", $filter('translate')('COLECAO') + " 2");

                // Mosaico
                angular.forEach(biomas, function(assetBioma, biomaIndex) {
                    anos.forEach(function(assetAno, anoIndex) {
                        if (anoIndex == 0) {
                            wgis.addNodeLabel($filter('translate')(assetBioma), $filter('translate')('COLECAO') + " 2+>" + $filter('translate')('MOSAICOIMAGENS') + " (Beta)", 'img/layergroup.png');
                        }
                        var geeMosaicLayer = new L.TileLayer.GeeScript(function(callback) {

                            var assetTileUrl = assetServiceCol2
                                .getMosaicByBiomaYear(assetBioma, assetAno);

                            callback(assetTileUrl);
                        });

                        wgis.addLayer(geeMosaicLayer, assetAno, $filter('translate')('COLECAO') + " 2+>" + $filter('translate')('MOSAICOIMAGENS') + " (Beta)" + "+>" + $filter('translate')(assetBioma), false);
                    });
                });


                var legends_icons_col2 = {
                    1: "img/legendas/colecao2/formacoesflorestais_1.png",
                    2: "img/legendas/colecao2/formacoesflorestaisnaturais_2.png",
                    3: "img/legendas/colecao2/florestadensa_3.png",
                    4: "img/legendas/colecao2/florestaaberta_4.png",
                    5: "img/legendas/colecao2/florestarasa_5.png",
                    6: "img/legendas/colecao2/mangue_6.png",
                    7: "img/legendas/colecao2/florestaalagada_7.png",
                    8: "img/legendas/colecao2/florestadegradada_8.png",
                    9: "img/legendas/colecao2/florestasecundaria_9.png",
                    10: "img/legendas/colecao2/silvicultura_10.png",
                    11: "img/legendas/colecao2/formacoesnaturaisnaoflorestais_11.png",
                    12: "img/legendas/colecao2/formacoesnaoflorestaisemareasumidas_12.png",
                    13: "img/legendas/colecao2/dunasvegetadas_13.png",
                    14: "img/legendas/colecao2/vegetacaocampestre_14.png",
                    15: "img/legendas/colecao2/agropecuaria_15.png",
                    16: "img/legendas/colecao2/pastagem_16.png",
                    17: "img/legendas/colecao2/pastagemnaodegradada_17.png",
                    18: "img/legendas/colecao2/pastagemdegradada_18.png",
                    19: "img/legendas/colecao2/agricultura_19.png",
                    20: "img/legendas/colecao2/culturasanuais_20.png",
                    21: "img/legendas/colecao2/culturassemiperene_21.png",
                    22: "img/legendas/colecao2/culturasperenes_22.png",
                    23: "img/legendas/colecao2/areasnaovegetadas_23.png",
                    24: "img/legendas/colecao2/formacoesnaturaisnaovegetadas_24.png",
                    25: "img/legendas/colecao2/praiasedunas_25.png",
                    26: "img/legendas/colecao2/afloramentosrochosos_26.png",
                    27: "img/legendas/colecao2/recifesdecorais_27.png",
                    28: "img/legendas/colecao2/outrasareasnaovegetadas_28.png",
                    29: "img/legendas/colecao2/areasurbanas_29.png",
                    30: "img/legendas/colecao2/mineracao_30.png",
                    31: "img/legendas/colecao2/outrasareasnaovegetadas_31.png",
                    32: "img/legendas/colecao2/corposdagua_32.png",
                    33: "img/legendas/colecao2/naoobservado_33.png",
                };



                // Classificação
                angular.forEach(biomas, function(assetBioma, biomaIndex) {


                    angular.forEach(anos, function(assetAno, anoIndex) {

                        if (anoIndex == 0) {
                            wgis.addNodeLabel($filter('translate')(assetBioma), $filter('translate')('COLECAO') + " 2+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " (Beta)");
                        }

                        var geeClassLayer = new L.TileLayer.GeeScript(function(callback) {

                            var assetTileUrl = assetServiceCol2
                                .getClassifByBiomaYear(assetBioma, assetAno);

                            callback(assetTileUrl);
                        });


                        wgis.addLayer(geeClassLayer, String(assetAno), $filter('translate')('COLECAO') + " 2+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " (Beta)+>" + $filter('translate')(assetBioma), false);


                        var DtreeClasses = $injector.get('DtreeClasses').getClasses("2");

                        angular.forEach(DtreeClasses, function(classedtree) {
                            var id = classedtree.id
                            var nameclass = classedtree.classe
                            var icon = legends_icons_col2[id]
                            wgis.addNodeLabel(nameclass, $filter('translate')('COLECAO') + " 2+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " (Beta)+>" + $filter('translate')(assetBioma) + "+>" + assetAno,
                                icon
                            );

                        });

                    });

                });


                /**
                 * COLEÇÂO 2.1
                 */



                var assetServiceCol21 = new MapbiomasAssetService({
                    'assets': {
                        'regioes': 'projects/mapbiomas-workspace/AUXILIAR/regioes2_1',
                        'mosaico': 'projects/mapbiomas-workspace/MOSAICOS/workspace',
                        'classificacao': 'projects/mapbiomas-workspace/COLECAO2_1/classificacao',
                        'classificacaoft': 'projects/mapbiomas-workspace/COLECAO2_1/classificacao-ft',
                    },
                    "palette": "FFFFFF,129912,1F4423,006400,00FF00," +
                        "687537,76A5AF,29EEE4,77A605,935132," +
                        "FF9966,45C2A5,B8AF4F,F1C232,FFFFB2," +
                        "FFD966,F6B26B,A0D0DE,E974ED,D5A6BD," +
                        "C27BA0,FFEFC3,EA9999,DD7E6B,B7B7B7," +
                        "FF99FF,0000FF,D5D5E5"
                });


                wgis.addNodeLabel($filter('translate')('COLECAO') + " 2.1");
                wgis.addNodeLabel($filter('translate')('CLASSIFICACAONAOCONSOLIDADA'), $filter('translate')('COLECAO') + " 2.1");

                var legends_icons_col21 = {
                    1: "img/legendas/colecao2_1/formacoesflorestais_1.png",
                    2: "img/legendas/colecao2_1/formacoesflorestaisnaturais_2.png",
                    3: "img/legendas/colecao2_1/florestadensa_3.png",
                    4: "img/legendas/colecao2_1/florestaaberta_4.png",
                    5: "img/legendas/colecao2_1/mangue_5.png",
                    6: "img/legendas/colecao2_1/florestaalagada_6.png",
                    7: "img/legendas/colecao2_1/florestadegradada_7.png",
                    8: "img/legendas/colecao2_1/florestasecundaria_8.png",
                    9: "img/legendas/colecao2_1/silvicultura_9.png",
                    10: "img/legendas/colecao2_1/formacoesnaturaisnaoflorestais_10.png",
                    11: "img/legendas/colecao2_1/areasumidasnaturaisnaoflorestais_11.png",
                    12: "img/legendas/colecao2_1/vegetacaocampestre_12.png",
                    13: "img/legendas/colecao2_1/outrasformacoesnaoflorestais_13.png",
                    14: "img/legendas/colecao2_1/usoagropecuario_14.png",
                    15: "img/legendas/colecao2_1/pastagem_15.png",
                    16: "img/legendas/colecao2_1/pastagememcamposnaturais_16.png",
                    17: "img/legendas/colecao2_1/outraspastagens_17.png",
                    18: "img/legendas/colecao2_1/agricultura_18.png",
                    19: "img/legendas/colecao2_1/culturasanuais_19.png",
                    20: "img/legendas/colecao2_1/culturassemiperene_20.png",
                    21: "img/legendas/colecao2_1/agriculturaoupastagem_21.png",
                    22: "img/legendas/colecao2_1/areasnaovegetadas_22.png",
                    23: "img/legendas/colecao2_1/praiasedunas_23.png",
                    24: "img/legendas/colecao2_1/areasurbanas_24.png",
                    25: "img/legendas/colecao2_1/outrasareasnaovegetadas_25.png",
                    26: "img/legendas/colecao2_1/corposdagua_26.png",
                    27: "img/legendas/colecao2_1/naoobservado_27.png",
                    28: "img/legendas/colecao2_1/mosaicodecultivos_28.png"
                };



                // Classificação
                angular.forEach(biomas, function(assetBioma, biomaIndex) {


                    angular.forEach(anos, function(assetAno, anoIndex) {

                        if (anoIndex == 0) {
                            wgis.addNodeLabel($filter('translate')(assetBioma), $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA'));
                        }

                        var geeClassLayer = new L.TileLayer.GeeScript(function(callback) {

                            var assetTileUrl = assetServiceCol21
                                .getClassifByBiomaYear(assetBioma, assetAno);

                            callback(assetTileUrl);
                        });


                        wgis.addLayer(geeClassLayer, String(assetAno), $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')(assetBioma), false);


                        var DtreeClasses = $injector.get('DtreeClasses').getClasses("3");

                        angular.forEach(DtreeClasses, function(classedtree) {
                            var id = classedtree.id
                            var nameclass = classedtree.classe
                            var icon = legends_icons_col21[id]
                            wgis.addNodeLabel(nameclass, $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + "+>" + $filter('translate')(assetBioma) + "+>" + assetAno,
                                icon
                            );

                        });

                    });

                });


                //  Classificação FT 2.1

                var assetServiceCol21_ft = new MapbiomasAssetService({
                    'assets': {
                        'regioes': 'projects/mapbiomas-workspace/AUXILIAR/regioes2_1',
                        'mosaico': 'projects/mapbiomas-workspace/MOSAICOS/workspace',
                        'classificacao': 'projects/mapbiomas-workspace/COLECAO2_1/classificacao-ft',
                    },
                    "palette": "FFFFFF,129912,1F4423,006400,00FF00," +
                        "687537,76A5AF,29EEE4,77A605,935132," +
                        "FF9966,45C2A5,B8AF4F,F1C232,FFFFB2," +
                        "FFD966,F6B26B,A0D0DE,E974ED,D5A6BD," +
                        "C27BA0,FFEFC3,EA9999,DD7E6B,B7B7B7," +
                        "FF99FF,0000FF,D5D5E5"
                });


                wgis.addNodeLabel($filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " FT", $filter('translate')('COLECAO') + " 2.1");

                angular.forEach(biomas, function(assetBioma, biomaIndex) {

                    angular.forEach(anos, function(assetAno, anoIndex) {

                        if (anoIndex == 0) {
                            wgis.addNodeLabel($filter('translate')(assetBioma), $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " FT");
                        }

                        var geeClassLayer = new L.TileLayer.GeeScript(function(callback) {

                            var assetTileUrl = assetServiceCol21_ft
                                .getClassifByBiomaYear(assetBioma, assetAno);

                            callback(assetTileUrl);
                        });


                        wgis.addLayer(geeClassLayer, String(assetAno), $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " FT+>" + $filter('translate')(assetBioma), false);


                        var DtreeClasses = $injector.get('DtreeClasses').getClasses("3");

                        angular.forEach(DtreeClasses, function(classedtree) {
                            var id = classedtree.id
                            var nameclass = classedtree.classe
                            var icon = legends_icons_col21[id]
                            wgis.addNodeLabel(nameclass, $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " FT+>" + $filter('translate')(assetBioma) + "+>" + assetAno,
                                icon
                            );

                        });

                    });

                });


                //  Classificação Consolidado 2.1

                var assetServiceCol21_Consolidate = new MapbiomasAssetService({
                    'assets': {
                        'regioes': 'projects/mapbiomas-workspace/AUXILIAR/regioes2_1',
                        'mosaico': 'projects/mapbiomas-workspace/MOSAICOS/workspace',
                        'classificacao': 'projects/mapbiomas-workspace/COLECAO2_1/integracao',
                    },
                    "palette": "FFFFFF,129912,1F4423,006400,00FF00," +
                        "687537,76A5AF,29EEE4,77A605,935132," +
                        "FF9966,45C2A5,B8AF4F,F1C232,FFFFB2," +
                        "FFD966,F6B26B,A0D0DE,E974ED,D5A6BD," +
                        "C27BA0,FFEFC3,EA9999,DD7E6B,B7B7B7," +
                        "FF99FF,0000FF,D5D5E5,CE3D3D"
                });


                wgis.addNodeLabel($filter('translate')('CONSOLIDADOCLASSIFICACAO'), $filter('translate')('COLECAO') + " 2.1");

                angular.forEach(biomas, function(assetBioma, biomaIndex) {

                    angular.forEach(anos, function(assetAno, anoIndex) {

                        if (anoIndex == 0) {
                            wgis.addNodeLabel($filter('translate')(assetBioma), $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('CONSOLIDADOCLASSIFICACAO'));
                        }

                        var geeClassLayer = new L.TileLayer.GeeScript(function(callback) {

                            var assetTileUrl = assetServiceCol21_Consolidate
                                .getConsolidateByBiomaYear(assetBioma, assetAno);

                            callback(assetTileUrl);
                        });


                        wgis.addLayer(geeClassLayer, String(assetAno), $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('CONSOLIDADOCLASSIFICACAO') + "+>" + $filter('translate')(assetBioma), false);


                        var DtreeClassesConsol = angular.copy($injector.get('DtreeClasses').getClasses("3"));

                        DtreeClassesConsol.push({
                            id: 28,
                            cod: "3.2.3.",
                            classe: $filter('translate')('MOSAICODECULTIVOS'),
                            color: "#CE3D3D"
                        })


                        angular.forEach(DtreeClassesConsol, function(classedtree) {
                            var id = classedtree.id
                            var nameclass = classedtree.classe
                            var icon = legends_icons_col21[id]
                            wgis.addNodeLabel(nameclass, $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('CONSOLIDADOCLASSIFICACAO') + "+>" + $filter('translate')(assetBioma) + "+>" + assetAno,
                                icon
                            );

                        });

                    });

                });



                // dados transversais em 2.1


                //  floresta plantada

                wgis.addNodeLabel($filter('translate')('FLORESTAPLANTADA'), $filter('translate')('COLECAO') + " 2.1");


                var transvFloPlantadaYears = {
                    2000: 2001,
                    2001: 2001,
                    2002: 2001,
                    2003: 2001,
                    2004: 2001,
                    2005: 2006,
                    2006: 2006,
                    2007: 2006,
                    2008: 2006,
                    2009: 2006,
                    2010: 2011,
                    2011: 2011,
                    2012: 2011,
                    2013: 2011,
                    2014: 2015,
                    2015: 2015,
                    2016: 2015,
                }

                angular.forEach(anos, function(assetAno, anoIndex) {

                    var geeTransvFloPlantada = new L.TileLayer.GeeScript(function(callback) {


                        var imc = ee.ImageCollection("projects/mapbiomas-workspace/TRANSVERSAIS/FLORESTAPLANTADA");

                        var img = ee.Image(imc.filterMetadata("year", "equals", transvFloPlantadaYears[assetAno]).first());
                        var imgmask = img.mask(img.gt(0));

                        var mapid = imgmask.getMap({
                            "palette": "#05fc46"
                        });

                        assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                            mapid.mapid +
                            '/{z}/{x}/{y}?token=' + mapid.token;

                        callback(assetTileUrl);

                    });

                    wgis.addLayer(geeTransvFloPlantada, String(assetAno), $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('FLORESTAPLANTADA'), false);

                });



                //  agricultura

                wgis.addNodeLabel($filter('translate')('AGRICULTURA'), $filter('translate')('COLECAO') + " 2.1");
                angular.forEach(anos, function(assetAno, anoIndex) {

                    var geeTransvAgricultura = new L.TileLayer.GeeScript(function(callback) {



                        var imc = ee.ImageCollection("projects/mapbiomas-workspace/TRANSVERSAIS/AGRICULTURA");
                        var img = ee.Image(imc.filterMetadata("year", "equals", assetAno).first());
                        var imgmask = img.mask(img.gt(0));

                        var mapid = imgmask.getMap({
                            "palette": "#e008b8"
                        });

                        assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                            mapid.mapid +
                            '/{z}/{x}/{y}?token=' + mapid.token;

                        callback(assetTileUrl);

                    });

                    wgis.addLayer(geeTransvAgricultura, String(assetAno), $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('AGRICULTURA'), false);

                });


                //  pecuaria
                wgis.addNodeLabel($filter('translate')('PASTAGEM'), $filter('translate')('COLECAO') + " 2.1");
                angular.forEach(anos, function(assetAno, anoIndex) {

                    var geeTransvPecuaria = new L.TileLayer.GeeScript(function(callback) {

                        var imc = ee.ImageCollection("projects/mapbiomas-workspace/TRANSVERSAIS/PECUARIA");
                        var img = ee.Image(imc.filterMetadata("year", "equals", assetAno).first());
                        var imgmask = img.mask(img.gt(0));

                        var mapid = imgmask.getMap({
                            "palette": "#e88000"
                        });

                        assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                            mapid.mapid +
                            '/{z}/{x}/{y}?token=' + mapid.token;
                        callback(assetTileUrl);

                    });

                    wgis.addLayer(geeTransvPecuaria, String(assetAno), $filter('translate')('COLECAO') + " 2.1+>" + $filter('translate')('PASTAGEM'), false);

                });


                /*
                 * Base Layer
                 */

                wgis.addNodeLabel("Raster layers");

                wgis.addLayerTile({
                    url: "https://tile-{s}.urthecast.com/v1/rgb/{z}/{x}/{y}?api_key={api_key}&api_secret={api_secret}&sensor_platform={sensor_platform}&cloud_coverage_lte={cloud_coverage_lte}&acquired_gte={acquired_gte}&acquired_lte={acquired_lte}",
                    params: {
                        api_key: "FA3EBE5D298B4C458162",
                        api_secret: "D6CC54389EF4420EAEFC5D374EE9744D",
                        sensor_platform: "theia",
                        cloud_coverage_lte: "50",
                        acquired_gte: "2015-01-01T03:00:00.000Z",
                        acquired_lte: "2016-01-01T02:59:59.999Z"
                    }
                }, "Urthecast - sensor Theia", "Raster layers", false);

                /*
                 * Mapas de Referencia
                 */
                wgis.addNodeLabel($filter('translate')('MAPAREFERENCIA'));


                //CAMADAS VETORIAIS

                wgis.addNodeLabel("Vectors", $filter('translate')('MAPAREFERENCIA'));
                //biomas 1:5000000
                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/territories/bioma.map",
                            color_id: 2,
                            layers: 'bioma',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "Biomes 1:5.000.000", $filter('translate')('MAPAREFERENCIA') + "+>Vectors", false);


                //biomas 1:1000000
                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/regioes_1_1000000.map",
                            color_id: 2,
                            layers: 'regioes_1_1000000',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "Biomes 1:1.000.000", $filter('translate')('MAPAREFERENCIA') + "+>Vectors", false);

                //areas protegidas
                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/areas_protegidas.map",
                            color_id: 2,
                            layers: 'areasprotegidas',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    $filter('translate')('AREASPROTEGIDAS'), $filter('translate')('MAPAREFERENCIA') + "+>Vectors", false);



                
                /**
                 * GLOBAL SURFACE WATER
                 */

                var geeSurfaceWaterLayer = new L.TileLayer.GeeScript(function(callback) {

                    // var boundary = ee.FeatureCollection('ft:1-yEW8F5gVnjWwcKJ_-iWIFZoPaW0YXmxf4gScDVw');

                    var gsw = ee.Image('JRC/GSW1_0/GlobalSurfaceWater');
                    var occurrence = gsw.select('occurrence');

                    var vis = {
                        min:0,
                        max:100,
                        palette: ['red', 'blue']
                        };
                    
                    // occurrence = occurrence.updateMask(occurrence.divide(100)).clip(boundary)

                    var mapid = occurrence.getMap(vis);

                    assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                        mapid.mapid +
                        '/{z}/{x}/{y}?token=' + mapid.token;    

                callback(assetTileUrl);

                });

                wgis.addLayer(geeSurfaceWaterLayer, "Global Surface Water", $filter('translate')("MAPAREFERENCIA"), false);



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

                angular.forEach(prodesClasses, function(subclass, subclassName) {
                    angular.forEach(subclass.anos, function(ano, anoKey) {
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

                angular.forEach(terraclasseClasses, function(subclass, subclassName) {
                    angular.forEach(subclass.anos, function(ano, anoKey) {
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

                //CERRADO
                wgis.addNodeLabel($filter('translate')('CERRADO'), $filter('translate')('MAPAREFERENCIA'));

                var cerradoClasses = {};

                cerradoClasses[$filter('translate')('FLORESTADENSA')] = {
                    "icon": "img/legendas/tccerrado_floresta_densa.png",
                    "collection": "FLORESTADENSA",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('FLORESTAABERTA')] = {
                    "icon": "img/legendas/tccerrado_floresta_aberta.png",
                    "collection": "FLORESTAABERTA",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('CORPOSDAGUA')] = {
                    "icon": "img/legendas/tccerrado_corposdagua.png",
                    "collection": "CORPOSDAGUA",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('FORMACOESNATURAISNAOFLORESTAIS')] = {
                    "icon": "img/legendas/tccerrado_natural_naoflorestal.png",
                    "collection": "FORMACOESNATURAISNAOFLORESTAIS",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('AREASNAOVEGETADASNATURAIS')] = {
                    "icon": "img/legendas/tccerrado_natural_naovegetado.png",
                    "collection": "AREASNAOVEGETADASNATURAIS",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('SILVICULTURA')] = {
                    "icon": "img/legendas/tccerrado_silvicultura.png",
                    "collection": "SILVICULTURA",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('AGRICULTURA')] = {
                    "icon": "img/legendas/tccerrado_agricultura.png",
                    "collection": "AGRICULTURA",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('PASTAGEM')] = {
                    "icon": "img/legendas/tccerrado_pastagem.png",
                    "collection": "PASTAGEM",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('MOSAICOOCUPACOES')] = {
                    "icon": "img/legendas/tccerrado_mosaico_ocupacoes.png",
                    "collection": "MOSAICOOCUPACOES",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('AREASNAOVEGETADAS')] = {
                    "icon": "img/legendas/tccerrado_area_naovegetada.png",
                    "collection": "AREASNAOVEGETADAS",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('AREAURBANA')] = {
                    "icon": "img/legendas/tccerrado_area_urbana.png",
                    "collection": "AREAURBANA",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('OUTROS')] = {
                    "icon": "img/legendas/tccerrado_outros.png",
                    "collection": "OUTROS",
                    "anos": ["2013"]
                };

                cerradoClasses[$filter('translate')('NAOOBSERVADO')] = {
                    "icon": "img/legendas/tccerrado_naoobservado.png",
                    "collection": "NAOOBSERVADO",
                    "anos": ["2013"]
                };

                angular.forEach(cerradoClasses, function(subclass, subclassName) {
                    angular.forEach(subclass.anos, function(ano, anoKey) {
                        wgis.addLayerWMS({
                                url: mapfilehost,
                                params: {
                                    map: mapfilepath + "/imgsref/cerrado.map",
                                    layers: 'cerrado',
                                    year: ano,
                                    florestadensa: subclassName === $filter('translate')('FLORESTADENSA'),
                                    florestaaberta: subclassName === $filter('translate')('FLORESTAABERTA'),
                                    corposdagua: subclassName === $filter('translate')('CORPOSDAGUA'),
                                    naturalnaoflorestal: subclassName === $filter('translate')('FORMACOESNATURAISNAOFLORESTAIS'),
                                    naturalnaovegetado: subclassName === $filter('translate')('AREASNAOVEGETADASNATURAIS'),
                                    silvicultura: subclassName === $filter('translate')('SILVICULTURA'),
                                    agricultura: subclassName === $filter('translate')('AGRICULTURA'),
                                    pastagem: subclassName === $filter('translate')('PASTAGEM'),
                                    mosaicoocupacoes: subclassName === $filter('translate')('MOSAICOOCUPACOES'),
                                    areanaovegetada: subclassName === $filter('translate')('AREASNAOVEGETADAS'),
                                    areaurbana: subclassName === $filter('translate')('AREAURBANA'),
                                    outros: subclassName === $filter('translate')('OUTROS'),
                                    naoobservado: subclassName === $filter('translate')('NAOOBSERVADO'),
                                    format: 'image/png',
                                    transparent: true
                                }
                            },
                            subclassName, $filter('translate')('MAPAREFERENCIA') + "+>" + $filter('translate')('CERRADO') + "+>TerraClass+>" + ano, false, subclass.icon);

                    });
                });



                //PAMPA
                wgis.addNodeLabel($filter('translate')('PAMPA'), $filter('translate')('MAPAREFERENCIA'));

                var pampaClasses = {};

                pampaClasses[$filter('translate')('FLORESTA')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_floresta.png",
                    "collection": "FLORESTA",
                    "anos": ["2002", "2009"],
                    "class_id": 1
                };

                pampaClasses[$filter('translate')('FORMACOESFLORESTAISNATURAIS')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_formacoesflorestaisnaturais.png",
                    "collection": "FORMACOESFLORESTAISNATURAIS",
                    "anos": ["2002", "2009"],
                    "class_id": 2
                };

                pampaClasses[$filter('translate')('FLORESTADENSA')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_florestadensa.png",
                    "collection": "FLORESTADENSA",
                    "anos": ["2002", "2009"],
                    "class_id": 3
                };

                pampaClasses[$filter('translate')('FLORESTAABERTA')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_florestaaberta.png",
                    "collection": "FLORESTAABERTA",
                    "anos": ["2002", "2009"],
                    "class_id": 4
                };

                pampaClasses[$filter('translate')('MANGUE')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_mangue.png",
                    "collection": "MANGUE",
                    "anos": ["2002", "2009"],
                    "class_id": 5
                };

                pampaClasses[$filter('translate')('FLORESTAALAGADA')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_florestaalagada.png",
                    "collection": "FLORESTAALAGADA",
                    "anos": ["2002", "2009"],
                    "class_id": 6
                };

                pampaClasses[$filter('translate')('FLORESTADEGRADADA')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_florestadegradada.png",
                    "collection": "FLORESTADEGRADADA",
                    "anos": ["2002", "2009"],
                    "class_id": 7
                };

                pampaClasses[$filter('translate')('FLORESTASECUNDARIA')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_florestasecundaria.png",
                    "collection": "FLORESTASECUNDARIA",
                    "anos": ["2002", "2009"],
                    "class_id": 8
                };

                pampaClasses[$filter('translate')('SILVICULTURA')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_silvicutura.png",
                    "collection": "SILVICULTURA",
                    "anos": ["2002", "2009"],
                    "class_id": 9
                };

                pampaClasses[$filter('translate')('FORMACOESNATURAISNAOFLORESTAIS')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_formacoesnaturaisnaoflorestais.png",
                    "collection": "FORMACOESNATURAISNAOFLORESTAIS",
                    "anos": ["2002", "2009"],
                    "class_id": 10
                };

                pampaClasses[$filter('translate')('AREASUMIDASNATURAISNAOFLORESTAIS')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_areasumidasnaturaisnaoflorestais.png",
                    "collection": "AREASUMIDASNATURAISNAOFLORESTAIS",
                    "anos": ["2002", "2009"],
                    "class_id": 11
                };

                pampaClasses[$filter('translate')('VEGETACAOCAMPESTRE')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_vegetacaocampestre.png",
                    "collection": "VEGETACAOCAMPESTRE",
                    "anos": ["2002", "2009"],
                    "class_id": 12
                };

                pampaClasses[$filter('translate')('OUTRASFORMACOESNAOFLORESTAIS')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_outrasformacoesnaoflorestais.png",
                    "collection": "OUTRASFORMACOESNAOFLORESTAIS",
                    "anos": ["2002", "2009"],
                    "class_id": 13
                };

                pampaClasses[$filter('translate')('USOAGROPECUARIO')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_usoagropecuario.png",
                    "collection": "USOAGROPECUARIO",
                    "anos": ["2002", "2009"],
                    "class_id": 14
                };

                pampaClasses[$filter('translate')('PASTAGEM')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_pastagem.png",
                    "collection": "PASTAGEM",
                    "anos": ["2002", "2009"],
                    "class_id": 15
                };

                pampaClasses[$filter('translate')('PASTAGEMEMCAMPOSNATURAIS')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_pastagememcamposnaturais.png",
                    "collection": "PASTAGEMEMCAMPOSNATURAIS",
                    "anos": ["2002", "2009"],
                    "class_id": 16
                };

                pampaClasses[$filter('translate')('OUTRASPASTAGENS')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_outraspastagens.png",
                    "collection": "OUTRASPASTAGENS",
                    "anos": ["2002", "2009"],
                    "class_id": 17
                };

                pampaClasses[$filter('translate')('AGRICULTURA')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_agricultura.png",
                    "collection": "AGRICULTURA",
                    "anos": ["2002", "2009"],
                    "class_id": 18
                };

                pampaClasses[$filter('translate')('CULTURASANUAIS')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_culturasanuais.png",
                    "collection": "CULTURASANUAIS",
                    "anos": ["2002", "2009"],
                    "class_id": 19
                };

                pampaClasses[$filter('translate')('CULTURASSEMIPERENE')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_culturassemiperenes.png",
                    "collection": "CULTURASSEMIPERENE",
                    "anos": ["2002", "2009"],
                    "class_id": 20
                };

                pampaClasses[$filter('translate')('AGRICULTURAOUPASTAGEM')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_agriculturaoupastagem.png",
                    "collection": "AGRICULTURAOUPASTAGEM",
                    "anos": ["2002", "2009"],
                    "class_id": 21
                };

                pampaClasses[$filter('translate')('AREASNAOVEGETADAS')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_areasnaovegetadas.png",
                    "collection": "AREASNAOVEGETADAS",
                    "anos": ["2002", "2009"],
                    "class_id": 22
                };

                pampaClasses[$filter('translate')('PRAIASEDUNAS')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_praiasedunas.png",
                    "collection": "PRAIASEDUNAS",
                    "anos": ["2002", "2009"],
                    "class_id": 23
                };

                pampaClasses[$filter('translate')('AREASURBANAS')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_infraestruturasurbana.png",
                    "collection": "AREASURBANAS",
                    "anos": ["2002", "2009"],
                    "class_id": 24
                };

                pampaClasses[$filter('translate')('OUTRASAREASNAOVEGETADAS')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_outrasareasnaovegetadas.png",
                    "collection": "OUTRASAREASNAOVEGETADAS",
                    "anos": ["2002", "2009"],
                    "class_id": 25
                };

                pampaClasses[$filter('translate')('CORPOSDAGUA')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_corposdagua.png",
                    "collection": "CORPOSDAGUA",
                    "anos": ["2002", "2009"],
                    "class_id": 26
                };


                pampaClasses[$filter('translate')('NAOOBSERVADO')] = {
                    "icon": "img/legendas/mapbiomas/mapbiomas_naoobservado.png",
                    "collection": "NAOOBSERVADO",
                    "anos": ["2002", "2009"],
                    "class_id": 27
                };


                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/pampa.map",
                            classes_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
                            layers: 'pampa',
                            year: "2002",
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2002", $filter('translate')('MAPAREFERENCIA') + "+>" + $filter('translate')('PAMPA'), false);


                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/imgsref/pampa.map",
                            classes_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
                            layers: 'pampa',
                            year: "2009",
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "2009", $filter('translate')('MAPAREFERENCIA') + "+>" + $filter('translate')('PAMPA'), false);



                angular.forEach(pampaClasses, function(subclass, subclassName) {
                    angular.forEach(subclass.anos, function(ano, anoKey) {

                        wgis.addNodeLabel(subclassName, $filter('translate')('MAPAREFERENCIA') + "+>" + $filter('translate')('PAMPA') + "+>" + ano,
                            subclass.icon

                        );

                    })
                });


                var mapreferenceClass = {};

                mapreferenceClass[$filter('translate')('CAATINGA')] = {
                    "collection": "CAATINGA",
                    "layer": "caatinga",
                    "anos": ["2008"]
                };


                mapreferenceClass[$filter('translate')('MATAATLANTICA')] = {
                    "collection": "MATAATLANTICA",
                    "layer": "mataatlantica",
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

                angular.forEach(mapreferenceClass, function(subclass, subclassName) {
                    angular.forEach(subclass.anos, function(ano, anoKey) {
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
            cartasInfo: function(wgis) {
                L.geoJson(cartas, {
                    style: function(feature) {
                        return {
                            color: feature.properties.color
                        };
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup(feature.properties.description);
                    }
                }).addTo(wgis._wgis.lmap);
            }
        };
    }
]);