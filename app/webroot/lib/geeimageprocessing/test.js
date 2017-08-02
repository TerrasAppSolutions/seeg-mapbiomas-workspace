/**
 * [Collection description]
 * @param {[type]} params [description]
 */
/**
 * [Collection description]
 * @param {[type]} params [description]
 */
var Collection = function(params) {

    this.options = {
        'L5': {
            'sr': {
                'id': 'LT5_L1T_SR',
                'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7'],
                'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'],
                'coefficient': 1
            },
            'toa': {
                'id': 'LANDSAT/LT5_L1T_TOA_FMASK',
                'bandNames': ['B6', 'fmask'],
                'newNames': ['thermal', 'fmask'],
                'coefficient': 1
            }
        },
        'L7': {
            'sr': {
                'id': 'LE7_L1T_SR',
                'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7'],
                'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'],
                'coefficient': 1
            },
            'toa': {
                'id': 'LANDSAT/LE7_L1T_TOA_FMASK',
                'bandNames': ['B6_VCID_1', 'fmask'],
                'newNames': ['thermal', 'fmask'],
                'coefficient': 1
            }
        },
        'L8': {
            'sr': {
                'id': 'LC8_SR',
                'bandNames': ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10'],
                'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'thermal'],
                'coefficient': 1
            },
            'toa': {
                'id': 'LANDSAT/LC8_L1T_TOA_FMASK',
                'bandNames': ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'fmask'],
                'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'thermal',
                    'fmask'
                ],
                'coefficient': 10000
            }
        },
    };

    /**
     * [init description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    this.init = function(params) {

        this.params = params;
        this.filterParams();

    };

    /**
     * [joined2imgCol description]
     * @param  {[type]} feature [description]
     * @return {[type]}         [description]
     */
    this.joined2imgCol = function(feature) {

        var primary = feature.get('primary');
        var secondary = feature.get('secondary');
        var image = ee.Image.cat(primary, secondary);

        return ee.Image(image);
    };

    /**
     * [joinCollections description]
     * @param  {[type]} collection1 [description]
     * @param  {[type]} collection2 [description]
     * @return {[type]}             [description]
     */
    this.joinCollections = function(collection1, collection2) {

        // Faz o join entre as duas coleções
        var filterTimeEq = ee.Filter.equals({
            "leftField": 'system:index',
            "rightField": 'system:index'
        });

        // Aplica o join e retorna uma FeatureCollection.
        var joinedCollection = ee.Join.inner().apply(
            collection1, collection2, filterTimeEq);

        // Converte joinedCollection para imageCollection
        var imageCollection = ee.ImageCollection(
            joinedCollection.map(this.joined2imgCol));
        
        return imageCollection;
    };

    /**
     * [imageCollection description]
     * @param  {[type]} collectionID [description]
     * @return {[type]}              [description]
     */
    this.imageCollection = function(collectionID) {

        var cc = "CLOUD_COVER";

        var collection = ee.ImageCollection(collectionID)
            .filterMetadata(cc, "less_than", this.params.cloudcover)
            .filterDate(this.params.t0, this.params.t1)
            .filterBounds(this.params.geometry);
        
        return collection;
    };

    /**
     * [filterBySensor description]
     * @return {[type]} [description]
     */
    this.filterBySensor = function() {

        var collection = null;

        switch (this.params.sensor) {
            case "L5":
                collection = this.joinCollections(
                    this.imageCollection(this.options.L5.sr.id).select(
                        this.options.L5.sr.bandNames,
                        this.options.L5.sr.newNames),
                    this.imageCollection(this.options.L5.toa.id).select(
                        this.options.L5.toa.bandNames,
                        this.options.L5.toa.newNames)
                );
                break;
            case "L7":
                collection = this.joinCollections(
                    this.imageCollection(this.options.L7.sr.id).select(
                        this.options.L7.sr.bandNames,
                        this.options.L7.sr.newNames),
                    this.imageCollection(this.options.L7.toa.id).select(
                        this.options.L7.toa.bandNames,
                        this.options.L7.toa.newNames)
                );
                break;
            case "LX":
                var L5 = this.joinCollections(
                    this.imageCollection(this.options.L5.sr.id).select(
                        this.options.L5.sr.bandNames,
                        this.options.L5.sr.newNames),
                    this.imageCollection(this.options.L5.toa.id).select(
                        this.options.L5.toa.bandNames,
                        this.options.L5.toa.newNames));

                var L7 = this.joinCollections(
                    this.imageCollection(this.options.L7.sr.id).select(
                        this.options.L7.sr.bandNames,
                        this.options.L7.sr.newNames),
                    this.imageCollection(this.options.L7.toa.id).select(
                        this.options.L7.toa.bandNames,
                        this.options.L7.toa.newNames));

                collection = ee.ImageCollection(L5.merge(L7)).sort('DATE_ACQUIRED');
                break;
            case "L8":
                collection = this.imageCollection(this.options.L8.toa.id).select(
                    this.options.L8.toa.bandNames,
                    this.options.L8.toa.newNames);
        }

        return collection;
    };

    /**
     * [edgeRemoval description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.edgeRemoval = function(image) {

        var edgeSize = -5500.0;

        image = image.clip(
            image.geometry()
            .buffer(edgeSize)
            .simplify(1)
        );

        return image;
    };

    this.applyCoef = function(image) {

        var bands = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];

        for (var i = 0; i < bands.length; i++) {
            image = image.addBands({
                "srcImg": image.select([bands[i]]).multiply(10000),
                "names": [bands[i]],
                "overwrite": true
            });
        }

        return image;
    };
    /**
     * [filterParams description]
     * @return {[type]} [description]
     */
    this.filterParams = function() {
        
        this.collection = this.filterBySensor()
            .map(this.edgeRemoval);

        if (this.params.sensor === "L8") {
            this.collection = this.collection.map(this.applyCoef);

        }
    };

    /**
     * [getCollection description]
     * @return {[type]} [description]
     */
    this.getCollection = function() {

        return this.collection;
    };

    this.init(params);
};

