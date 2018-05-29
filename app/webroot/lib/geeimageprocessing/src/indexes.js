/**
 * [Indexes description]
 */
var Indexes = function(col) {

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

        var savi = ee.Image(0).expression('(1 + L) * float(nir - red)/(nir + red + L)', {
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

        var evi2 = ee.Image(0).expression('(2.5 * float(nir - red)/(nir + 2.4 * red + 1))', {
            'nir': image.select('nir'),
            'red': image.select('red'),
        }).multiply(100).byte();

        // valor da multiplicação por 100 gera valores maiores que 200... vai até uns 210.

        return image.addBands(evi2.select([0], ["evi2"]));

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

        this.collection = this.col.getCollection()
            .map(this.ndvi)
            .map(this.ndwi)
            .map(this.savi)
            .map(this.evi2);

    };

    this.init(col);

};