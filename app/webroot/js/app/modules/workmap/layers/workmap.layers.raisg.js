angular.module('MapBiomas.workmap').factory('WorkspaceLayers', ['AppConfig', '$filter',
    function(AppConfig, $filter) {
        return {
            imgsref: function(wgis) {

                var mapfilepath = AppConfig.MAPSERVER.mapfilepath;
                var mapfilehost = AppConfig.MAPSERVER.mapfilehost;



                var biomas = ['AMAZONIA'];

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
                 * ALTITUDE
                 */

                var geeAltitudeLayer = new L.TileLayer.GeeScript(function(callback) {

                    var boundary = ee.FeatureCollection('ft:1-yEW8F5gVnjWwcKJ_-iWIFZoPaW0YXmxf4gScDVw');



                    var terrain = ee.call('Terrain', ee.Image('USGS/SRTMGL1_003').clip(boundary));

                    var radians = function(img){
                        var rad = img.toFloat()
                                .multiply(3.1415927)
                                .divide(180);
                        return rad;
                    };

                    var HillShade = function(terrain, sunAzimuth, sunElevation){
                        
                        // sunElevation = 20 should be fixed to make Sun low in the horizon.
                        var zenithElevation    = ee.Number(90.0).subtract(sunElevation); 
                        var azimuth            = radians(ee.Image.constant(sunAzimuth));
                        var zenithElevationRad = radians(ee.Image.constant(zenithElevation));
                        
                        // Terrain
                        var slope     = radians(terrain.select(['slope'])); 
                        var aspect    = radians(terrain.select(['aspect']));
                        
                        // Hillshade
                        var hillShade = azimuth.subtract(aspect).cos()
                                            .multiply(slope.sin())
                                            .multiply(zenithElevationRad.sin())
                                            .add(zenithElevationRad.cos().multiply(slope.cos()));
                        
                        return hillShade.max(0);
                        };

                        var elevation = terrain.select('elevation');

                        var hillShade = HillShade(terrain, 90.0, 45.0);

                        var visElevation = {
                        'gain':0.005,
                        'palette':'0000FF,00FFFF,00FF00,FFFF00,FF5555,FF0000',
                        'opacity':0.75
                        };

                        var visHillShade = {
                        'gain':200.0
                        };

                        var elevationRGB = terrain.select(['elevation']).visualize(visElevation);
                        var hillShadeRGB = hillShade.visualize(visHillShade);

                        var alpha = 0.7;
                        var alphaComplement = 1.0 - alpha;


                        var hillshadecolor = (elevationRGB.multiply(alpha)).add((hillShadeRGB.multiply(alphaComplement)))
                                            .addBands(elevation);


                        var mapid = hillshadecolor.getMap({});

                        assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                            mapid.mapid +
                            '/{z}/{x}/{y}?token=' + mapid.token;    

                    callback(assetTileUrl);

                });

                wgis.addLayer(geeAltitudeLayer, "Elevation", $filter('translate')("MAPAREFERENCIA"), false);



                
                /**
                 * GLOBAL SURFACE WATER
                 */

                var geeSurfaceWaterLayer = new L.TileLayer.GeeScript(function(callback) {

                    var boundary = ee.FeatureCollection('ft:1-yEW8F5gVnjWwcKJ_-iWIFZoPaW0YXmxf4gScDVw');

                    var gsw = ee.Image('JRC/GSW1_0/GlobalSurfaceWater');
                    var occurrence = gsw.select('occurrence');

                    var vis = {
                        min:0,
                        max:100,
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
                var geeHansenLayer = new L.TileLayer.GeeScript(function(callback) {

                    var boundary = ee.FeatureCollection('ft:1-yEW8F5gVnjWwcKJ_-iWIFZoPaW0YXmxf4gScDVw');

                    var tree_cover = ee.Image('UMD/hansen/global_forest_change_2015').select("treecover2000").clip(boundary);
                    
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