/**
 * [SMA description]
 */
var SMA = function(collection, params) {

    this.bandNames = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
    this.outBandNames = ['gv', 'npv', 'soil', 'cloud'];

    this.spectralLib = {
        // atmospher 805.6, 458.1, 286.8, 168.3, 46.8, 26.6
        'LX': [
            [119.0, 475.0, 169.0, 6250.0, 2399.0, 675.0], /*gv*/
            [1514.0, 1597.0, 1421.0, 3053.0, 7707.0, 1975.0], /*npv*/
            [1799.0, 2479.0, 3158.0, 5437.0, 7707.0, 6646.0], /*soil*/
            [4031.0, 8714.0, 7900.0, 8989.0, 7002.0, 6607.0] /*cloud*/
        ],
        'L8': [
            [119.0, 475.0, 169.0, 6250.0, 2399.0, 675.0], /*gv*/
            [1514.0, 1597.0, 1421.0, 3053.0, 7707.0, 1975.0], /*npv*/
            [1799.0, 2479.0, 3158.0, 5437.0, 7707.0, 6646.0], /*soil*/
            [4031.0, 8714.0, 7900.0, 8989.0, 7002.0, 6607.0] /*cloud*/
            // [924.6, 933.1, 455.8, 6418.3, 2445.8, 701.6], /*gv*/
            // [2319.6, 2055.1, 1707.8, 3221.3, 7753.8, 2001.6], /*npv*/
            // [2604.6, 2937.1, 3444.8, 5605.3, 7753.8, 6672.6], /*soil*/
            // [4836.6, 9172.1, 8186.8, 9157.3, 7048.8, 6633.6] /*cloud*/
        ]
    };

    /**
     * [init description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    this.init = function(collection, params) {

        this.collection = collection;
        this.params = params;
        this.calculate();

    };

    /**
     * [setSpectralLib description]
     */
    this.setSpectralLib = function() {

        if (this.params.sensor === "L8") {
            this.endmembers = this.spectralLib.L8;
        } else {
            this.endmembers = this.spectralLib.LX;
        }

    };

    /**
     * [calcFractions description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    var _this = this;
    this.calcFractions = function(image) {

        // var coef = 1;
        // if (_this.col.params.sensor === "L8") {
        //     coef = 10000;
        // }

        // Uminxing data
        var fractions = ee.Image(image)
            .select(_this.bandNames)
            // .multiply(coef)
            .unmix(_this.endmembers)
            .max(0)
            .multiply(100)
            .byte();

        fractions = fractions.select([0, 1, 2, 3], _this.outBandNames);

        return image.addBands(fractions);

    };

    /**
     * [calcGVS description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.calcGVS = function(image) {

        var summed = image.select(['gv', 'npv', 'soil']) //, 'cloud'])
            .reduce(ee.Reducer.sum());

        var shd = summed.subtract(100).abs().byte();
        var gvs = image.select(["gv"])
            .divide(summed)
            .multiply(100)
            .byte();

        image = image.addBands(gvs.select([0], ["gvs"]));
        image = image.addBands(shd.select([0], ["shade"]));

        return image;

    };

    /**
     * [calculate description]
     * @return {[type]} [description]
     */
    this.calculate = function() {

        this.setSpectralLib();

        this.collection = this.collection.map(this.calcFractions)
                                         .map(this.calcGVS);
    };

    /**
     * [getCollection description]
     * @return {[type]} [description]
     */
    this.getCollection = function() {

        return this.collection;
    };

    this.init(collection, params);
};

