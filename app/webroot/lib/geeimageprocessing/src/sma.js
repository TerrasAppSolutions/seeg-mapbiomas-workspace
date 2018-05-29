/**
 * [SMA description]
 */
var SMA = function(col) {

    this.bandNames = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
    this.outBandNames = ['gv', 'npv', 'soil', 'cloud'];

    // Endmembers
    var atm = [805.6, 458.1, 286.8, 168.3, 46.8, 26.6];
    var gv = [119.0, 475.0, 169.0, 6250.0, 2399.0, 675.0];
    var npv = [1514.0, 1597.0, 1421.0, 3053.0, 7707.0, 1975.0];
    var soil = [1799.0, 2479.0, 3158.0, 5437.0, 7707.0, 6646.0];
    var cloud = [4031.0, 8714.0, 7900.0, 8989.0, 7002.0, 6607.0];

    this.spectralLib = {};
    this.spectralLib.LX = [gv, npv, soil, cloud];

    atm.forEach(function(item, index) {
        gv[index] += item;
        npv[index] += item;
        soil[index] += item;
        cloud[index] += item;
    });

    this.spectralLib.L8 = [gv, npv, soil, cloud];

    /**
     * [init description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    this.init = function(col) {

        this.col = col;
        this.calculate();

    };

    /**
     * [setSpectralLib description]
     */
    this.setSpectralLib = function() {

        if (this.col.params.sensor === "L8") {
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

        var coef = 1;
        if (_this.col.params.sensor === "L8") {
            coef = 10000;
        }

        // Uminxing data
        var fractions = ee.Image(image)
            .select(_this.bandNames)
            .multiply(coef)
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

        var summed = image.select(['gv', 'npv', 'soil', 'cloud'])
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

        this.collection = this.col.getCollection()
            .map(this.calcFractions)
            .map(this.calcGVS);
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