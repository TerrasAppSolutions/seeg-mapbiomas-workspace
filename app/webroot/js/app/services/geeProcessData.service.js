/**
 * Service de comunicação google earth engine
 * @argument func getElevation
 */

'use strict';

angular.module('MapBiomas.services').factory('GEEProcessDataService', ['$http', '$rootScope', 'AppConfig', 'WorkmapAPI',
    function ($http, $rootScope, AppConfig, WorkmapAPI) {

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

                        var mapid = greenestPixelComposite.getMap(vizParams);

                        var assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                            mapid.mapid + '/{z}/{x}/{y}?token=' + mapid.token;

                        callback(assetTileUrl);
                    }
                );

                callback(result);

            },
            geeTemporalFilter: function (rules, chart, biome, option, callback) {
                var result = new L.TileLayer.GeeScript(
                    function (callback) {
                        try {
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
                        } catch (error) {
                            // emit error
                            $rootScope.$emit('errorTemporalMap', error);
                        }

                        callback(assetTileUrlColl);
                    }
                );

                callback(result);
            },
            geeIntegrationFilter: function (rules, callback) {
                var result = new L.TileLayer.GeeScript(
                    function (callback) {
                        ee.initialize();
                        /**
                         * @name
                         *      MapBiomas Integration Toolkit
                         * 
                         * @description
                         *  
                         * @author
                         *      João Siqueira
                         *      joaovsiqueira1@gmail.com
                         *
                         * @version 1.0.6
                         *
                         */
                        var App = {

                            options: {
                                version: '1.0.6',

                                assets: {
                                    // auncilary data
                                    regions: 'projects/mapbiomas-workspace/AUXILIAR/regioes2_1_v2',
                                    mosaic: 'projects/mapbiomas-workspace/MOSAICOS/workspace-c3',
                                    temporalFilter: 'projects/mapbiomas-workspace/COLECAO3/classificacao-ft-dev',
                                    // transversal data
                                    agriculture: 'projects/mapbiomas-workspace/TRANSVERSAIS/AGRICULTURA3-FT',
                                    plantedForest: 'projects/mapbiomas-workspace/TRANSVERSAIS/FLORESTAPLANTADA3-FT',
                                    pasture: 'projects/mapbiomas-workspace/TRANSVERSAIS/PECUARIA3-FT',
                                    coastalZone: 'projects/mapbiomas-workspace/TRANSVERSAIS/ZONACOSTEIRA3-FT',
                                    mining: 'projects/mapbiomas-workspace/TRANSVERSAIS/MINERACAO3-FT',
                                    urbanArea: 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA3-FT-FINAL',
                                },

                                year: '1985',

                                layers: [],

                                classification: null,
                                integration: null,
                                mosaics: null,
                                regions: null,

                                'prevalenceList': []

                            },
                            init: function () {

                                App.options.regions = App.getRegions();

                            },
                            getPrevalenceList: function () {

                                //var prevalenceList = rules;

                                /* PEDRO ADD */
                                var prevalenceList = [];

                                for (var i = 0; i < rules.length; i++) {
                                    var el = rules[i];

                                    // console.log("EL", el);

                                    var classe_input = el.Classe.valor;
                                    var classe_output = el.Classe.valor;
                                    
                                    if (el.ClasseAsset.classe_input) {
                                        classe_input = el.ClasseAsset.classe_input;
                                        classe_output = el.ClasseAsset.classe_output;
                                    }

                                    if (el.Asset.asset) {
                                        prevalenceList.push({
                                            'prevalence_id': el.IntegrationFilter.prevalence_id + 1,
                                            'label': el.Classe.classe,
                                            'rule': {
                                                'class_input': classe_input,
                                                'class_output': classe_output,
                                                'source': el.Asset.asset + '/' + App.options.year
                                            },
                                            'exception': null
                                        });
                                    } else {
                                        prevalenceList.push({
                                            'prevalence_id': el.IntegrationFilter.prevalence_id + 1,
                                            'label': el.Classe.classe,
                                            'rule': {
                                                'class_input': classe_input,
                                                'class_output': classe_output,
                                                'source': App.options.classification
                                            },
                                            'exception': null
                                        });
                                    }
                                }

                                return prevalenceList;
                            },

                            getClassifications: function () {

                                var collection = ee.ImageCollection(App.options.assets.temporalFilter);

                                var amz = collection
                                    .filterMetadata('biome', 'equals', 'AMAZONIA')
                                    .filterMetadata('version', 'equals', '8')
                                    .select('classification_' + App.options.year)
                                    .min();

                                var caa = collection
                                    .filterMetadata('biome', 'equals', 'CAATINGA')
                                    .filterMetadata('version', 'equals', '3')
                                    .select('classification_' + App.options.year)
                                    .min();

                                var cer = collection
                                    .filterMetadata('biome', 'equals', 'CERRADO')
                                    .filterMetadata('version', 'equals', '2')
                                    .select('classification_' + App.options.year)
                                    .min();

                                var mat = collection
                                    .filterMetadata('biome', 'equals', 'MATAATLANTICA')
                                    .filterMetadata('version', 'equals', '2')
                                    .select('classification_' + App.options.year)
                                    .min();

                                var pam = collection
                                    .filterMetadata('biome', 'equals', 'PAMPA')
                                    .filterMetadata('version', 'equals', '2')
                                    .select('classification_' + App.options.year)
                                    .min();

                                var pan = collection
                                    .filterMetadata('biome', 'equals', 'PANTANAL')
                                    .filterMetadata('version', 'equals', '2')
                                    .select('classification_' + App.options.year)
                                    .min();

                                var image = ee.ImageCollection.fromImages([
                                    amz.mask(App.options.regions.eq(10)),
                                    caa.mask(App.options.regions.eq(20)),
                                    cer.mask(App.options.regions.eq(30)),
                                    mat.mask(App.options.regions.eq(40)),
                                    pam.mask(App.options.regions.eq(50)),
                                    pan.mask(App.options.regions.eq(60))
                                ]).min();

                                return image;
                            },

                            getRegions: function () {

                                var regions = ee.ImageCollection(App.options.assets.regions)
                                    .mosaic()
                                    .remap(
                                        [10, 20, 30, 40, 51, 52, 53, 61, 62], [10, 20, 30, 40, 50, 50, 50, 60, 60]
                                    );

                                return regions;
                            },

                            integrate: function (year) {

                                App.options.year = String(year);

                                App.options.classification = App.getClassifications();                                

                                App.options.prevalenceList = App.getPrevalenceList();

                                App.options.integrated = App.recursion(
                                    App.options.classification,
                                    App.options.prevalenceList,
                                    App.options.prevalenceList.filter(App.filterByPrevalence, {
                                        'id': App.options.prevalenceList.length
                                    })
                                );

                                return App.options.integrated
                                    .rename('classification_' + App.options.year);

                            },

                            filterByPrevalence: function (obj) {

                                return obj.prevalence_id == this.id;

                            },

                            applyRule: function (image, obj) {                                
                                var mask = ee.Image(obj.rule.source).eq(obj.rule.class_input);

                                var integrated = image
                                    .where(mask.eq(1), obj.rule.class_output);

                                if (obj.exception !== null) {

                                    var maskExceptionList = obj.exception.rule.map(
                                        function (item) {

                                            return ee.Image(item.source).eq(item.class_input)
                                                .unmask()
                                                .rename(['mask']);
                                        }
                                    )

                                    var maskException = ee.ImageCollection.fromImages(maskExceptionList)
                                        .reduce(ee.Reducer.product())
                                        .multiply(mask);

                                    integrated = integrated
                                        .where(maskException.eq(1), obj.exception.class_output);
                                }

                                return integrated;
                            },

                            recursion: function (image, prevalenceList, obj) {

                                var integrated;

                                obj = obj[0];

                                integrated = App.applyRule(image, obj);

                                if (obj.prevalence_id > 1) {

                                    integrated = App.recursion(integrated, prevalenceList,
                                        prevalenceList.filter(App.filterByPrevalence, {
                                            'id': obj.prevalence_id - 1
                                        })
                                    );

                                }

                                return integrated;
                            },

                        };

                        //=============================================================================
                        // Script
                        //=============================================================================

                        var version = '1';

                        var gridNames = [
                            "SD-20-X-D", "SD-20-X-B", "SD-20-X-C", "SD-20-X-A", "SD-20-V-B", "SD-20-V-A", "SC-20-Z-D", "SC-20-Z-B", "SC-20-Z-C", "SC-20-Z-A",
                            "SC-20-X-D", "SC-20-X-B", "SC-20-X-C", "SC-20-X-A", "SC-20-Y-D", "SC-20-Y-B", "SC-20-Y-C", "SC-20-Y-A", "SC-20-V-D", "SC-20-V-B",
                            "SC-20-V-C", "SC-20-V-A", "SC-19-Z-B", "SC-19-Z-C", "SC-19-Z-A", "SC-19-X-D", "SC-19-X-B", "SC-19-X-C", "SC-19-X-A", "SC-19-Y-D",
                            "SC-19-Y-B", "SC-19-Y-A", "SB-23-Y-A", "SB-23-V-D", "SB-23-V-B", "SB-23-V-C", "SB-23-V-A", "SB-22-Z-D", "SB-22-Z-B", "SB-22-Z-C",
                            "SB-22-Z-A", "SB-22-X-D", "SB-22-X-B", "SB-22-X-C", "SB-22-X-A", "SB-22-Y-D", "SB-22-Y-B", "SB-22-Y-C", "SB-22-Y-A", "SB-22-V-D",
                            "SB-22-V-B", "SB-22-V-C", "SB-22-V-A", "SC-22-Z-A", "SC-22-X-D", "SC-22-X-B", "SC-22-X-C", "SC-22-X-A", "SC-22-Y-D", "SC-22-Y-B",
                            "SC-22-Y-C", "SC-22-Y-A", "SC-22-V-D", "SC-22-V-B", "SC-22-V-C", "SC-22-V-A", "SD-22-V-D", "SD-22-V-B", "SD-22-V-C", "SD-22-V-A",
                            "SE-21-V-B", "SE-21-V-A", "SD-21-Z-C", "SD-21-Z-A", "SD-21-X-D", "SD-21-X-B", "SD-21-X-C", "SD-21-X-A", "SD-21-Y-D", "SD-21-Y-B",
                            "SD-21-Y-C", "SD-21-Y-A", "SD-21-V-D", "SD-21-V-B", "SD-21-V-C", "SD-21-V-A", "SC-21-Z-D", "SC-21-Z-B", "SC-21-Z-C", "SC-21-Z-A",
                            "SC-21-X-D", "SC-21-X-B", "SC-21-X-C", "SC-21-X-A", "SC-21-Y-D", "SC-21-Y-B", "SC-21-Y-C", "SC-21-Y-A", "SC-21-V-D", "SC-21-V-B",
                            "SC-21-V-C", "SC-21-V-A", "SD-20-Z-D", "SD-20-Z-B", "SC-19-V-D", "SC-19-V-B", "SC-19-V-C", "SC-19-V-A", "SC-18-X-D", "SC-18-X-B",
                            "SC-18-X-A", "SB-21-Z-D", "SB-21-Z-B", "SB-21-Z-C", "SB-21-Z-A", "SB-21-X-D", "SB-21-X-B", "SB-21-X-C", "SB-21-X-A", "SB-21-Y-D",
                            "SB-21-Y-B", "SB-21-Y-C", "SB-21-Y-A", "SB-21-V-D", "SB-21-V-B", "SB-21-V-C", "SB-21-V-A", "SB-20-Z-D", "SB-20-Z-B", "SB-20-Z-C",
                            "SB-20-Z-A", "SB-20-X-D", "SB-20-X-B", "SB-20-X-C", "SB-20-X-A", "SB-20-Y-D", "SB-20-Y-B", "SB-20-Y-C", "SB-20-Y-A", "SB-20-V-D",
                            "SB-20-V-B", "SB-20-V-C", "SB-20-V-A", "SB-19-Z-D", "SB-19-Z-B", "SB-19-Z-C", "SB-19-Z-A", "SB-19-X-D", "SB-19-X-B", "SB-19-X-C",
                            "SB-19-X-A", "SB-19-Y-D", "SB-19-Y-B", "SB-19-Y-C", "SB-19-Y-A", "SB-19-V-D", "SB-19-V-B", "SB-19-V-C", "SB-19-V-A", "SB-18-Z-D",
                            "SB-18-Z-B", "SB-18-Z-C", "SB-18-Z-A", "SB-18-X-D", "SB-18-X-B", "SA-23-Z-B", "SA-23-Z-C", "SA-23-Z-A", "SA-23-X-C", "SA-23-Y-D",
                            "SA-23-Y-B", "SA-23-Y-C", "SA-23-Y-A", "SA-23-V-D", "SA-23-V-B", "SA-23-V-C", "SA-23-V-A", "SA-22-Z-D", "SA-22-Z-B", "SA-22-Z-C",
                            "SA-22-Z-A", "SA-22-X-D", "SA-22-X-B", "SA-22-X-C", "SA-22-X-A", "SA-22-Y-D", "SA-22-Y-B", "SA-22-Y-C", "SA-22-Y-A", "SA-22-V-D",
                            "SA-22-V-B", "SA-22-V-C", "SA-22-V-A", "SA-21-Z-D", "SA-21-Z-B", "SA-21-Z-C", "SA-21-Z-A", "SA-21-X-D", "SA-21-X-B", "SA-21-X-C",
                            "SA-21-X-A", "SA-21-Y-D", "SA-21-Y-B", "SA-21-Y-C", "SA-21-Y-A", "SA-21-V-D", "SA-21-V-B", "SA-21-V-C", "SA-21-V-A", "SA-20-Z-D",
                            "SA-20-Z-B", "SA-20-Z-C", "SA-20-Z-A", "SA-20-X-D", "SA-20-X-B", "SA-20-X-C", "SA-20-X-A", "SA-20-Y-D", "SA-20-Y-B", "SA-20-Y-C",
                            "SA-20-Y-A", "SA-20-V-D", "SA-20-V-B", "SA-20-V-C", "SA-20-V-A", "SA-19-Z-D", "SA-19-Z-B", "SA-19-Z-C", "SA-19-Z-A", "SA-19-X-D",
                            "SA-19-X-B", "SA-19-X-C", "SA-19-X-A", "SA-19-Y-D", "SA-19-Y-B", "SA-19-V-D", "SA-19-V-B", "NA-22-Z-D", "NA-22-Z-C", "NA-22-Z-A",
                            "NA-21-X-C", "NA-21-Y-D", "NA-21-Y-B", "NA-21-Y-C", "NA-21-Y-A", "NA-21-V-D", "NA-21-V-C", "NA-21-V-A", "NA-20-Z-D", "NA-20-Z-B",
                            "NA-20-Z-C", "NA-20-Z-A", "NA-20-X-D", "NA-20-X-B", "NA-20-X-C", "NA-20-X-A", "NA-20-Y-D", "NA-20-Y-B", "NA-20-Y-C", "NA-20-Y-A",
                            "NA-20-V-D", "NA-20-V-B", "NA-20-V-A", "NA-19-Z-D", "NA-19-Z-B", "NA-19-Z-C", "NA-19-Z-A", "NA-19-X-D", "NA-19-X-C", "NA-19-Y-D",
                            "NA-19-Y-B", "NB-20-Z-D", "NB-20-Z-B", "NB-20-Z-C", "NB-20-Y-D", "NB-20-Y-C", "NB-21-Y-C", "NB-21-Y-A", "NB-22-Y-D", "SB-23-X-A",
                            "NA-22-X-C", "NA-22-X-A", "NA-22-Y-D", "NA-22-Y-B", "NA-22-Y-C", "NA-22-Y-A", "NA-22-V-D", "NA-22-V-B", "NA-22-V-C", "NA-21-Z-D",
                            "NA-21-Z-B", "NA-21-Z-C", "NA-21-Z-A", "NA-21-X-D", "SE-20-X-B", "SE-20-X-B"
                        ];

                        var years = [
                            1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992,
                            1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000,
                            2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008,
                            2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
                            2017
                        ];

                        // import modules
                        //var palettes = require('users/mapbiomas/modules:Palettes.js');

                        var grids = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/cartas');

                        // integration
                        App.init();

                        var integratedList = ee.List(
                            years.map(
                                function (year) {
                                    return App.integrate(year);
                                }
                            )
                        );

                        var integrated = ee.Image(
                            integratedList.iterate(
                                function (band, image) {
                                    return ee.Image(image).addBands(ee.Image(band));
                                },
                                ee.Image().select()
                            )
                        );

                        gridNames.forEach(
                            function (gridName) {
                                var geometry = grids.filterMetadata('grid_name', 'equals', gridName)
                                    .geometry()
                                    .buffer(100)
                                    .bounds();

                                /* Export.image.toAsset({
                                    'image': integrated.set('grid_name', gridName).set('version', version),
                                    'description': gridName + '-' + version,
                                    'assetId': 'projects/mapbiomas-workspace/COLECAO3/integracao-dev/' + gridName + '-' + version,
                                    'pyramidingPolicy': {
                                        ".default": "mode"
                                    },
                                    'region': geometry,
                                    'scale': 30,
                                    'maxPixels': 1e13
                                }); */
                            }
                        );

                        // Require the Mapp module
                        /* var Mapp = require('users/jeffjeff20072/hackthon_modual:Mapp.js');

                        // // Add new themes
                        Mapp.addThemes();

                        // Set your favorite theme
                        Mapp.setBasemap('Dark');

                        Mapp.addLayer(integrated, {
                                'bands': 'classification_1985',
                                'min': 0,
                                'max': 33,
                                'palette': palettes.get('classification2'),
                                'format': 'png'
                            },
                            'integrated'
                        ); */
                        var palette = [
                            "ffffff",
                            "129912",
                            "1f4423",
                            "006400",
                            "00ff00",
                            "687537",
                            "76a5af",
                            "29eee4",
                            "77a605",
                            "935132",
                            "bbfcac",
                            "45c2a5",
                            "b8af4f",
                            "bbfcac",
                            "ffffb2",
                            "ffd966",
                            "f6b26b",
                            "f99f40",
                            "e974ed",
                            "d5a6bd",
                            "c27ba0",
                            "fff3bf",
                            "ea9999",
                            "dd7e6b",
                            "aa0000",
                            "ff99ff",
                            "0000ff",
                            "d5d5e5",
                            "dd497f",
                            "b2ae7c",
                            "af2a2a",
                            "8a2be2",
                            "968c46",
                            "0000ff"
                        ];
                        var mapidInt = integrated.getMap({
                            'bands': 'classification_2000',
                            'min': 0,
                            'max': 33,
                            'palette': palette,
                            'format': 'png'
                        });

                        var assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                            mapidInt.mapid + '/{z}/{x}/{y}?token=' + mapidInt.token;

                        callback(assetTileUrl);
                    }
                );

                callback(result);
            },
            geeGetClassifications: function (rules, callback) {
                var result = new L.TileLayer.GeeScript(
                    function (callback) {
                        
                        ee.initialize();

                        var App = {

                            options: {
                                version: '1.0.6',

                                assets: {
                                    // auncilary data
                                    regions: 'projects/mapbiomas-workspace/AUXILIAR/regioes2_1_v2',
                                    mosaic: 'projects/mapbiomas-workspace/MOSAICOS/workspace-c3',
                                    temporalFilter: 'projects/mapbiomas-workspace/COLECAO3/classificacao-ft-dev',
                                    // transversal data
                                    agriculture: 'projects/mapbiomas-workspace/TRANSVERSAIS/AGRICULTURA3-FT',
                                    plantedForest: 'projects/mapbiomas-workspace/TRANSVERSAIS/FLORESTAPLANTADA3-FT',
                                    pasture: 'projects/mapbiomas-workspace/TRANSVERSAIS/PECUARIA3-FT',
                                    coastalZone: 'projects/mapbiomas-workspace/TRANSVERSAIS/ZONACOSTEIRA3-FT',
                                    mining: 'projects/mapbiomas-workspace/TRANSVERSAIS/MINERACAO3-FT',
                                    urbanArea: 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA3-FT-FINAL',
                                },

                                year: '1985',

                                layers: [],

                                classification: null,
                                integration: null,
                                mosaics: null,
                                regions: null,

                                'prevalenceList': []

                            },
                            init: function () {

                                App.options.regions = App.getRegions();

                            },
                            getPrevalenceList: function () {

                                var prevalenceList = rules;

                                return prevalenceList;
                            },
                            getRegions: function () {

                                var regions = ee.ImageCollection(App.options.assets.regions)
                                    .mosaic()
                                    .remap(
                                        [10, 20, 30, 40, 51, 52, 53, 61, 62], [10, 20, 30, 40, 50, 50, 50, 60, 60]
                                    );

                                return regions;
                            },
                        };

                        //=============================================================================
                        // Script
                        //=============================================================================

                        var version = '1';

                        var gridNames = [
                            "SD-20-X-D", "SD-20-X-B", "SD-20-X-C", "SD-20-X-A", "SD-20-V-B", "SD-20-V-A", "SC-20-Z-D", "SC-20-Z-B", "SC-20-Z-C", "SC-20-Z-A",
                            "SC-20-X-D", "SC-20-X-B", "SC-20-X-C", "SC-20-X-A", "SC-20-Y-D", "SC-20-Y-B", "SC-20-Y-C", "SC-20-Y-A", "SC-20-V-D", "SC-20-V-B",
                            "SC-20-V-C", "SC-20-V-A", "SC-19-Z-B", "SC-19-Z-C", "SC-19-Z-A", "SC-19-X-D", "SC-19-X-B", "SC-19-X-C", "SC-19-X-A", "SC-19-Y-D",
                            "SC-19-Y-B", "SC-19-Y-A", "SB-23-Y-A", "SB-23-V-D", "SB-23-V-B", "SB-23-V-C", "SB-23-V-A", "SB-22-Z-D", "SB-22-Z-B", "SB-22-Z-C",
                            "SB-22-Z-A", "SB-22-X-D", "SB-22-X-B", "SB-22-X-C", "SB-22-X-A", "SB-22-Y-D", "SB-22-Y-B", "SB-22-Y-C", "SB-22-Y-A", "SB-22-V-D",
                            "SB-22-V-B", "SB-22-V-C", "SB-22-V-A", "SC-22-Z-A", "SC-22-X-D", "SC-22-X-B", "SC-22-X-C", "SC-22-X-A", "SC-22-Y-D", "SC-22-Y-B",
                            "SC-22-Y-C", "SC-22-Y-A", "SC-22-V-D", "SC-22-V-B", "SC-22-V-C", "SC-22-V-A", "SD-22-V-D", "SD-22-V-B", "SD-22-V-C", "SD-22-V-A",
                            "SE-21-V-B", "SE-21-V-A", "SD-21-Z-C", "SD-21-Z-A", "SD-21-X-D", "SD-21-X-B", "SD-21-X-C", "SD-21-X-A", "SD-21-Y-D", "SD-21-Y-B",
                            "SD-21-Y-C", "SD-21-Y-A", "SD-21-V-D", "SD-21-V-B", "SD-21-V-C", "SD-21-V-A", "SC-21-Z-D", "SC-21-Z-B", "SC-21-Z-C", "SC-21-Z-A",
                            "SC-21-X-D", "SC-21-X-B", "SC-21-X-C", "SC-21-X-A", "SC-21-Y-D", "SC-21-Y-B", "SC-21-Y-C", "SC-21-Y-A", "SC-21-V-D", "SC-21-V-B",
                            "SC-21-V-C", "SC-21-V-A", "SD-20-Z-D", "SD-20-Z-B", "SC-19-V-D", "SC-19-V-B", "SC-19-V-C", "SC-19-V-A", "SC-18-X-D", "SC-18-X-B",
                            "SC-18-X-A", "SB-21-Z-D", "SB-21-Z-B", "SB-21-Z-C", "SB-21-Z-A", "SB-21-X-D", "SB-21-X-B", "SB-21-X-C", "SB-21-X-A", "SB-21-Y-D",
                            "SB-21-Y-B", "SB-21-Y-C", "SB-21-Y-A", "SB-21-V-D", "SB-21-V-B", "SB-21-V-C", "SB-21-V-A", "SB-20-Z-D", "SB-20-Z-B", "SB-20-Z-C",
                            "SB-20-Z-A", "SB-20-X-D", "SB-20-X-B", "SB-20-X-C", "SB-20-X-A", "SB-20-Y-D", "SB-20-Y-B", "SB-20-Y-C", "SB-20-Y-A", "SB-20-V-D",
                            "SB-20-V-B", "SB-20-V-C", "SB-20-V-A", "SB-19-Z-D", "SB-19-Z-B", "SB-19-Z-C", "SB-19-Z-A", "SB-19-X-D", "SB-19-X-B", "SB-19-X-C",
                            "SB-19-X-A", "SB-19-Y-D", "SB-19-Y-B", "SB-19-Y-C", "SB-19-Y-A", "SB-19-V-D", "SB-19-V-B", "SB-19-V-C", "SB-19-V-A", "SB-18-Z-D",
                            "SB-18-Z-B", "SB-18-Z-C", "SB-18-Z-A", "SB-18-X-D", "SB-18-X-B", "SA-23-Z-B", "SA-23-Z-C", "SA-23-Z-A", "SA-23-X-C", "SA-23-Y-D",
                            "SA-23-Y-B", "SA-23-Y-C", "SA-23-Y-A", "SA-23-V-D", "SA-23-V-B", "SA-23-V-C", "SA-23-V-A", "SA-22-Z-D", "SA-22-Z-B", "SA-22-Z-C",
                            "SA-22-Z-A", "SA-22-X-D", "SA-22-X-B", "SA-22-X-C", "SA-22-X-A", "SA-22-Y-D", "SA-22-Y-B", "SA-22-Y-C", "SA-22-Y-A", "SA-22-V-D",
                            "SA-22-V-B", "SA-22-V-C", "SA-22-V-A", "SA-21-Z-D", "SA-21-Z-B", "SA-21-Z-C", "SA-21-Z-A", "SA-21-X-D", "SA-21-X-B", "SA-21-X-C",
                            "SA-21-X-A", "SA-21-Y-D", "SA-21-Y-B", "SA-21-Y-C", "SA-21-Y-A", "SA-21-V-D", "SA-21-V-B", "SA-21-V-C", "SA-21-V-A", "SA-20-Z-D",
                            "SA-20-Z-B", "SA-20-Z-C", "SA-20-Z-A", "SA-20-X-D", "SA-20-X-B", "SA-20-X-C", "SA-20-X-A", "SA-20-Y-D", "SA-20-Y-B", "SA-20-Y-C",
                            "SA-20-Y-A", "SA-20-V-D", "SA-20-V-B", "SA-20-V-C", "SA-20-V-A", "SA-19-Z-D", "SA-19-Z-B", "SA-19-Z-C", "SA-19-Z-A", "SA-19-X-D",
                            "SA-19-X-B", "SA-19-X-C", "SA-19-X-A", "SA-19-Y-D", "SA-19-Y-B", "SA-19-V-D", "SA-19-V-B", "NA-22-Z-D", "NA-22-Z-C", "NA-22-Z-A",
                            "NA-21-X-C", "NA-21-Y-D", "NA-21-Y-B", "NA-21-Y-C", "NA-21-Y-A", "NA-21-V-D", "NA-21-V-C", "NA-21-V-A", "NA-20-Z-D", "NA-20-Z-B",
                            "NA-20-Z-C", "NA-20-Z-A", "NA-20-X-D", "NA-20-X-B", "NA-20-X-C", "NA-20-X-A", "NA-20-Y-D", "NA-20-Y-B", "NA-20-Y-C", "NA-20-Y-A",
                            "NA-20-V-D", "NA-20-V-B", "NA-20-V-A", "NA-19-Z-D", "NA-19-Z-B", "NA-19-Z-C", "NA-19-Z-A", "NA-19-X-D", "NA-19-X-C", "NA-19-Y-D",
                            "NA-19-Y-B", "NB-20-Z-D", "NB-20-Z-B", "NB-20-Z-C", "NB-20-Y-D", "NB-20-Y-C", "NB-21-Y-C", "NB-21-Y-A", "NB-22-Y-D", "SB-23-X-A",
                            "NA-22-X-C", "NA-22-X-A", "NA-22-Y-D", "NA-22-Y-B", "NA-22-Y-C", "NA-22-Y-A", "NA-22-V-D", "NA-22-V-B", "NA-22-V-C", "NA-21-Z-D",
                            "NA-21-Z-B", "NA-21-Z-C", "NA-21-Z-A", "NA-21-X-D", "SE-20-X-B", "SE-20-X-B"
                        ];

                        var years = [
                            1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992,
                            1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000,
                            2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008,
                            2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
                            2017
                        ];

                        // import modules
                        //var palettes = require('users/mapbiomas/modules:Palettes.js');

                        var grids = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/cartas');

                        // integration
                        App.init();

                        var collection = ee.ImageCollection(App.options.assets.temporalFilter);

                        var amz = collection
                            .filterMetadata('biome', 'equals', 'AMAZONIA')
                            .filterMetadata('version', 'equals', '8')
                            .select('classification_' + App.options.year)
                            .min();

                        var caa = collection
                            .filterMetadata('biome', 'equals', 'CAATINGA')
                            .filterMetadata('version', 'equals', '3')
                            .select('classification_' + App.options.year)
                            .min();

                        var cer = collection
                            .filterMetadata('biome', 'equals', 'CERRADO')
                            .filterMetadata('version', 'equals', '2')
                            .select('classification_' + App.options.year)
                            .min();

                        var mat = collection
                            .filterMetadata('biome', 'equals', 'MATAATLANTICA')
                            .filterMetadata('version', 'equals', '2')
                            .select('classification_' + App.options.year)
                            .min();

                        var pam = collection
                            .filterMetadata('biome', 'equals', 'PAMPA')
                            .filterMetadata('version', 'equals', '2')
                            .select('classification_' + App.options.year)
                            .min();

                        var pan = collection
                            .filterMetadata('biome', 'equals', 'PANTANAL')
                            .filterMetadata('version', 'equals', '2')
                            .select('classification_' + App.options.year)
                            .min();

                        var image = ee.ImageCollection.fromImages([
                            amz.mask(App.options.regions.eq(10)),
                            caa.mask(App.options.regions.eq(20)),
                            cer.mask(App.options.regions.eq(30)),
                            mat.mask(App.options.regions.eq(40)),
                            pam.mask(App.options.regions.eq(50)),
                            pan.mask(App.options.regions.eq(60))
                        ]).min();

                        var palette = [
                            "ffffff",
                            "129912",
                            "1f4423",
                            "006400",
                            "00ff00",
                            "687537",
                            "76a5af",
                            "29eee4",
                            "77a605",
                            "935132",
                            "bbfcac",
                            "45c2a5",
                            "b8af4f",
                            "bbfcac",
                            "ffffb2",
                            "ffd966",
                            "f6b26b",
                            "f99f40",
                            "e974ed",
                            "d5a6bd",
                            "c27ba0",
                            "fff3bf",
                            "ea9999",
                            "dd7e6b",
                            "aa0000",
                            "ff99ff",
                            "0000ff",
                            "d5d5e5",
                            "dd497f",
                            "b2ae7c",
                            "af2a2a",
                            "8a2be2",
                            "968c46",
                            "0000ff"
                        ];
                        var mapidImage = image.getMap({
                            'bands': 'classification_1985',
                            'min': 0,
                            'max': 33,
                            'palette': palette,
                            'format': 'png'
                        });

                        var assetTileUrl = 'https://earthengine.googleapis.com/map/' +
                            mapidImage.mapid + '/{z}/{x}/{y}?token=' + mapidImage.token;

                        callback(assetTileUrl);
                    }
                );

                callback(result);
            },
        };

        return GeeProcessDataService;

    }
]);