/**
 * [NDFI description]
 * @param {[type]} col [description]
 */
var NDFI = function(collection, params) {

    this.palette =
        "FFFFFF,FFFCFF,FFF9FF,FFF7FF,FFF4FF,FFF2FF,FFEFFF,FFECFF,FFEAFF,FFE7FF," +
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
        "007200,006E00,006900,006500,006100,005C00,005800,005400,005000,004C00";

    /**
     * [init description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    this.init = function(collection, params) {

        this.collection = collection;
        this.params = params;
        this.calculate();

    };

    /**
     * [calcNDFI description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.calcNDFI = function(image) {

        var gvs = image.select("gvs");

        var npvSoil = image.select("npv")
            .add(image.select("soil"))
            .add(image.select("cloud"));

        var ndfi = ee.Image.cat(gvs, npvSoil).normalizedDifference();

        // rescale NDFI from 0 until 200
        ndfi = ndfi.multiply(100).add(100).byte();

        return image.addBands(ndfi.select([0], ["ndfi"]));

    };

    /**
     * [calculate description]
     * @return {[type]} [description]
     */
    this.calculate = function() {

        this.collection = this.collection.map(this.calcNDFI);

    };

    /**
     * [getCollection description]
     * @return {[type]} [description]
     */
    this.getCollection = function() {

        return this.collection;
    };

    this.init(collection, params);

};

/**
 * [Mask description]
 * @param {[type]} col [description]
 */
