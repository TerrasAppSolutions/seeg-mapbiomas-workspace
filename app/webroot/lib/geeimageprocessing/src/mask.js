/**
 * [Mask description]
 * @param {[type]} col [description]
 */
var Mask = function(col) {

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

    this.terrain = ee.call('Terrain', ee.Image('USGS/SRTMGL1_003'));

    /**
     * [init description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    this.init = function(col) {

        if (col !== null) {
            this.col = col;
        }

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

    /**
     * [_make description]
     * @return {[type]} [description]
     */
    this._make = function() {

        this.collection = this.col.getCollection()
            .map(this.cloudMask)
            .map(this.shadeMask)
            .map(this.hillShadeMask)
            .map(this.waterMask);

    };

    /**
     * [getCollection description]
     * @return {[type]} [description]
     */
    this.getCollection = function() {

        return this.collection;
    };

    this.init(col);

};