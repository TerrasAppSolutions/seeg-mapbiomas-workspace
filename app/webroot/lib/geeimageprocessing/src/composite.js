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