var Mask = function(collection, params) {

    this.options = {
        "shade": {
            "cloudAltitude": 1000,
            "bufferSize": 5,
            "thresh": {
                "s1": 70,
                "s2": 65
            }
        },
        "cloud": {
            "bufferSize": 10,
            "temperature": 22,
            "thresh": {
                "c1": 10,
                "c2": 7
            }
        },
        "water": {
            "thresh": {
                "shade": 75,
                "gv": 10,
                "soil": 5
            }
        }
    };

    /**
     * [init description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    this.init = function(collection, params) {
        
        this.terrain = ee.call('Terrain', ee.Image('USGS/SRTMGL1_003'));
        
        this.collection = collection;
        this.params = params;
        this._make();

    };

    /**
     * [_hillShadow description]
     * @param  {[type]} terrain      [description]
     * @param  {[type]} sunAzimuth   [description]
     * @param  {[type]} sunElevation [description]
     * @return {[type]}              [description]
     */
    this._hillShadow = function(terrain, sunAzimuth, sunElevation) {

        var zenithElevation = ee.Number(90.0).subtract(sunElevation);

        // Terrain
        var elevation = terrain.select(['elevation']);

        // Hill Shadow mask
        var hillShadowMask = ee.Algorithms.HillShadow(
            elevation, sunAzimuth, zenithElevation, 300, true);

        return hillShadowMask.eq(0);

    };

    /**
     * [hillShadeMask description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    var _this = this;
    this.hillShadeMask = function(image) {

        var sunAzimuth = image.get('SUN_AZIMUTH');
        var sunElevation = image.get('SUN_ELEVATION');

        var hillshadow = _this._hillShadow(_this.terrain, sunAzimuth, sunElevation);

        return image.addBands(hillshadow.select([0], ['hillshade_mask']));

    };

    /**
     * [cloudMask description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.cloudMask = function(image) {

        var cloud = image.select(['cloud']);
        var thermal = image.select(['thermal']).subtract(273.15);

        var cloudMask = cloud.gte(_this.options.cloud.thresh.c1).and(
            thermal.lte(_this.options.cloud.temperature));

        var kernel = ee.Kernel.circle(
            _this.options.cloud.bufferSize, 'pixels');

        var buffered = cloudMask.convolve(kernel);
        buffered = (buffered.add(cloudMask)).gt(0);

        cloudMask = buffered.eq(1).and(
                cloud.gte(_this.options.cloud.thresh.c2)
            ).multiply(255)
            .byte();

        return image.addBands(cloudMask.select([0], ['cloud_mask']));

    };

    /**
     * [shadeMask description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.shadeMask = function(image) {

        var sunAzimuth = image.get('SUN_AZIMUTH');
        var sunElevation = image.get('SUN_ELEVATION');
        var cloudMask = image.select('cloud_mask');

        var simulTerrain = cloudMask.multiply(_this.options.shade.cloudAltitude)
            .select([0], ['elevation']);

        var hillshadow = _this._hillShadow(simulTerrain, sunAzimuth, sunElevation);

        var shade = image.select('shade');
        var shadeMask = hillshadow.eq(1).and(shade.gte(
            _this.options.shade.thresh.s1));

        var kernel = ee.Kernel.circle(_this.options.shade.bufferSize, 'pixels');
        var buffered = shadeMask.convolve(kernel);
        buffered = (buffered.add(shadeMask)).gt(0);

        shadeMask = buffered.eq(1).and(shade.gte(
            _this.options.shade.thresh.s2)).multiply(255).byte();

        return image.addBands(shadeMask.select([0], ['shade_mask']));

    };

    /**
     * [waterMask description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.waterMask = function(image) {

        var shade = image.select('shade');
        var gv = image.select('gv');
        var soil = image.select('soil');

        var shadeMask = image.select('shade_mask');
        var cloudMask = image.select('cloud_mask');
        var hillShadeMask = image.select('hillshade_mask');

        var waterMask = shade.gte(_this.options.water.thresh.shade)
            .and(gv.lte(_this.options.water.thresh.gv))
            .and(soil.lte(_this.options.water.thresh.soil))
            .and(shadeMask.eq(0))
            .and(cloudMask.eq(0))
            .and(hillShadeMask.eq(0))
            .multiply(255)
            .byte();

        return image.addBands(waterMask.select([0], ['water_mask']));

    };

    this.fmask = function(image) {

        var fmask = image.select(['fmask']);
        var cloudMask = fmask.eq(4);
        var shadeMask = fmask.eq(2);
        var waterMask = fmask.eq(1);

        return image.addBands(cloudMask.select([0], ['cloud_mask']))
            .addBands(shadeMask.select([0], ['shade_mask']))
            .addBands(waterMask.select([0], ['water_mask']));
    };

    /**
     * [_make description]
     * @return {[type]} [description]
     */
    this._make = function() {

        this.collection = this.collection.map(this.hillShadeMask)
            .map(this.fmask);
        // .map(this.cloudMask)
        // .map(this.shadeMask)
        // .map(this.hillShadeMask)
        // .map(this.waterMask);

    };

    /**
     * [getCollection description]
     * @return {[type]} [description]
     */
    this.getCollection = function() {

        return this.collection;
    };

    this.init(collection, params);

};

/**
 * [Composite description]
 * @param {[type]} collection [description]
 */
var Composite = function(collection) {

    this.composite = null;

    /**
     * [init description]
     * @param  {[type]} collection [description]
     * @return {[type]}            [description]
     */
    this.init = function(collection) {

        if (collection !== null) {

            this.collection = collection.map(this.cloudFree);

        }

    };

    /**
     * [cloudFree description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.cloudFree = function(image) {

        var cloudMask = image.select(['cloud_mask']);
        var shadeMask = image.select(['shade_mask']);

        var csm = cloudMask.add(shadeMask).gte(1);

        return image.mask(csm.neq(1));

    };

    /**
     * [median description]
     * @return {[type]} [description]
     */
    this.Median = function() {

        this.composite = this.collection.median()
            .addBands(this.waterAdjust(), ['water_mask'], true);

        return this.composite;

    };

    /**
     * [waterAdjust description]
     * @return {[type]} [description]
     */
    this.waterAdjust = function() {

        return this.collection.select(['water_mask'])
            .median()
            .gt(0)
            .multiply(255)
            .byte();
    };

    this.init(collection);

};

/**
 * [Indexes description]
 */
