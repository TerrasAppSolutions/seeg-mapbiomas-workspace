angular.module('MapBiomas.workmap').factory('WorkspaceLayers', ['AppConfig', '$filter', 'GEEProcessDataService',
    function (AppConfig, $filter, GEEProcessDataService) {
        return {
            imgsref: function (wgis) {

                var mapfilepath = AppConfig.MAPSERVER.mapfilepath;
                var mapfilehost = AppConfig.MAPSERVER.mapfilehost;

                var biomas = ['BOLIVIA', 'COLOMBIA', 'ECUADOR', 'GUYANA', 'GUYANAFRANCESA', 'PERU', 'SURINAM', 'VENEZUELA'];

                var anos = [];

                // valores iniciais dos anos
                for (var i = 2000; i <= 2017; i++) {
                    anos.push(i);
                }

                /**
                 * COLEÇÂO 1
                 */
                var assetService = new MapbiomasAssetService({
                    'assets': {
                        'regioes': 'projects/mapbiomas-workspace/AUXILIAR/regioes',
                        'mosaico': 'projects/mapbiomas-raisg/MOSAICOS/workspace-c1',
                        'classificacao': 'projects/mapbiomas-raisg/COLECCION1/clasificacion',
                        'classificacaoft': 'projects/mapbiomas-workspace/COLECAO2/classificacao-ft',
                    },
                    "palette": "#129912,#1f4423,#006400,#00ff00,#65c24b,#687537," +
                        "#76a5af,#29eee4,#77a605,#935132,#ffe599,#45c2a5,#f1c232,#b8af4f,#ffffb2," +
                        "#ffd966,#ffe599,#f6b26b,#e974ed,#d5a6bd,#c27ba0,#a64d79,#ea9999,#cc4125," +
                        "#dd7e6b,#e6b8af,#980000,#999999,#b7b7b7,#434343,#d9d9d9,#0000ff,#d5d5e5"
                });

                wgis.addNodeLabel($filter('translate')('COLECAO') + " 1");
                wgis.addNodeLabel($filter('translate')('MOSAICOIMAGENS') + " (Beta)", $filter('translate')('COLECAO') + " 1");
                wgis.addNodeLabel($filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " (Beta)", $filter('translate')('COLECAO') + " 1");

                // Mosaico
                angular.forEach(biomas, function (assetBioma, biomaIndex) {
                    anos.forEach(function (assetAno, anoIndex) {
                        if (anoIndex == 0) {
                            wgis.addNodeLabel($filter('translate')(assetBioma), $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('MOSAICOIMAGENS') + " (Beta)", 'img/layergroup.png');
                        }
                        var geeMosaicLayer = new L.TileLayer.GeeScript(function (callback) {

                            var assetTileUrl = assetService
                                .getMosaicByBiomaYear(assetBioma, assetAno);

                            callback(assetTileUrl);
                        });

                        wgis.addLayer(geeMosaicLayer, assetAno, $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('MOSAICOIMAGENS') + " (Beta)" + "+>" + $filter('translate')(assetBioma), false);
                    });
                });

                // Classificação
                angular.forEach(biomas, function (assetBioma, biomaIndex) {
                    anos.forEach(function (assetAno, anoIndex) {
                        if (anoIndex == 0) {
                            wgis.addNodeLabel($filter('translate')(assetBioma), $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " (Beta)");
                        }
                        var geeClassLayer = new L.TileLayer.GeeScript(function (callback) {

                            var assetTileUrl = assetService
                                .getClassifByBiomaYear(assetBioma, assetAno);

                            callback(assetTileUrl);
                        });

                        wgis.addLayer(geeClassLayer, assetAno, $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " (Beta)+>" + $filter('translate')(assetBioma), false);
                    });
                });

                /**
                 * REFERENCIAS
                 */

                wgis.addNodeLabel($filter('translate')("MAPAREFERENCIA"));

                /**
                 * Adição de nó para as funções de vetores
                 * dessa forma, dentro de "collection 1", ele coloca a pasta amarela "Vectors"
                 */
                wgis.addNodeLabel('Vectors', $filter('translate')("MAPAREFERENCIA"));

                /**
                 * Divisão de Departamento adotada RAISG
                 */
                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/raisg.map",
                            color_id: 2,
                            layers: 'divisaodepartamentoadotada',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "Divisao de Departamento", $filter('translate')("MAPAREFERENCIA") + '+>' + 'Vectors', false);

                /**
                 * Divisão de Muncípio adotada RAISG
                 */
                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/raisg.map",
                            layers: 'divisaomunicipioadotada',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "Divisao de Município", $filter('translate')("MAPAREFERENCIA") + '+>' + 'Vectors', false);

                /**
                 * Divisão de País adotada RAISG
                 */
                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/raisg.map",
                            layers: 'divisaopaisadotada',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "Divisao de País", $filter('translate')("MAPAREFERENCIA") + '+>' + 'Vectors', false);

                /**
                 * Limite Biogeografico RAISG
                 */
                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/raisg.map",
                            layers: 'limitebiogeografico',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "Limite Biogeografico", $filter('translate')("MAPAREFERENCIA") + '+>' + 'Vectors', false);

                /**
                 * Limite de Biomas RAISG
                 */
                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/raisg/raisg.map",
                            layers: 'limitebiomas',
                            format: 'image/png',
                            transparent: true,
                        }
                    },
                    "Limite de Biomas", $filter('translate')("MAPAREFERENCIA") + '+>' + 'Vectors', false);

                /**
                 * Legenda de Limite de Biomas RAISG
                 * Mostra o conjunto de legendas operativas
                 */

                var legBiomaSet = [{
                        name: "Amazonía",
                        url: "img/legendas/raisg/legbioma/amazonia.png",
                        description: 'Amazonía',
                        color: "#43a272"
                    },
                    {
                        name: "Andes",
                        url: "img/legendas/raisg/legbioma/andes.png",
                        description: 'Andes',
                        color: "#72014d"
                    },
                    {
                        name: "Cerrado",
                        url: "img/legendas/raisg/legbioma/cerrado.png",
                        description: 'Cerrado',
                        color: "#ffeaad"
                    },
                    {
                        name: "Cerrado-Sabana",
                        url: "img/legendas/raisg/legbioma/cerrado-sabana.png",
                        description: 'Cerrado-Sabana',
                        color: "#e57400"
                    },
                    {
                        name: "Chaco-Chiquitano",
                        url: "img/legendas/raisg/legbioma/chaco-chiquitano.png",
                        description: 'Chaco-Chiquitano',
                        color: "#004ea7"
                    },
                    {
                        name: "Pantanal",
                        url: "img/legendas/raisg/legbioma/pantanal.png",
                        description: 'Pantanal',
                        color: "#5c0000"
                    },
                    {
                        name: "Tucumano-Boliviano",
                        url: "img/legendas/raisg/legbioma/tucumano-boliviano.png",
                        description: 'Tucumano-Boliviano',
                        color: "#99ff72"
                    },
                    {
                        name: "Sin Dato",
                        url: "img/legendas/raisg/legbioma/no-data.png",
                        description: 'null',
                        color: "#9b9b9b"
                    },
                ];

                for (var i = 0; i < legBiomaSet.length; i++) {
                    var element = legBiomaSet[i];
                    wgis.addNodeLabel(element.name, $filter('translate')("MAPAREFERENCIA") + '+>' + 'Vectors' + "+>Limite de Biomas", element.url);
                }

                /**
                 * Limite RAISG
                 */
                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/raisg/raisg.map",
                            layers: 'limite',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "Limite RAISG", $filter('translate')("MAPAREFERENCIA") + '+>' + 'Vectors', false);


                /**
                 * Região Bioma País
                 */
                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/raisg/raisg.map",
                            layers: 'paisbiomaregion',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "Regiones RAISG", $filter('translate')("MAPAREFERENCIA") + '+>' + 'Vectors', false);


                /**
                 * Legenda de Região Bioma País
                 */

                var legBiomaRegion = [{
                        name: "Sín region",
                        url: "img/legendas/raisg/legbiomaregion/0_sin_region.png",
                        color: "#43a272"
                    },
                    {
                        name: "Amazonía Alta",
                        url: "img/legendas/raisg/legbiomaregion/1_amazonia_alta.png",
                        color: "#95e5a3"
                    },
                    {
                        name: "Amazonía Baja",
                        url: "img/legendas/raisg/legbiomaregion/2_amazonia_baja.png",
                        color: "#ffeaad"
                    },
                    {
                        name: "Amazonía Baja Inundable",
                        url: "img/legendas/raisg/legbiomaregion/3_amazonia_baja_inundable.png",
                        color: "#e57400"
                    },
                    {
                        name: "Amazonía Baja Pacales",
                        url: "img/legendas/raisg/legbiomaregion/4_amazonia_baja_pacales.png",
                        color: "#004ea7"
                    },
                    {
                        name: "Amazonía Baja Tepuyes",
                        url: "img/legendas/raisg/legbiomaregion/5_amazonia_baja_tepuyes.png",
                        color: "#5c0000"
                    },
                    {
                        name: "Andes",
                        url: "img/legendas/raisg/legbiomaregion/6_andes.png",
                        color: "#99ff72"
                    },
                    {
                        name: "Andes Bosque Seco Interandino",
                        url: "img/legendas/raisg/legbiomaregion/7_andes_bosque_seco_interandino.png",
                        color: "#9b9b9b"
                    },
                    {
                        name: "Cerrado",
                        url: "img/legendas/raisg/legbiomaregion/8_cerrado.png",
                        color: "#9b9b9b"
                    },
                    {
                        name: "Cerrado-Sabana",
                        url: "img/legendas/raisg/legbiomaregion/9_cerrado_sabana.png",
                        color: "#9b9b9b"
                    },
                    {
                        name: "Chaco-Chiquitano",
                        url: "img/legendas/raisg/legbiomaregion/10_chaco_chiquitano.png",
                        color: "#9b9b9b"
                    },
                    {
                        name: "Pantanal",
                        url: "img/legendas/raisg/legbiomaregion/11_pantanal.png",
                        color: "#9b9b9b"
                    },
                    {
                        name: "Tucumano-Boliviano",
                        url: "img/legendas/raisg/legbiomaregion/12_tucumano_boliviano.png",
                        color: "#9b9b9b"
                    },
                    {
                        name: "Sabanas y Herbazales Tepuyes",
                        url: "img/legendas/raisg/legbiomaregion/13_sabanas_y_herbazales_tepuyes.png",
                        color: "#9b9b9b"
                    },
                    {
                        name: "Sabanas y herbazales",
                        url: "img/legendas/raisg/legbiomaregion/14_sabanas_y_herbazales.png",
                        color: "#9b9b9b"
                    }
                ];

                for (var i = 0; i < legBiomaRegion.length; i++) {
                    var element = legBiomaRegion[i];
                    wgis.addNodeLabel(element.name, $filter('translate')("MAPAREFERENCIA") + '+>' + 'Vectors' + "+>Regiones RAISG", element.url);
                }


                wgis.addLayerWMS({
                        url: mapfilehost,
                        params: {
                            map: mapfilepath + "/raisg/raisg.map",
                            layers: 'paisbiomaregionlimite',
                            format: 'image/png',
                            transparent: true
                        }
                    },
                    "Limite Regiones RAISG ", $filter('translate')("MAPAREFERENCIA") + '+>' + 'Vectors', false);


                /**
                 * ALTITUDE
                 */

                wgis.addLayer(GEEProcessDataService.geeAltitudeLayer, "Elevation", $filter('translate')("MAPAREFERENCIA"), false);

                // wgis._wgis

                /**
                 * GLOBAL SURFACE WATER
                 */

                var geeSurfaceWaterLayer = new L.TileLayer.GeeScript(function (callback) {

                    var boundary = ee.FeatureCollection('ft:1-yEW8F5gVnjWwcKJ_-iWIFZoPaW0YXmxf4gScDVw');

                    var gsw = ee.Image('JRC/GSW1_0/GlobalSurfaceWater');
                    var occurrence = gsw.select('occurrence');

                    var vis = {
                        min: 0,
                        max: 100,
                        palette: ['red', 'blue']
                    };

                    occurrence = occurrence.updateMask(occurrence.divide(100)).clip(boundary)

                    var mapid = occurrence.getMap(vis);

                    assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                        mapid.mapid +
                        '/{z}/{x}/{y}?token=' + mapid.token;

                    callback(assetTileUrl);

                });

                wgis.addLayer(geeSurfaceWaterLayer, "Global Surface Water", $filter('translate')("MAPAREFERENCIA"), false);

                /**
                 * HANSEN
                 */
                var geeHansenLayer = new L.TileLayer.GeeScript(function (callback) {

                    var boundary = ee.FeatureCollection('ft:1-yEW8F5gVnjWwcKJ_-iWIFZoPaW0YXmxf4gScDVw');

                    var tree_cover = ee.Image('UMD/hansen/global_forest_change_2015').select("treecover2000").clip(boundary);

                    tree_cover = tree_cover.mask(tree_cover.gte(40))

                    var mapid = tree_cover.getMap({
                        "palette": "00ff00, #008000",
                        "min": 40,
                        "max": 80,
                        "format": "png"
                    });

                    assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                        mapid.mapid +
                        '/{z}/{x}/{y}?token=' + mapid.token;

                    callback(assetTileUrl);

                });

                wgis.addLayer(geeHansenLayer, "Hansen - Forest Cover 2000", $filter('translate')("MAPAREFERENCIA"), false);

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