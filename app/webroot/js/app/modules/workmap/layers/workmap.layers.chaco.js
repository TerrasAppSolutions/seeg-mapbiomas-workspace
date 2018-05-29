angular.module('MapBiomas.workmap').factory('WorkspaceLayers', ['AppConfig', '$filter',
    function(AppConfig, $filter) {
        return {
            imgsref: function(wgis) {

                var mapfilepath = AppConfig.MAPSERVER.mapfilepath;
                var mapfilehost = AppConfig.MAPSERVER.mapfilehost;



                var biomas = ['CHACO'];

                var anos = [];

                // valores iniciais dos anos
                for (var i = 2000; i <= 2016; i++) {
                    anos.push(i);
                }





                /**
                 * COLEÇÂO 1
                 */
                wgis.addNodeLabel($filter('translate')('COLECAO') + " 1");
                wgis.addNodeLabel($filter('translate')('MOSAICOIMAGENS') + " (Beta)", $filter('translate')('COLECAO') + " 1");
                wgis.addNodeLabel($filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " (Beta)", $filter('translate')('COLECAO') + " 1");

                // Mosaico
                angular.forEach(biomas, function(assetBioma, biomaIndex) {
                    anos.forEach(function(assetAno, anoIndex) {
                        if (anoIndex == 0) {
                            wgis.addNodeLabel($filter('translate')(assetBioma), $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('MOSAICOIMAGENS') + " (Beta)",'img/layergroup.png');
                        }
                        var geeMosaicLayer = new L.TileLayer.GeeScript(function(callback) {

                            var assetTileUrl = assetService
                                .getMosaicByBiomaYear(assetBioma, assetAno);

                            callback(assetTileUrl);
                        });

                        wgis.addLayer(geeMosaicLayer, assetAno, $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('MOSAICOIMAGENS') + " (Beta)" + "+>" + $filter('translate')(assetBioma), false);
                    });
                });


                // Classificação
                angular.forEach(biomas, function(assetBioma, biomaIndex) {
                    anos.forEach(function(assetAno, anoIndex) {
                        if (anoIndex == 0) {
                            wgis.addNodeLabel($filter('translate')(assetBioma), $filter('translate')('COLECAO') + " 1+>" + $filter('translate')('CLASSIFICACAONAOCONSOLIDADA') + " (Beta)");
                        }
                        var geeClassLayer = new L.TileLayer.GeeScript(function(callback) {

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
                 * GLOBAL SURFACE WATER
                 */

                var geeSurfaceWaterLayer = new L.TileLayer.GeeScript(function(callback) {

                    var chaco_boundary = ee.FeatureCollection('ft:1qh0GRuvKZD-_gZx5InG74ZRMri9R0dZLFNl_jyXp');
                    var imc = ee.Image("JRC/GSW1_0/GlobalSurfaceWater").select(0);
                    var clipped = imc.clip(chaco_boundary).where(imc.gt(50),1);

                    var mapid = clipped.getMap({
                        "palette":"#1a66ff",
                        "format": "png"
                    });

                    assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                        mapid.mapid +
                        '/{z}/{x}/{y}?token=' + mapid.token;    

                callback(assetTileUrl);

                });

                wgis.addLayer(geeSurfaceWaterLayer, "Global Surface Water", $filter('translate')("MAPAREFERENCIA"), false);


                /**
                 * HANSEN
                 */
                var geeHansenLayer = new L.TileLayer.GeeScript(function(callback) {

                    var chaco_boundary = ee.FeatureCollection('ft:1qh0GRuvKZD-_gZx5InG74ZRMri9R0dZLFNl_jyXp');

                    var tree_cover = ee.Image('UMD/hansen/global_forest_change_2015').select("treecover2000").clip(chaco_boundary);
                    
                    tree_cover = tree_cover.mask(tree_cover.gte(40))

                    var mapid = tree_cover.getMap({
                        "palette":"00ff00, #008000",
                        "min":40,
                        "max":80,
                        "format": "png"
                    });

                    assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                        mapid.mapid +
                        '/{z}/{x}/{y}?token=' + mapid.token;  

                    callback(assetTileUrl);

                });

                wgis.addLayer(geeHansenLayer, "Hansen - Forest Cover 2000", $filter('translate')("MAPAREFERENCIA"), false);
                
        
                // ee.Initialize()

                // var img_loss = ee.Image('UMD/hansen/global_forest_change_2015').select("lossyear").clip(chaco_boundary);


                // for (var i = 1; i <= 15; i++) {
                //     var geeHansenLayer = new L.TileLayer.GeeScript(function(callback) {


                //         var year = String(1999 + i);
                //         var loss_year = img_loss.mask(img_loss.eq(1));
                //         Map.addLayer(loss_year, {"palette":"#ff0000"}, year);


                //         var mapid = tree_cover.getMap({
                //             "palette":"00ff00, #008000",
                //             "min":40,
                //             "max":80,
                //             "format": "png"
                //         });



                //     });

                // };


                

                
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