var Indexes = function(collection, params) {

    /**
     * [init description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    this.init = function(collection, params) {

        this.collection = collection;
        this.params = params;
        this.calculate();

    };

    /**
     * [ndvi description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.ndvi = function(image) {

        var ndvi = image.expression('float(nir - red)/(nir + red)', {
            'nir': image.select('nir'),
            'red': image.select('red')
        }).multiply(200).byte(); // rescale NDVI from 0-200

        return image.addBands(ndvi.select([0], ["ndvi"]));

    };

    /**
     * [ndwi description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.ndwi = function(image) {

        var ndwi = image.expression('float(nir - swir1)/(nir + swir1)', {
            'nir': image.select('nir'),
            'swir1': image.select('swir1')
        }).multiply(200).byte();

        return image.addBands(ndwi.select([0], ["ndwi"]));

    };

    /**
     * [savi description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.savi = function(image) {

        var savi = image.expression('(1 + L) * float(nir - red)/(nir + red + L)', {
            'nir': image.select('nir'),
            'red': image.select('red'),
            'L': 0.9
        }).multiply(100).byte();

        return image.addBands(savi.select([0], ["savi"]));

    };

    /**
     * [evi2 description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.evi2 = function(image) {

        var evi2 = image.expression('(2.5 * float(nir - red)/(nir + 2.4 * red + 1))', {
            'nir': image.select('nir'),
            'red': image.select('red'),
        }).multiply(100).byte();

        // valor da multiplicação por 100 gera valores maiores que 200... vai até uns 210.

        return image.addBands(evi2.select([0], ["evi2"]));

    };

    /**
     * [fci description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.fci = function(image) {

        var fci = image.expression('(float(gv - shade)/(gv + shade))', {
            'gv': image.select('gv'),
            'shade': image.select('shade'),
        }).multiply(100).add(100).byte();

        return image.addBands(fci.select([0], ["fci"]));

    };

    /**
     * [npv+soil description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.npvsoil = function(image) {

        var npvsoil = image.expression('npv + soil', {
            'npv': image.select('npv'),
            'soil': image.select('soil'),
        }).byte();

        return image.addBands(npvsoil.select([0], ["npvsoil"]));

    };

    /**
     * [gv+npvs description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.gvnpvs = function(image) {

        var gvnpvs = image.expression('100 * float(gv + npv) / float(100 - shade)', {
            'gv': image.select('gv'),
            'npv': image.select('npv'),
            'shade': image.select('shade'),
        }).byte();

        return image.addBands(gvnpvs.select([0], ["gvnpvs"]));

    };

    /**
     * [ndfi3 description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    var _this = this;
    this.ndfi3 = function(image) {

        var gvnpvs = _this.gvnpvs(image).select('gvnpvs');
        var soilcloud = image.expression('soil + cloud', {
            'soil': image.select('soil'),
            'cloud': image.select('cloud'),
        }).byte();

        var ndfi3 = ee.Image.cat(gvnpvs, soilcloud).normalizedDifference()
            .multiply(100).add(100).byte();

        return image.addBands(ndfi3.select([0], ["ndfi3"]));
    };

    /**
     * [ndfi4 description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.ndfi4 = function(image) {

        var gvnpv = image.expression('gv + npv', {
            'gv': image.select('gv'),
            'npv': image.select('npv'),
        }).byte();

        var soilshade = image.expression('soil + shade', {
            'soil': image.select('soil'),
            'shade': image.select('shade'),
        }).byte();

        var ndfi4 = ee.Image.cat(gvnpv, soilshade).normalizedDifference()
            .multiply(100).add(100).byte();

        return image.addBands(ndfi4.select([0], ["ndfi4"]));

    };

    this.wvi = function(image) {
        
        var ndvi = image.expression(
          '((nir - red)**2/ (nir + red)**2)**(1/2)', {
            'nir': image.select('nir'),
            'red': image.select('red'),
        });

        var ndwi = image.expression(
          '(( swir1 - green)**2 / (swir1 + green)**2)**(1/2)', {
            'swir1': image.select('swir1'),
            'green': image.select('green'),
        });

        var wvi = image.expression(
          '((NDWI) - (NDVI))/((NDVI)+(NDWI))', {
            'NDVI': ndvi,
            'NDWI': ndwi
        }).multiply(100).add(100).byte();

        return image.addBands(wvi.select([0], ['wvi']));
    };

    /**
     * [getCollection description]
     * @return {[type]} [description]
     */
    this.getCollection = function() {

        return this.collection;
    };

    /**
     * [calculate description]
     * @return {[type]} [description]
     */
    this.calculate = function() {

        this.collection = this.collection
            .map(this.ndvi)
            .map(this.ndwi)
            .map(this.savi)
            .map(this.evi2)
            .map(this.fci)
            .map(this.ndfi3)
            .map(this.ndfi4)
            .map(this.npvsoil)
            .map(this.gvnpvs)
            .map(this.wvi);

    };

    this.init(collection, params);

};

