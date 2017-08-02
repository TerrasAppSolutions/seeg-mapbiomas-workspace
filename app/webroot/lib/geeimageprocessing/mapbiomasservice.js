/**
 * [MapbiomasService description]
 * @param {[type]} params [description]
 * @param {[type]} dtree  [description]
 */
var MapbiomasService = function(params, dtree, sFilter, allLayers) {

    this.options = {
        "asset": "projects/mapbiomas-workspace/MOSAICOS/workspace",

        "layersRGB": {

            "classification": {
                "bands": 'classification',
                "min": 0,
                "max": 27,
                "palette": "FFFFFF,129912,1F4423,006400,00FF00," +
                    "687537,76A5AF,29EEE4,77A605,935132," +
                    "FF9966,45C2A5,B8AF4F,F1C232,FFFFB2," +
                    "FFD966,F6B26B,A0D0DE,E974ED,D5A6BD," +
                    "C27BA0,A64D79,EA9999,DD7E6B,B7B7B7," +
                    "FF99FF,0000FF,D5D5E5",
                "format": "png"
            },
            "rgb": {
                "bands": 'swir1,nir,red',
                "gain": '0.08,0.06,0.2',
                "gamma": '0.5',
                "format": "png"
            },
            "ndfirgb": {
                "bands": 'ndfi',
                "palette": "FFFFFF,FFFCFF,FFF9FF,FFF7FF,FFF4FF,FFF2FF,FFEFFF,FFECFF,FFEAFF,FFE7FF," +
                    "FFE5FF,FFE2FF,FFE0FF,FFDDFF,FFDAFF,FFD8FF,FFD5FF,FFD3FF,FFD0FF,FFCEFF," +
                    "FFCBFF,FFC8FF,FFC6FF,FFC3FF,FFC1FF,FFBEFF,FFBCFF,FFB9FF,FFB6FF,FFB4FF," +
                    "FFB1FF,FFAFFF,FFACFF,FFAAFF,FFA7FF,FFA4FF,FFA2FF,FF9FFF,FF9DFF,FF9AFF," +
                    "FF97FF,FF95FF,FF92FF,FF90FF,FF8DFF,FF8BFF,FF88FF,FF85FF,FF83FF,FF80FF," +
                    "FF7EFF,FF7BFF,FF79FF,FF76FF,FF73FF,FF71FF,FF6EFF,FF6CFF,FF69FF,FF67FF," +
                    "FF64FF,FF61FF,FF5FFF,FF5CFF,FF5AFF,FF57FF,FF55FF,FF52FF,FF4FFF,FF4DFF," +
                    "FF4AFF,FF48FF,FF45FF,FF42FF,FF40FF,FF3DFF,FF3BFF,FF38FF,FF36FF,FF33FF," +
                    "FF30FF,FF2EFF,FF2BFF,FF29FF,FF26FF,FF24FF,FF21FF,FF1EFF,FF1CFF,FF19FF," +
                    "FF17FF,FF14FF,FF12FF,FF0FFF,FF0CFF,FF0AFF,FF07FF,FF05FF,FF02FF,FF00FF," +
                    "FF00FF,FF0AF4,FF15E9,FF1FDF,FF2AD4,FF35C9,FF3FBF,FF4AB4,FF55AA,FF5F9F," +
                    "FF6A94,FF748A,FF7F7F,FF8A74,FF946A,FF9F5F,FFAA55,FFB44A,FFBF3F,FFC935," +
                    "FFD42A,FFDF1F,FFE915,FFF40A,FFFF00,FFFF00,FFFB00,FFF700,FFF300,FFF000," +
                    "FFEC00,FFE800,FFE400,FFE100,FFDD00,FFD900,FFD500,FFD200,FFCE00,FFCA00," +
                    "FFC600,FFC300,FFBF00,FFBB00,FFB700,FFB400,FFB000,FFAC00,FFA800,FFA500," +
                    "FFA500,F7A400,F0A300,E8A200,E1A200,D9A100,D2A000,CA9F00,C39F00,BB9E00," +
                    "B49D00,AC9C00,A59C00,9D9B00,969A00,8E9900,879900,7F9800,789700,709700," +
                    "699600,619500,5A9400,529400,4B9300,439200,349100,2D9000,258F00,1E8E00," +
                    "168E00,0F8D00,078C00,008C00,008C00,008700,008300,007F00,007A00,007600," +
                    "007200,006E00,006900,006500,006100,005C00,005800,005400,005000,004C00",
                "min": 0,
                "max": 200,
                "format": "png"
            },
        },

        "layers": {

            "ndfi": {
                "bands": 'ndfi',
                "format": "png"
            },
            "gv": {
                "bands": "gv",
                "format": "png"
            },
            "npv": {
                "bands": "npv",
                "format": "png"
            },
            "soil": {
                "bands": "soil",
                "format": "png"
            },
            "cloud": {
                "bands": "cloud",
                "format": "png"
            },
            "gvs": {
                "bands": "gvs",
                "format": "png"
            },
            "shade": {
                "bands": "shade",
                "format": "png"
            },
            "ndvi": {
                "bands": 'ndvi',
                "format": "png"
            },
            "ndwi": {
                "bands": 'ndwi',
                "format": "png"
            },
            "savi": {
                "bands": 'savi',
                "format": "png"
            },
            "evi2": {
                "bands": 'evi2',
                "format": "png"
            },
            "water_mask": {
                "bands": 'water_mask',
                "min": 0,
                "max": 255,
                "format": "png"
            },
            "fci": {
                "bands": 'fci',
                "format": "png"
            },
            "wvi": {
                "bands": 'wvi',
                "format": "png"
            },
            "ndfi3": {
                "bands": 'ndfi3',
                "format": "png"
            },
            "ndfi4": {
                "bands": 'ndfi4',
                "format": "png"
            },
            "ndfi_amplitude": {
                "bands": 'ndfi_amplitude',
                "format": "png"
            },
            "npvsoil": {
                "bands": 'npvsoil',
                "format": "png"
            },
            "gvnpvs": {
                "bands": 'gvnpvs',
                "format": "png"
            },
            "slope": {
                "bands": 'slope',
                "format": "png"
            },
        },
    };

    /**
     * [init description]
     * @param  {[type]} params  [description]
     * @param  {[type]} dtree   [description]
     * @param  {[type]} sFilter [description]
     * @return {[type]}         [description]
     */
    this.init = function(params, dtree, sFilter, allLayers) {

        ee.initialize();

        this.params = params;
        this.dtree = dtree;
        this.sFilter = sFilter;
        this.allLayers = allLayers;

        this.params.geometry = new GetGrid(cartas).getByName(this.params.carta);

        this._run();

    };

    /**
     * replace it for _uniq underscore.js
     * method found on goolge search
     * [unique description]
     * @param  {[type]} arr [description]
     * @return {[type]}     [description]
     */
    var unique = function(arr) {
        var u = {},
            a = [];
        for (var i = 0, l = arr.length; i < l; ++i) {
            if (!u.hasOwnProperty(arr[i])) {
                a.push(arr[i]);
                u[arr[i]] = 1;
            }
        }
        return a;
    };

    /**
     * [_getVariableList description]
     * @return {[type]} [description]
     */
    this._getLayersList = function() {

        var layersList = [];

        if (this.allLayers) {
            layersList = Object.keys(this.options.layers);

        } else {
            if (this.dtree !== null) {
                var nodes = Object.keys(this.dtree);

                for (var node in nodes) {
                    if (this.dtree[nodes[node]].rule !== null) {
                        layersList.push(this.dtree[nodes[node]].rule.variable);
                    }
                }

                layersList = unique(layersList);
            }
        }

        return layersList;
    };

    /**
     * [groupLayers description]
     * @return {[type]} [description]
     */
    this.groupLayers = function(layersList) {

        var n = 3,
            groups = {},
            list;

        var nGroups = Math.ceil(layersList.length / n);

        for (var i = 0; i < nGroups; i++) {
            list = layersList.slice((i * n), (i * n) + (n));

            switch (list.length) {
                case 1:
                    list = list.concat(list, list);
                    break;
                case 2:
                    list = list.concat(list[1]);
            }

            groups['l' + i] = list;
        }
        return groups;
    };

    /**
     * [getRbgMapIds description]
     * @return {[type]} [description]
     */
    this.getRbgMapIds = function() {

        var mapidrgb = this.composite.getMap(this.options.layersRGB.rgb);
        // var mapidrgb = this.classification.getMap(this.options.layersRGB.classification);
        var mapidndfi = this.composite.getMap(this.options.layersRGB.ndfirgb);
        var mapidclass = this.classification.getMap(this.options.layersRGB.classification);

        var mapids = {
            'rgb': {
                'url': 'https://earthengine.googleapis.com/map/' + mapidrgb.mapid +
                    '/{z}/{x}/{y}?token=' + mapidrgb.token,
                'bands': null
            },
            'ndfirgb': {
                'url': 'https://earthengine.googleapis.com/map/' + mapidndfi.mapid +
                    '/{z}/{x}/{y}?token=' + mapidndfi.token,
                'bands': null
            },
            'classification': {
                'url': 'https://earthengine.googleapis.com/map/' + mapidclass.mapid +
                    '/{z}/{x}/{y}?token=' + mapidclass.token,
                'bands': null
            },
        };

        return mapids;
    };

    /**
     * [getMapIds description]
     * @return {[type]} [description]
     */
    this.getMapIds = function() {

        var mapid, a;
        var mapids = this.getRbgMapIds();

        var layersList = this._getLayersList();

        for (var layer in layersList) {
            a = true;
            while (a) {
                try {
                    mapid = this.composite.getMap(this.options.layers[layersList[layer]]);
                    mapids[layersList[layer]] = {
                        'url': 'https://earthengine.googleapis.com/map/' +
                            mapid.mapid + '/{z}/{x}/{y}?token=' + mapid.token,
                        'bands': null
                    };
                    a = false;
                } catch (err) {
                    console.log(err);
                }

            }
        }

        return mapids;

    };

    /**
     * [getMapIds description]
     * @return {[type]} [description]
     */
    this.getGroupsMapIds = function() {

        var vis, a, mapid;

        var mapids = this.getRbgMapIds();
        var groups = this.groupLayers(this._getLayersList());

        for (var group in groups) {
            a = true;
            while (a) {
                try {
                    mapid = this.composite.getMap({
                        "bands": groups[group]
                    });
                    mapids[group] = {
                        'url': 'https://earthengine.googleapis.com/map/' +
                            mapid.mapid + '/{z}/{x}/{y}?token=' + mapid.token,
                        'bands': {
                            '0': groups[group][0],
                            '1': groups[group][1],
                            '2': groups[group][2]
                        }
                    };
                    a = false;
                } catch (err) {
                    console.log(err);
                }
            }
        }

        return mapids;

    };

    /**
     * [getData description]
     * @return {[type]} [description]
     */
    this.getClassif = function() {

        return this.classification;
    };

    /**
     * [getComposite description]
     * @return {[type]} [description]
     */
    this.getComposite = function() {

        return this.composite;
    };

    this.radians = function(image) {

        var rad = image.toFloat()
            .multiply(3.1415927)
            .divide(180);

        return rad;
    };

    /**
     * [processComposite description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    this.processComposite = function(params) {

        // params to calculate ndfi amplitude
        var paramsAmplitude = {
            "year": params.year,
            "carta": params.carta,
            "t0": params.year + "-01-01",
            "t1": params.year + "-12-31",
            "cloudcover": params.cloudcover,
            "sensor": params.sensor,
            "bioma": params.bioma,
            "region": params.region,
            "geometry": params.geometry
        };

        var col = new Collection(paramsAmplitude);
        var sma = new SMA(col.getCollection(), paramsAmplitude);
        var mask = new Mask(sma.getCollection(), paramsAmplitude);
        var ndfi = new NDFI(mask.getCollection(), paramsAmplitude);
        var ind = new Indexes(ndfi.getCollection(), paramsAmplitude);

        var collection = ind.getCollection();

        var ndfiAmplitude = new Amplitude(collection, paramsAmplitude).getData();

        collection = collection.filterDate(params.t0, params.t1);
        var comp = new Composite(collection);

        var composite = comp.Median()
            .addBands({
                "srcImg": ndfiAmplitude,
                "names": ["ndfi_amplitude"],
                "overwrite": true
            })
            .addBands({
                "srcImg": mask.terrain,
                "names": ["slope"],
                "overwrite": true
            })
            .clip(params.geometry);

        return composite;
    };

    /**
     * [getCompositeFromAsset description]
     * @param  {[type]} params       [description]
     * @param  {[type]} collectionId [description]
     * @return {[type]}              [description]
     */
    this.getCompositeFromAsset = function(params) {
        // console.log(params);
        // console.log(params.year, params.bioma, params.carta, params.regiao);

        if (params.regiao == "") {
            params.regiao = "0";
        }

        params.year = parseInt(params.year, 10);

        var collection = ee.ImageCollection(this.options.asset) // TODO: melhorar esse metodo!!
            .filterMetadata("year", "equals", params.year)
            .filterMetadata("biome", "equals", params.bioma)
            .filterMetadata("grid_name", "equals", params.carta)
            .filterMetadata("region", "equals", params.regiao)
            .filterMetadata("cloud_cover", "equals", params.cloudcover);

        var size;
        
        try{
            size = collection.size().getInfo();
        }catch(e){
            console.log(e);
            size = 0;
        }

        var composite;

        if (size != 0) {
            composite = ee.Image(collection.first());
        } else {
            composite = null;
        }

        return composite;
    };

    /**
     * [_run description]
     * @return {[type]} [description]
     */
    this._run = function() {

        console.log("Getting from asset...")
        this.composite = this.getCompositeFromAsset(this.params);

        if (this.composite == null) {
            console.log("There is no asset! Processing data...")
            this.composite = this.processComposite(this.params)
        }

        var dt = new DecisionTree(this.composite, this.dtree);
        this.classification = dt.getData().clip(this.params.geometry);

    };

    this.init(params, dtree, sFilter, allLayers);

};

