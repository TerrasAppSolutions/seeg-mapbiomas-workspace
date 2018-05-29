/**
 * [Collection description]
 * @param {[type]} params [description]
 */
var Collection = function (params) {

    this.options = {
        'L5': {
            'sr': {
                'id': 'LANDSAT/LT05/C01/T1_SR',
                'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'B6', 'pixel_qa'],
                'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'thermal', 'pixel_qa'],
                'coefficient': 1
            },
        },
        'L7': {
            'sr': {
                'id': 'LANDSAT/LE07/C01/T1_SR',
                'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'B6', 'pixel_qa'],
                'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'thermal', 'pixel_qa'],
                'coefficient': 1
            },
        },
        'L8': {
            'sr': {
                'id': 'LANDSAT/LC08/C01/T1_SR',
                'bandNames': ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'pixel_qa'],
                'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'thermal', 'pixel_qa'],
                'coefficient': 1
            },
        },
    };

    /**
     * [init description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    this.init = function (params) {

        this.params = params;
        this.filterParams();

    };

    /**
     * [imageCollection description]
     * @param  {[type]} collectionID [description]
     * @return {[type]}              [description]
     */
    this.imageCollection = function (collectionID) {

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
    this.filterBySensor = function () {

        var collection = null;

        switch (this.params.sensor) {
            case "L5":
                collection = this.imageCollection(this.options.L5.sr.id)
                    .select(
                    this.options.L5.sr.bandNames,
                    this.options.L5.sr.newNames
                    );
                break;
            case "L7":
                collection = this.imageCollection(this.options.L7.sr.id)
                    .select(
                    this.options.L7.sr.bandNames,
                    this.options.L7.sr.newNames
                    );
                break;
            case "LX":
                var L5 = this.imageCollection(this.options.L5.sr.id)
                    .select(
                    this.options.L5.sr.bandNames,
                    this.options.L5.sr.newNames
                    );

                var L7 = this.imageCollection(this.options.L7.sr.id)
                    .select(
                    this.options.L7.sr.bandNames,
                    this.options.L7.sr.newNames
                    );

                collection = ee.ImageCollection(L5.merge(L7)).sort('DATE_ACQUIRED');
                break;

            case "L8":
                collection = this.imageCollection(this.options.L8.sr.id)
                    .select(
                    this.options.L8.sr.bandNames,
                    this.options.L8.sr.newNames
                    );
        }

        return collection;
    };

    /**
     * [edgeRemoval description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.edgeRemoval = function (image) {

        var edgeSize = -5500.0;

        image = image.clip(
            image.geometry()
                .buffer(edgeSize)
                .simplify(1)
        );

        return image;
    };

    /**
     * [filterParams description]
     * @return {[type]} [description]
     */
    this.filterParams = function () {

        this.collection = this.filterBySensor()
            .map(this.edgeRemoval);

    };

    /**
     * [getCollection description]
     * @return {[type]} [description]
     */
    this.getCollection = function () {

        return this.collection;
    };

    this.init(params);
};

/**
 * [SMA description]
 */
var SMA = function (collection, params) {

    this.bandNames = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
    this.outBandNames = ['gv', 'npv', 'soil', 'cloud'];

    this.spectralLib = {
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
        ]
    };

    /**
     * [init description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    this.init = function (collection, params) {

        this.collection = collection;
        this.params = params;
        this.calculate();

    };

    /**
     * [setSpectralLib description]
     */
    this.setSpectralLib = function () {

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
    this.calcFractions = function (image) {

        // Uminxing data
        var fractions = ee.Image(image)
            .select(_this.bandNames)
            // .multiply(coef)
            .unmix(_this.endmembers)
            .max(0)
            .multiply(100)
            .byte();

        fractions = fractions.rename(_this.outBandNames);

        return image.addBands(fractions);

    };

    /**
     * [calcGVS description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.calcGVS = function (image) {

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
    this.calculate = function () {

        this.setSpectralLib();

        this.collection = this.collection.map(this.calcFractions)
            .map(this.calcGVS);
    };

    /**
     * [getCollection description]
     * @return {[type]} [description]
     */
    this.getCollection = function () {

        return this.collection;
    };

    this.init(collection, params);
};

/**
 * [NDFI description]
 * @param {[type]} col [description]
 */
var NDFI = function (collection, params) {

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
    this.init = function (collection, params) {

        this.collection = collection;
        this.params = params;
        this.calculate();

    };

    /**
     * [calcNDFI description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.calcNDFI = function (image) {

        var gvs = image.select("gvs");

        var npvSoil = image.select("npv")
            .add(image.select("soil"));
        // .add(image.select("cloud"));

        var ndfi = ee.Image.cat(gvs, npvSoil).normalizedDifference();

        // rescale NDFI from 0 until 200
        ndfi = ndfi.multiply(100).add(100).byte();

        return image.addBands(ndfi.select([0], ["ndfi"]));

    };

    /**
     * [calculate description]
     * @return {[type]} [description]
     */
    this.calculate = function () {
        console.log(ee.Image(this.collection.first()).bandNames().getInfo())
        this.collection = this.collection.map(this.calcNDFI);

    };

    /**
     * [getCollection description]
     * @return {[type]} [description]
     */
    this.getCollection = function () {

        return this.collection;
    };

    this.init(collection, params);

};

/**
 * [Mask description]
 * @param {[type]} col [description]
 */