/**
 * [Amplitude description]
 * @param {[type]} collection [description]
 * @param {[type]} params     [description]
 */
var Amplitude = function(collection, params) {
    
    /**
     * [init description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    this.init = function(collection, params) {

        this.collection = collection;
        this.params = params;
        this.amplitude = null;
        this.calculate();

    };

    /**
     * [ndfiAmplitude description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.ndfiAmplitude = function(collection) {

        var coef = 500;
        if (this.params.sensor === 'L8'){
            coef = 1500;
        }

        var image = ee.Image(0).clip(this.params.geometry);

        collection = collection.map(function(image) {
            var msk = image.select('blue').lte(coef);
            return image.updateMask(msk);
        });

        var ndfiMin = collection.select(['ndfi']).min();
        ndfiMin = ndfiMin.updateMask(ndfiMin.gte(1));

        var ndfiMax = collection.select(['ndfi']).max();

        var amplitude = ndfiMax.subtract(ndfiMin).abs();
        amplitude = image.where(amplitude.gte(0), amplitude).byte();
        
        return amplitude.select([0], ["ndfi_amplitude"]);

    };

    /**
     * [calculate description]
     * @return {[type]} [description]
     */
    this.calculate = function() {

        this.amplitude = this.ndfiAmplitude(this.collection);

    };

    this. getData = function() {
        
        return this.amplitude;
    };

    this.init(collection, params);
};

/**
 * [getGrid description]
 * @param  {[type]} gridName [description]
 * @return {[type]}          [description]
 */
var GetGrid = function(json) {

    /**
     * [init description]
     * @param  {[type]} gridName [description]
     * @return {[type]}          [description]
     */
    this.init = function(json) {

        this.json = json;

    };

    /**
     * [getByName description]
     * @param  {[type]} gridName [description]
     * @return {[type]}          [description]
     */
    this.getByName = function(gridName) {

        var feature;

        for (var i in this.json.features) {
            if (this.json.features[i].properties.name === gridName) {

                feature = this.json.features[i];

            }
        }

        return ee.Geometry.LinearRing(
            feature.geometry.coordinates[0]).bounds();


    };

    this.init(json);

};

/**
 * [DecisionTree description]
 * @param {[type]} image [description]
 * @param {[type]} dtree [description]
 */