var MapbiomasAssetService = function(opts) {

    var paramsCode = {
        biomes : {
            1: 'AMAZONIA',
            2: 'CAATINGA',
            3: 'CERRADO',
            4: 'PAMPA',
            5: 'PANTANAL',
            6: 'MATAATLANTICA',
        },
            
        regionsCode : {
            "AMAZONIA": {
                "0": 10
            },
            "CAATINGA": {
                "0": 20
            },
            "CERRADO": {
                "0": 30
            },
            "MATAATLANTICA": {
                "0": 40
            },
            "PAMPA": {
                "R1": 51,
                "R2": 52,
                "R3": 53
            },
            "PANTANAL": {
                "seco": 61,
                "umido": 62
            },
            "ZONACOSTEIRA": {
            "0": 70
        }
    }

    }

    var options = {   
        'assets': {
            'regioes':'projects/mapbiomas-workspace/AUXILIAR/regioes',
            'mosaico': 'projects/mapbiomas-workspace/MOSAICOS/workspace',
            'classificacao': 'projects/mapbiomas-workspace/COLECAO2_1/classificacao',
            'classificacaoft': 'projects/mapbiomas-workspace/COLECAO2_1/classificacao-ft',
            'integracao': 'projects/mapbiomas-workspace/COLECAO2_1/integracao',
        },
        "palette": "FFFFFF,129912,1F4423,006400,00FF00," +
            "687537,76A5AF,29EEE4,77A605,935132," +
            "FF9966,45C2A5,B8AF4F,F1C232,FFFFB2," +
            "FFD966,F6B26B,A0D0DE,E974ED,D5A6BD," +
            "C27BA0,A64D79,EA9999,DD7E6B,B7B7B7," +
            "FF99FF,0000FF,D5D5E5"
    };

    if (opts) {
        options = opts;
    }

    var mapidsUrls = {};

    this.getConsolidateByBiomaYear = function(assetBioma, assetAno) {

                    
            var regionsCode = {
                "AMAZONIA": {
                    "0": 10
                },
                "CAATINGA": {
                    "0": 20
                },
                "CERRADO": {
                    "0": 30
                },
                "MATAATLANTICA": {
                    "0": 40
                },
                "PAMPA": {
                    "0": 50,
                },
                "PANTANAL": {
                    "0": 60,
                },
                "ZONACOSTEIRA": {
                "0": 70
            }
        }

        ee.initialize();

        var colClassId = options['assets']['classificacao'];

        var lsKey = "ASSET-CLASS-" + assetBioma + "-" +
            assetAno.toString();

        var assetTileUrl = mapidsUrls[lsKey];

        if (assetTileUrl) {
            return assetTileUrl;
        }

        var regions = Object.keys(regionsCode[assetBioma]);

        var regionsMosaic = ee.Image(options['assets']['regioes']);


        var regionsCollectionList = [],
            subcollection,
            code,
            regionImage;


        var colClass = ee.ImageCollection(colClassId)
            .filterMetadata('year', 'equals', assetAno)
            .filterMetadata('biome', 'equals', assetBioma);

        // var classif = colClass.mosaic();



        for (var j = 0; j < regions.length; j++) {

            if (assetBioma === "PAMPA") {
                regionImage = colClass.mosaic().mask(regionsMosaic.gte(50).and(regionsMosaic.lte(60)));
            }
            
            else if (assetBioma === "PANTANAL") {
                regionImage = colClass.mosaic().mask(regionsMosaic.gte(60).and(regionsMosaic.lte(70)));
            } else {

                subcollection = colClass.filterMetadata('region', 'equals', regions[j]);
                code = paramsCode['regionsCode'][assetBioma][regions[j]];
                regionImage = subcollection.mosaic().mask(regionsMosaic.eq(code));
            }
            
            regionsCollectionList.push(regionImage);
            
        }

        var classif = ee.ImageCollection.fromImages(regionsCollectionList);

        var mapid = classif.getMap({
            // "bands": 'classification',
            "min": 0,
            "max": 28,
            "palette": options['palette'],
            "format": "png"
        });

        assetTileUrl = 'https://earthengine.googleapis.com/map/' +
            mapid.mapid +
            '/{z}/{x}/{y}?token=' + mapid.token;

        mapidsUrls[lsKey] = assetTileUrl;

        return assetTileUrl;
    }

    this.getClassifByBiomaYear = function(assetBioma, assetAno) {

        ee.initialize();

        var colClassId = options['assets']['classificacao'];

        var lsKey = "ASSET-CLASS-" + assetBioma + "-" +
            assetAno.toString();

        var assetTileUrl = mapidsUrls[lsKey];

        if (assetTileUrl) {
            return assetTileUrl;
        }

        var regions = Object.keys(paramsCode['regionsCode'][assetBioma]);

        var regionsMosaic = ee.Image(options['assets']['regioes']);


        var regionsCollectionList = [],
            subcollection,
            code,
            regionImage;


        var colClass = ee.ImageCollection(colClassId)
            .filterMetadata('year', 'equals', assetAno)
            .filterMetadata('biome', 'equals', assetBioma);

        // var classif = colClass.mosaic();



        for (var j = 0; j < regions.length; j++) {
            subcollection = colClass
                .filterMetadata('region', 'equals', regions[j]);

            code = paramsCode['regionsCode'][assetBioma][regions[j]];

            regionImage = subcollection.mosaic().mask(regionsMosaic.eq(code));
            regionsCollectionList.push(regionImage);
            
        }

        var classif = ee.ImageCollection.fromImages(regionsCollectionList);

        var mapid = classif.getMap({
            // "bands": 'classification',
            "min": 0,
            "max": 27,
            "palette": options['palette'],
            "format": "png"
        });

        assetTileUrl = 'https://earthengine.googleapis.com/map/' +
            mapid.mapid +
            '/{z}/{x}/{y}?token=' + mapid.token;

        mapidsUrls[lsKey] = assetTileUrl;

        return assetTileUrl;
    }

    this.getMosaicByBiomaYear = function(assetBioma, assetAno) {

        ee.initialize();

        var colMosaicId = options['assets']['mosaico'];

        var lsKey = "ASSET-MOSAIC-" + assetBioma + "-" +
            assetAno.toString();

        var assetTileUrl = mapidsUrls[lsKey];

        if (assetTileUrl) {
            return assetTileUrl;
        }

        var colMosaic = ee.ImageCollection(colMosaicId)
            .filterMetadata('year', 'equals', assetAno)
            .filterMetadata('biome', 'equals', assetBioma);

        var mosaic = colMosaic.mosaic();

        var mapid = mosaic.getMap({
            "bands": 'swir1,nir,red',
            "gain": '0.08,0.06,0.2',
            "gamma": '0.5',
            "format": "png"
        });

        assetTileUrl = 'https://earthengine.googleapis.com/map/' +
            mapid.mapid +
            '/{z}/{x}/{y}?token=' + mapid.token;

        mapidsUrls[lsKey] = assetTileUrl;

        return assetTileUrl;
    }

    /**
     * Retorna url tilelayer de classificação por parametros agrupados
     * @param {String} url de tilelayer de classificação
     */
    this.getClassifByParamsGroup = function(paramsGroup) {

        var colClassId = options['assets']['classificacao'];

        var biomas = Object.keys(_.groupBy(paramsGroup, function(param) {
            return param.Classificacao.bioma_colecoes;
        }));

        var anos = Object.keys(_.groupBy(paramsGroup, function(param) {
            return param.Classificacao.years;
        }));
        
        ee.initialize();

        var colClass = ee.ImageCollection(colClassId);
        
        if(biomas.length == 1){
           colClass = colClass.filter(ee.Filter.inList('biome', [biomas[0]]));
        }
        if(anos[0].length == 4){            
           colClass = colClass.filterMetadata('year', 'equals', parseInt(anos[0]));
        }            

        /*
        var arrayTasksId = mapTasksId(paramsGroup);
        var colClass = ee.ImageCollection(colClassId)
            .filter(ee.Filter.inList('task_id', arrayTasksId));
        if (biomas.length == 1) {
            colClass = colClass.filterMetadata('biome', 'equals', biomas[0]);
        }
        */

        var classif = colClass.mosaic();

        var mapid = classif.getMap({
            "bands": 'classification',
            "min": 0,
            "max": 32,
            "palette": options['palette'],
            "format": "png"
        });

        var assetTileUrl = 'https://earthengine.googleapis.com/map/' +
            mapid.mapid +
            '/{z}/{x}/{y}?token=' + mapid.token;

        return assetTileUrl;
    };
   
    /**
     * Retorna url tilelayer de filtro temporal por parametros agrupados
     * @param {String} url de tilelayer de classificação
     */
    this.getClassFtLayerByParamsGroup = function(paramsGroup) {

        var colClassId = options['assets']['classificacaoft'];

        var biomas = Object.keys(_.groupBy(paramsGroup, function(param) {
            return param.Classificacao.bioma_colecoes;
        }));

        var anos = Object.keys(_.groupBy(paramsGroup, function(param) {
            return param.Classificacao.years;
        }));
        
        ee.initialize();

        var colClass = ee.ImageCollection(colClassId);
        
        if(biomas.length == 1){
           colClass = colClass.filter(ee.Filter.inList('biome', [biomas[0]]));
        }
        if(anos[0].length == 4){            
           colClass = colClass.filterMetadata('year', 'equals', parseInt(anos[0]));
        }            

        /*
        var arrayTasksId = mapTasksId(paramsGroup);
        var colClass = ee.ImageCollection(colClassId)
            .filter(ee.Filter.inList('task_id', arrayTasksId));
        if (biomas.length == 1) {
            colClass = colClass.filterMetadata('biome', 'equals', biomas[0]);
        }
        */

        var classif = colClass.mosaic();

        var mapid = classif.getMap({
            "bands": 'classification',
            "min": 0,
            "max": 32,
            "palette": options['palette'],
            "format": "png"
        });

        var assetTileUrl = 'https://earthengine.googleapis.com/map/' +
            mapid.mapid +
            '/{z}/{x}/{y}?token=' + mapid.token;

        return assetTileUrl;
    };


     /**
     * Retorna url tilelayer de integração por parametros agrupados
     * @param {String} url de tilelayer de classificação
     */
    this.getIntegrationLayerByParamsGroup = function(paramsGroup) {

        var colClassId = options['assets']['integracao'];

        var biomas = Object.keys(_.groupBy(paramsGroup, function(param) {
            return param.Classificacao.bioma_colecoes;
        }));

        var anos = Object.keys(_.groupBy(paramsGroup, function(param) {
            return param.Classificacao.years;
        }));
        
        ee.initialize();

        var colClass = ee.ImageCollection(colClassId);
        
        if(biomas.length == 1){
           colClass = colClass.filter(ee.Filter.inList('biome', [biomas[0]]));
        }
        if(anos[0].length == 4){            
           colClass = colClass.filterMetadata('year', 'equals', parseInt(anos[0]));
        }            

        /*
        var arrayTasksId = mapTasksId(paramsGroup);
        var colClass = ee.ImageCollection(colClassId)
            .filter(ee.Filter.inList('task_id', arrayTasksId));
        if (biomas.length == 1) {
            colClass = colClass.filterMetadata('biome', 'equals', biomas[0]);
        }
        */

        var classif = colClass.mosaic();

        var mapid = classif.getMap({
            "bands": 'integrated',
            "min": 0,
            "max": 32,
            "palette": options['palette'],
            "format": "png"
        });

        var assetTileUrl = 'https://earthengine.googleapis.com/map/' +
            mapid.mapid +
            '/{z}/{x}/{y}?token=' + mapid.token;

        return assetTileUrl;
    };

    /**
     * Retorna url tilelayer de mosaic por parametros agrupados
     * @param {String} url de tilelayer de classificação
     */
    this.getMosaicByParamsGroup = function(paramsGroup) {

        var colClassId = options['assets']['mosaico'];

        var biomas = Object.keys(_.groupBy(paramsGroup, function(param) {
            return param.Classificacao.bioma_colecoes;
        }));

        var anos = Object.keys(_.groupBy(paramsGroup, function(param) {
            return param.Classificacao.years;
        }));

        ee.initialize();

        var colMosaic = ee.ImageCollection(colClassId);
        
        if(biomas.length == 1){
           colMosaic = colMosaic.filter(ee.Filter.inList('biome', [biomas[0]]));
        }
        if(anos[0].length == 4){            
           colMosaic = colMosaic.filterMetadata('year', 'equals', parseInt(anos[0]));
        }      

        /*
        var arrayTasksId = mapTasksId(paramsGroup);
        var colMosaic = ee.ImageCollection(colClassId)
            .filter(ee.Filter.inList('task_id', arrayTasksId));
        */

        var mosaic = colMosaic.mosaic();

        var mapid = mosaic.getMap({
            "bands": 'swir1,nir,red',
            "gain": '0.08,0.06,0.2',
            "gamma": '0.5',
            "format": "png"
        });

        var assetTileUrl = 'https://earthengine.googleapis.com/map/' +
            mapid.mapid +
            '/{z}/{x}/{y}?token=' + mapid.token;

        return assetTileUrl;
    };

    /**
     * Retorna lista de tasks ids 
     * @param {Array} listar de parametros agrupados
     */
    var mapTasksId = function(paramsGroup) {

        var tasksIds = [];

        paramsGroup.forEach(function(param) {
            var paramTasks = new String(param.Classificacao.tarefas).split(',');
            var paramTasksId = _.map(paramTasks, function(task) {
                var taskValuesArray = task.split('-');
                return parseInt(taskValuesArray[0]);
            });
            tasksIds = tasksIds.concat(paramTasksId);
        });

        return tasksIds;
    };

    /**
     * Retorna lista de tasks ids 
     * @param {Array} listar de parametros agrupados
     */
    var mapTasksParentId = function(paramsGroup) {

        var tasksIds = [];

        paramsGroup.forEach(function(param) {
            var paramTasks = new String(param.Classificacao.tarefaspai).split(',');
            var paramTasksId = _.map(paramTasks, function(task) {
                var taskValuesArray = task.split('-');
                return parseInt(taskValuesArray[0]);
            });
            tasksIds = tasksIds.concat(paramTasksId);
        });

        return tasksIds;
    };
};

var MapbiomasExportTaskService = function(opts) {


    this.exportGeeImageToAsset = function(geeImage) {

        /*
        var taskConfig = {
            'type': 'EXPORT_IMAGE',
            'json': geeImage.serialize(),
            //'description': description,
            //'state': Task.State.UNSUBMITTED,
        };
        var taskId = null;
        */

        // Create Task
        /*
        _CreateTask(Task.Type.EXPORT_IMAGE, image, description, config)

        full_config = {
            'type': task_type,
            'json': ee_object.serialize(),
            'description': description,
            'state': Task.State.UNSUBMITTED,
        }
        if config: full_config.update(config)
        return Task(data.newTaskId()[0], full_config)
        */

        /*
        ""
        "Starts the task. No-op for started tasks."
        ""
        if not self.config:
            raise ee_exception.EEException(
                'Task config must be specified for tasks to be started.')
        data.startProcessing(self.id, self.config)
        */

        // 
    };
};