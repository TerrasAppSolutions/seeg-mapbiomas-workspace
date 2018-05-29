/**
 * Service de comunicação google earth engine
 * @argument func getElevation
 */

'use strict';

angular.module('MapBiomas.services').factory('GEEProcessDataService', ['$http', 'AppConfig', 'WorkmapAPI',
    function ($http, AppConfig, WorkmapAPI) {

        var GeeProcessDataService = {
            geeAltitudeLayer: new L.TileLayer.GeeScript(function (callback) {

                var boundary = ee.FeatureCollection('ft:1-yEW8F5gVnjWwcKJ_-iWIFZoPaW0YXmxf4gScDVw');

                var terrain = ee.call('Terrain', ee.Image('USGS/SRTMGL1_003').clip(boundary));

                var radians = function (img) {
                    var rad = img.toFloat()
                        .multiply(3.1415927)
                        .divide(180);
                    return rad;
                };

                var HillShade = function (terrain, sunAzimuth, sunElevation) {

                    // sunElevation = 20 should be fixed to make Sun low in the horizon.
                    var zenithElevation = ee.Number(90.0).subtract(sunElevation);
                    var azimuth = radians(ee.Image.constant(sunAzimuth));
                    var zenithElevationRad = radians(ee.Image.constant(zenithElevation));

                    // Terrain
                    var slope = radians(terrain.select(['slope']));
                    var aspect = radians(terrain.select(['aspect']));

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
                    'min': 0,
                    'max': 4000,
                    'palette': '0000FF,00FFFF,00FF00,FFFF00,FF5555,FF0000',
                    'opacity': 0.75
                };

                var visHillShade = {
                    'gain': 200.0
                };

                var elevationRGB = terrain.select(['elevation']).visualize(visElevation);
                var hillShadeRGB = hillShade.visualize(visHillShade);

                var alpha = 0.7;
                var alphaComplement = 1.0 - alpha;

                var hillshadecolor = (elevationRGB.multiply(alpha)).add((hillShadeRGB.multiply(alphaComplement)))
                    .addBands(elevation);

                var mapid = hillshadecolor.getMap({});

                var assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                    mapid.mapid +
                    '/{z}/{x}/{y}?token=' + mapid.token;

                callback(assetTileUrl);

            }),
            geeGetElevationValue: function (lat, lng, callback) {
                // var elevation = ee.Number(45).getInfo();

                var point = ee.Geometry.Point(lng, lat)

                var terrain = ee.call('Terrain', ee.Image('USGS/SRTMGL1_003'));

                var elevation = terrain.select('elevation');

                var sample = elevation.sample({
                    region: point,
                    scale: 30,
                    numPixels: 1
                });

                var elevationValue = sample.first().get("elevation").getInfo()


                callback(lat, lng, elevationValue);
            },
            geeGetNdvi: function (geometry, callback) {
                var result = new L.TileLayer.GeeScript(

                    function (callback) {

                        ee.initialize();

                        var polygon = ee.Geometry.Polygon(geometry.feature.geometry.coordinates);

                        // This function masks clouds in Landsat 8 imagery.
                        var maskClouds = function (image) {
                            var scored = ee.Algorithms.Landsat.simpleCloudScore(image);
                            return image.updateMask(scored.select(['cloud']).lt(20)).clip(polygon);
                        };

                        // This function masks clouds and adds quality bands to Landsat 8 images.
                        var addQualityBands = function (image) {
                            return maskClouds(image)
                                // NDVI
                                .addBands(image.normalizedDifference(['B5', 'B4']))
                                // time in days
                                .addBands(image.metadata('system:time_start'));
                        };

                        // Load a 2014 Landsat 8 ImageCollection.
                        // Map the cloud masking and quality band function over the collection.
                        var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
                            .filterDate('2015-01-01', '2015-12-31')
                            .map(addQualityBands);

                        // var collection = addQualityBands(collection1);

                        // Create a cloud-free, most recent value composite.
                        var recentValueComposite = collection.qualityMosaic('system:time_start');

                        // Create a greenest pixel composite.
                        var greenestPixelComposite = collection.qualityMosaic('nd');

                        // Display the results.
                        // Map.setCenter(-122.374, 37.8239, 12); // San Francisco Bay
                        var vizParams = {
                            bands: ['B5', 'B4', 'B3'],
                            min: 0,
                            max: 0.4
                        };
                        // Map.addLayer(recentValueComposite, vizParams, 'recent value composite');
                        // Map.addLayer(greenestPixelComposite, vizParams, 'greenest pixel composite');

                        var mapid = greenestPixelComposite.getMap(vizParams);

                        /* var mapid = ndvi.getMap({
                            min: -1,
                            max: 1,
                            palette: ['blue', 'white', 'green']
                        }); */

                        var assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                            mapid.mapid + '/{z}/{x}/{y}?token=' + mapid.token;

                        // console.log("image", assetTileUrl);

                        callback(assetTileUrl);
                    }
                );

                callback(result);

            },
            geeTemporalFilter: function (rules, chart, biome, option, callback) {
                console.log("biomeName", biome);
                var result = new L.TileLayer.GeeScript(
                    function (callback) {
                        ee.initialize();
                        /**
                         * Script to run the temporal filter and export images 
                         */

                        var params = {
                            'ft_rules': rules,
                            "properties": {
                                "created_time": null
                            },
                            "temporal_filter_task": {
                                "workspace_task_id": "1212",
                                "gee_task_id": null,
                                "grid_name": chart,
                                "biome_name": biome,
                                "region": "0",
                                "gee_status": null,
                                "workspace_status": null
                            }
                        };
                        /**
                         * Temporal filter class
                         * @param {[type]} params
                         */
                        var TemporalFilter = function (params) {

                            this.options = {

                                "asset": {
                                    "classificacao": "projects/mapbiomas-workspace/COLECAO3/classificacao-dev",
                                },

                                'bands': [
                                    'classification_1985',
                                    'classification_1986',
                                    'classification_1987',
                                    'classification_1988',
                                    'classification_1989',
                                    'classification_1990',
                                    'classification_1991',
                                    'classification_1992',
                                    'classification_1993',
                                    'classification_1994',
                                    'classification_1995',
                                    'classification_1996',
                                    'classification_1997',
                                    'classification_1998',
                                    'classification_1999',
                                    'classification_2000',
                                    'classification_2001',
                                    'classification_2002',
                                    'classification_2003',
                                    'classification_2004',
                                    'classification_2005',
                                    'classification_2006',
                                    'classification_2007',
                                    'classification_2008',
                                    'classification_2009',
                                    'classification_2010',
                                    'classification_2011',
                                    'classification_2012',
                                    'classification_2013',
                                    'classification_2014',
                                    'classification_2015',
                                    'classification_2016',
                                    'classification_2017',
                                ]
                            };

                            /**
                             * Init Temporal Filter Class
                             * @param  {[type]} params
                             */
                            this.init = function (params) {

                                this.params = params;

                                this.collection = this.getCollection();

                            };

                            /**
                             * Get temporal filter rule
                             * @param 
                             *      {object} rule
                             *         A temporal filter rules to be filtered according to the kernel
                             *      {object} {kernel: k}
                             * @return {object}
                             */
                            this.getRulesByKernel = function (rule) {

                                return rule.kernel == this.kernel;
                            };

                            this.getRulesByType = function (rule) {

                                return rule.type == this.type;
                            };

                            /**
                             * Get collection from Mapbiomas Asset
                             * @return {ee.ImageCollection}
                             */
                            this.getCollection = function () {

                                var collection = ee.ImageCollection(this.options.asset.classificacao)
                                    .filterMetadata("grid_name", "equals", this.params.temporal_filter_task.grid_name)
                                    .filterMetadata("biome", "equals", this.params.temporal_filter_task.biome_name);

                                return ee.Image(collection.first());
                            };
                            this.list2multiband = function (imageList) {

                                var multiBand = imageList.slice(1).iterate(
                                    function (band, image) {
                                        return ee.Image(image).addBands(ee.Image(band));
                                    }, imageList.get(0)
                                );

                                return multiBand;
                            };

                            /**
                             * Reclassify no data value to not observed value
                             * @param  {ee.Image} image
                             * @return {ee.Image} image reclassified
                             */
                            var constant = ee.Image.constant(27).byte();

                            this.noData2NotObserved = function (image) {

                                var newImage = constant.clip(image.geometry()).copyProperties(image);

                                newImage = image.where(image.eq(0), 27);

                                return newImage;
                            };

                            var _this = this;

                            this.selectBand = function (band) {

                                return this.collection.select(band);
                            };

                            this.fillHoles = function (image) {

                                return ee.Image(27).where(image.gte(0), image)
                                    .clip(image.geometry())
                                    .rename(image.bandNames())
                                    .copyProperties(image);
                            };
                            /**
                             * Apply the rules using 3 images each time 
                             * @param  {ee.ImageCollection} collection
                             *             Raw image collection
                             * @return {ee.ImageCollection}
                             *             Modified image Collection
                             */
                            this.applyRulesKernel3 = function (collection) {

                                var imageList = this.options.bands
                                    .map(this.selectBand, {
                                        'collection': collection
                                    })
                                    .map(this.noData2NotObserved)
                                    .map(this.fillHoles);

                                var Tminus1, T, Tplus1;
                                var mask, rule, newT;
                                var nBands = this.options.bands.length;

                                var rules = this.params.ft_rules.filter(this.getRulesByKernel, {
                                    'kernel': 3
                                });
                                var rulesRG = rules.filter(this.getRulesByType, {
                                    'type': "RG"
                                });
                                var rulesRP = rules.filter(this.getRulesByType, {
                                    'type': "RP"
                                });
                                var rulesRU = rules.filter(this.getRulesByType, {
                                    'type': "RU"
                                });

                                rulesRG = ee.List(rulesRG);
                                rulesRP = ee.List(rulesRP);
                                rulesRU = ee.List(rulesRU);

                                // RP rules
                                Tminus1 = ee.Image(imageList[0]);
                                T = ee.Image(imageList[1]);
                                Tplus1 = ee.Image(imageList[2]);

                                var newTminus1 = rulesRP.iterate(
                                    function (rule, imageTminus1) {
                                        rule = ee.Dictionary(rule);
                                        mask = ee.Image(imageTminus1).eq(ee.Number(rule.get('tminus1')))
                                            .and(T.eq(ee.Number(rule.get('t'))))
                                            .and(Tplus1.eq(ee.Number(rule.get('tplus1'))));

                                        imageTminus1 = ee.Image(imageTminus1).where(mask.eq(1), ee.Number(rule.get('result')));

                                        return imageTminus1;
                                    },
                                    Tminus1
                                );

                                imageList[0] = ee.Image(newTminus1);

                                // RG rules
                                for (var i = 1; i < nBands - 1; i++) {

                                    Tminus1 = ee.Image(imageList[i - 1]);
                                    T = ee.Image(imageList[i]);
                                    Tplus1 = ee.Image(imageList[i + 1]);

                                    newT = rulesRG.iterate(
                                        function (rule, imageT) {
                                            rule = ee.Dictionary(rule);
                                            mask = Tminus1.eq(ee.Number(rule.get('tminus1')))
                                                .and(ee.Image(imageT).eq(ee.Number(rule.get('t'))))
                                                .and(Tplus1.eq(ee.Number(rule.get('tplus1'))));

                                            imageT = ee.Image(imageT).where(mask.eq(1), ee.Number(rule.get('result')));

                                            return imageT;
                                        },
                                        T
                                    );

                                    imageList[i] = ee.Image(newT);
                                }

                                // RU rules
                                Tminus1 = ee.Image(imageList[nBands - 3]);
                                T = ee.Image(imageList[nBands - 2]);
                                Tplus1 = ee.Image(imageList[nBands - 1]);

                                var newTplus1 = rulesRU.iterate(
                                    function (rule, imageTplus1) {
                                        rule = ee.Dictionary(rule);
                                        mask = Tminus1.eq(ee.Number(rule.get('tminus1')))
                                            .and(T.eq(ee.Number(rule.get('t'))))
                                            .and(ee.Image(imageTplus1).eq(ee.Number(rule.get('tplus1'))));

                                        imageTplus1 = ee.Image(imageTplus1).where(mask.eq(1), ee.Number(rule.get('result')));

                                        return imageTplus1;
                                    },
                                    Tplus1
                                );

                                imageList[nBands - 1] = ee.Image(newTplus1);

                                var collectiontf = this.list2multiband(ee.List(imageList));

                                return ee.Image(collectiontf);

                            };

                            /**
                             * Apply all temporal filter rules
                             * @return {ee.ImageCollection} filtered image collection
                             */
                            this.applyRules = function () {

                                var collection = this.collection;

                                collection = this.applyRulesKernel3(collection);

                                return collection;

                            };

                            this.init(params);

                        };

                        console.log("PARAMS", params);


                        var tf = new TemporalFilter(params);

                        var collectiontf = tf.applyRules();

                        var collection = tf.getCollection();

                        var vis = {
                            "bands": 'classification_2010',
                            "min": 0,
                            "max": 33,
                            "palette": [
                                'ffffff', '129912', '1f4423', '006400', '00ff00', '687537', '76a5af', '29eee4', '77a605', '935132',
                                'bbfcac', '45c2a5', 'b8af4f', 'bbfcac', 'ffffb2', 'ffd966', 'f6b26b', 'f99f40', 'e974ed', 'd5a6bd',
                                'c27ba0', 'fff3bf', 'ea9999', 'dd7e6b', 'b7b7b7', 'ff99ff', '0000ff', 'd5d5e5', 'dd497f', 'b2ae7c',
                                'af2a2a', '8a2be2', '968c46', '0000ff',
                            ],
                            "format": "png"
                        };

                        if (option === 'classification') {
                            var mapidCollection = collection.getMap(vis);
                        } else if (option === 'filtered') {
                            var mapidCollection = collectiontf.getMap(vis);
                        }

                        var assetTileUrlColl = 'https://earthengine.googleapis.com/map/' +
                            mapidCollection.mapid + '/{z}/{x}/{y}?token=' + mapidCollection.token;

                        callback(assetTileUrlColl);
                    }
                );

                callback(result);
            }
        };

        return GeeProcessDataService;

    }
]);