var DecisionTree = function(image, dtree) {

    this.init = function(image, dtree) {

        this.image = image;
        this.dtree = dtree;

        this._setVariables();
        this._classify();
    };

    /**
     * [_setVariables description]
     */

    this._setVariables = function() {

        if (this.image !== null) {
            this.variables = {
                "red": this.image.select(["red"]),
                "green": this.image.select(["green"]),
                "blue": this.image.select(["blue"]),
                "nir": this.image.select(["nir"]),
                "swir1": this.image.select(["swir1"]),
                "swir2": this.image.select(["swir2"]),
                "thermal": this.image.select(["thermal"]),
                "gv": this.image.select(["gv"]),
                "gvs": this.image.select(["gvs"]),
                "npv": this.image.select(["npv"]),
                "soil": this.image.select(["soil"]),
                "cloud": this.image.select(["cloud"]),
                "shade": this.image.select(["shade"]),
                "ndfi": this.image.select(["ndfi"]),
                "ndfi3": this.image.select(["ndfi3"]),
                "ndfi4": this.image.select(["ndfi4"]),
                "ndvi": this.image.select(["ndvi"]),
                "ndwi": this.image.select(["ndwi"]),
                "evi2": this.image.select(["evi2"]),
                "savi": this.image.select(["savi"]),
                "fci": this.image.select(["fci"]),
                "wvi": this.image.select(["wvi"]),
                "npvsoil": this.image.select(["npvsoil"]),
                "gvnpvs": this.image.select(["gvnpvs"]),
                "slope": this.image.select(["slope"]),
                "ndfi_amplitude": this.image.select(["ndfi_amplitude"]),
                "water_mask": this.image.select(["water_mask"]),
                "cloud_mask": this.image.select(["cloud_mask"]),
                "shade_mask": this.image.select(["shade_mask"]),
            };
        }
    };

    /**
     * [_applyRule description]
     * @param  {[type]} rule [description]
     * @return {[type]}      [description]
     */

    this._applyRule = function(rule) {

        var variable = this.variables[rule.variable];
        var result;

        if (rule.operator === ">") {
            result = variable.gt(rule.thresh);

        } else if (rule.operator === ">=") {
            result = variable.gte(rule.thresh);

        } else if (rule.operator === "<") {
            result = variable.lt(rule.thresh);

        } else if (rule.operator === "<=") {
            result = variable.lte(rule.thresh);

        } else if (rule.operator === "=") {
            result = variable.eq(rule.thresh);

        } else if (rule.operator === "!=") {
            result = variable.neq(rule.thresh);

        } else {
            result = null;
        }

        return result;
    };

    /**
     * [_recursion description]
     * @param  {[type]} node           [description]
     * @param  {[type]} mask           [description]
     * @param  {[type]} classification [description]
     * @return {[type]}                [description]
     */

    this._recursion = function(node, mask, classification) {

        var result;

        if (this.dtree[node].kind === "decision") {

            // apply rule
            result = this._applyRule(this.dtree[node].rule);

            // not agree
            var node1 = String(this.dtree[node].children[0].level) + "-" +
                String(this.dtree[node].children[0].position);

            // agree
            var node2 = String(this.dtree[node].children[1].level) + "-" +
                String(this.dtree[node].children[1].position);

            var result1 = this._recursion(node1, result.eq(
                0).multiply(mask), classification); // not agree

            var result2 = this._recursion(node2, result.eq(
                1).multiply(mask), classification); // agree

            classification = result1.add(result2);
        } else {
            classification = classification.where(mask.eq(1).and(
                classification.eq(0)), this.dtree[node].class.value);
        }

        return classification;
    };

    /**
     * [_classify description]
     * @return {[type]} [description]
     */

    this._classify = function() {

        this.classification = this._recursion("1-1", ee.Image(1), ee.Image(0))
            .select([0], ["classification"]);

    };

    /**
     * [getData description]
     * @return {[type]} [description]
     */
    this.getData = function() {

        return this.classification;
    };

    this.init(image, dtree);
};

/**
 * [json of the grids. This is for test]
 * @type {Object}
 */
var cartas = {
    "type": "FeatureCollection",
    "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
    },

    "features": [{
        "type": "Feature",
        "properties": {
            "name": "SD-21-V-C"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-58.500445, -14.000424],
                    [-60.000452, -14.000421],
                    [-60.00045, -13.000418],
                    [-58.500443, -13.000421],
                    [-58.500445, -14.000424]
                ]
            ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "SB-24-Z-D"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-37.545308, -8.045424],
                    [-37.545308, -6.955417],
                    [-35.955296, -6.955417],
                    [-35.955296, -8.045424],
                    [-37.545308, -8.045424]
                ]
            ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "SB-24-Z-B"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-37.545307, -7.045418],
                    [-37.545307, -5.955411],
                    [-35.955295, -5.955411],
                    [-35.955295, -7.045418],
                    [-37.545307, -7.045418]
                ]
            ]
        }
    }]
};

/**
 * [MapbiomasService description]
 * @param {[type]} params [description]
 * @param {[type]} dtree  [description]
 */