var Mask = function (collection, params) {

    this.options = {
        /**
         * pixel QA bit values
         */
        'bitValue': {
            /*bit 0*/ "fill": 1,
            /*bit 1*/ "clear": 2,
            /*bit 2*/ "water": 4,
            /*bit 3*/ "cloudShadow": 8,
            /*bit 4*/ "snow": 16,
            /*bit 5*/ "cloud": 32
        },
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
        },
    };

    /**
     * [init description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    this.init = function (collection, params) {

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
    this._hillShadow = function (terrain, sunAzimuth, sunElevation) {

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
    this.hillShadeMask = function (image) {

        var sunAzimuth = image.get('SOLAR_AZIMUTH_ANGLE');
        var sunElevation = ee.Number(90).subtract(image.get('SOLAR_ZENITH_ANGLE'));

        var hillshadow = _this._hillShadow(_this.terrain, sunAzimuth, sunElevation);

        return image.addBands(hillshadow.select([0], ['hillshade_mask']));

    };

    /**
     * [cloudMask description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.cloudMask = function (image) {

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
    this.shadeMask = function (image) {

        var sunAzimuth = image.get('SOLAR_AZIMUTH_ANGLE');
        var sunElevation = ee.Number(90).subtract(image.get('SOLAR_ZENITH_ANGLE'));
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
    this.waterMask = function (image) {

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

    var _this = this;
    this.cfmask = function (image) {

        var pixelQA = image.select(['pixel_qa']);
        var srCloudQA = image.select(['sr_cloud_qa']);

        var cloudMask = pixelQA.bitwiseAnd(_this.options.bitValue.cloud).neq(0);
        var waterMask = pixelQA.bitwiseAnd(_this.options.bitValue.water).neq(0);
        var shadeMask = pixelQA.bitwiseAnd(_this.options.bitValue.cloudShadow).neq(0);

        return image
            .addBands(cloudMask.rename(['cloud_mask']))
            .addBands(shadeMask.rename(['shade_mask']))
            .addBands(waterMask.rename(['water_mask']));
    };

    /**
     * [_make description]
     * @return {[type]} [description]
     */
    this._make = function () {

        this.collection = this.collection.map(this.hillShadeMask)
            .map(this.cfmask);
        // .map(this.cloudMask)
        // .map(this.shadeMask)
        // .map(this.hillShadeMask)
        // .map(this.waterMask);

    };

    /**
     * [getCollection description]
     * @return {[type]} [description]
     */
    this.getCollection = function () {

        return this.collection;
    };

    this.init(collection, params);

};

/**
 * [Composite description]
 * @param {[type]} collection [description]
 */
var Composite = function (collection) {

    this.composite = null;

    /**
     * [init description]
     * @param  {[type]} collection [description]
     * @return {[type]}            [description]
     */
    this.init = function (collection) {

        if (collection !== null) {

            this.collection = collection.map(this.cloudFree);

        }

    };

    /**
     * [cloudFree description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.cloudFree = function (image) {

        var cloudMask = image.select(['cloud_mask']);
        var shadeMask = image.select(['shade_mask']);

        var csm = cloudMask.add(shadeMask).gte(1);

        return image.mask(csm.neq(1));

    };

    /**
     * [median description]
     * @return {[type]} [description]
     */
    this.Median = function () {

        this.composite = this.collection.median()
            .addBands(this.waterAdjust(), ['water_mask'], true);

        return this.composite;

    };

    /**
     * [waterAdjust description]
     * @return {[type]} [description]
     */
    this.waterAdjust = function () {

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
var Indexes = function (collection, params) {

    /**
     * [init description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    this.init = function (collection, params) {

        this.collection = collection;
        this.params = params;
        this.calculate();

    };

    /**
     * [ndvi description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    this.ndvi = function (image) {

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
    this.ndwi = function (image) {

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
    this.savi = function (image) {

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
    this.evi2 = function (image) {

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
    this.fci = function (image) {

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
    this.npvsoil = function (image) {

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
    this.gvnpvs = function (image) {

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
    this.ndfi3 = function (image) {

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
    this.ndfi4 = function (image) {

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

    this.wvi = function (image) {

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
    this.getCollection = function () {

        return this.collection;
    };

    /**
     * [calculate description]
     * @return {[type]} [description]
     */
    this.calculate = function () {

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
var Amplitude = function (collection, params) {

    /**
     * [init description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    this.init = function (collection, params) {

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
    this.ndfiAmplitude = function (collection) {

        var coef = 500;
        if (this.params.sensor === 'L8') {
            coef = 1500;
        }

        var image = ee.Image(0).clip(this.params.geometry);

        collection = collection.map(function (image) {
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
    this.calculate = function () {

        this.amplitude = this.ndfiAmplitude(this.collection);

    };

    this.getData = function () {

        return this.amplitude;
    };

    this.init(collection, params);
};

/**
 * [getGrid description]
 * @param  {[type]} gridName [description]
 * @return {[type]}          [description]
 */
var GetGrid = function (json) {

    /**
     * [init description]
     * @param  {[type]} gridName [description]
     * @return {[type]}          [description]
     */
    this.init = function (json) {

        this.json = json;

    };

    /**
     * [getByName description]
     * @param  {[type]} gridName [description]
     * @return {[type]}          [description]
     */
    this.getByName = function (gridName) {

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

var DecisionTree = function (image, dtree) {

    this.init = function (image, dtree) {

        this.image = image;
        this.dtree = dtree;

        this._setVariables();
        this._classify();
    };

    /**
     * [_setVariables description]
     */

    this._setVariables = function () {

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

    this._applyRule = function (rule) {

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

    this._recursion = function (node, mask, classification) {

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

    this._classify = function () {

        this.classification = this._recursion("1-1", ee.Image(1), ee.Image(0))
            .select([0], ["classification"]);

    };

    /**
     * [getData description]
     * @return {[type]} [description]
     */
    this.getData = function () {

        return this.classification;
    };

    this.init(image, dtree);
};