var MapbiomasService = function(params, dtree, sFilter, allLayers) {

    this.options = {

        "layersRGB": {

            "classification": {
                "bands": 'classification',
                "min": 0,
                "max": 32,
                "palette": "129912,1f4423,006400,00ff00,65c24b," +
                    "687537,29eee4,77a605,935132,ffe599,45c2a5," +
                    "f1c232,b8af4f,ffffb2,ffd966,ffe599,f6b26b," +
                    "e974ed,d5a6bd,c27ba0,a64d79,ea9999,cc4125," +
                    "dd7e6b,e6b8af,980000,999999,b7b7b7,434343," +
                    "d9d9d9,0000ff,d5d5e5",
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
                "palette": null,
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
     * [_run description]
     * @return {[type]} [description]
     */

    this._run = function() {

        var params = this.params;
        params.t0 = this.params.year + "-01-01";
        params.t1 = this.params.year + "-12-31";
        
        var col = new Collection(params);
        var sma = new SMA(col.getCollection(), params);
        var mask = new Mask(sma.getCollection(), params);
        var ndfi = new NDFI(mask.getCollection(), params);
        var ind = new Indexes(ndfi.getCollection(), params);
        
        var collection = ind.getCollection();
        
        var ndfiAmplitude = new Amplitude(collection, params).getData();

        collection = collection.filterDate(this.params.t0, this.params.t1);
        var comp = new Composite(collection);

        this.composite = comp.Median()
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
          .clip(this.params.geometry);

        var dt = new DecisionTree(this.composite, this.dtree);
        this.classification = dt.getData().clip(this.params.geometry);

        this.options.layersRGB.ndfirgb.palette = ndfi.palette;

    };

    this.init(params, dtree, sFilter, allLayers);

};

/**
 * [test description]
 * @return {[type]} [description]
 */
var test = function() {

    var params = {
        "year": "2008",
        "carta": "SD-21-V-C",
        "t0": "2008-06-01",
        "t1": "2008-12-31",
        "cloudcover": 30,
        "sensor": "L5",
        "bioma": "CAATINGA",
        "region": "",
        "geometry": null
    };

    // Decision tree
    var dtree = {
        "1-1": {
            "kind": "decision",
            "rule": {
                "variable": "water_mask",
                "operator": ">",
                "thresh": 0
            },
            "node": {
                "level": 1,
                "position": 1
            },
            "children": [{
                "level": 2,
                "position": 1
            }, {
                "level": 2,
                "position": 2
            }],
            "class": null
        },
        "2-1": {
            "kind": "decision",
            "rule": {
                "variable": "ndfi",
                "operator": ">=",
                "thresh": 200
            },
            "node": {
                "level": 2,
                "position": 1
            },
            "children": [{
                "level": 3,
                "position": 1
            }, {
                "level": 3,
                "position": 2
            }],
            "class": null
        },
        "2-2": {
            "kind": "class",
            "rule": null,
            "node": {
                "level": 2,
                "position": 2
            },
            "children": null,
            "class": {
                "value": 3,
                "name": "agua",
                "color": "0000FF"
            }
        },
        "3-1": {
            "kind": "decision",
            "rule": {
                "variable": "gvs",
                "operator": ">=",
                "thresh": 55
            },
            "node": {
                "level": 3,
                "position": 1
            },
            "children": [{
                "level": 4,
                "position": 1
            }, {
                "level": 4,
                "position": 2
            }],
            "class": null
        },
        "3-2": {
            "kind": "class",
            "rule": null,
            "node": {
                "level": 3,
                "position": 2
            },
            "children": null,
            "class": {
                "value": 1,
                "name": "floresta",
                "color": "00AA00"
            }
        },
        "4-1": {
            "kind": "class",
            "rule": null,
            "node": {
                "level": 4,
                "position": 1
            },
            "children": null,
            "class": {
                "value": 2,
                "name": "nao-floresta",
                "color": "000000"
            }
        },
        "4-2": {
            "kind": "decision",
            "rule": {
                "variable": "gv",
                "operator": ">=",
                "thresh": 55
            },
            "node": {
                "level": 4,
                "position": 2
            },
            "children": [{
                "level": 5,
                "position": 3
            }, {
                "level": 5,
                "position": 4
            }],
            "class": null
        },
        "5-3": {
            "kind": "decision",
            "rule": {
                "variable": "ndfi",
                "operator": "<=",
                "thresh": 185
            },
            "node": {
                "level": 5,
                "position": 3
            },
            "children": [{
                "level": 6,
                "position": 5
            }, {
                "level": 6,
                "position": 6
            }],
            "class": null
        },
        "5-4": {
            "kind": "class",
            "rule": null,
            "node": {
                "level": 5,
                "position": 4
            },
            "children": null,
            "class": {
                "value": 2,
                "name": "nao-floresta",
                "color": "000000"
            }
        },
        "6-5": {
            "kind": "class",
            "rule": null,
            "node": {
                "level": 6,
                "position": 5
            },
            "children": null,
            "class": {
                "value": 1,
                "name": "floresta",
                "color": "006630"
            }
        },
        "6-6": {
            "kind": "class",
            "rule": null,
            "node": {
                "level": 6,
                "position": 6
            },
            "children": null,
            "class": {
                "value": 2,
                "name": "nao-floresta",
                "color": "000000"
            }
        }
    };

    // start mapbiomas service
    var mbs = new MapbiomasService(params, dtree, false, true);

    // get mapids in groups
    // var mapids = mbs.getGroupsMapIds();
    // get mapids
    // var mapids = mbs.getMapIds();

    // console.log(mapids);
    print(mbs.getComposite());

    var data = mbs.getClassif();

    Map.addLayer(data, mbs.options.layersRGB.classification);

    Map.centerObject(data);
};

test();