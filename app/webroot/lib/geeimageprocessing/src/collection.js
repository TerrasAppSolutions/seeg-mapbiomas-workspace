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
                'id': 'LT5_L1T_TOA',
                'bandNames': ['B6'],
                'newNames': ['thermal'],
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
                'id': 'LE7_L1T_TOA',
                'bandNames': ['B6_VCID_1'],
                'newNames': ['thermal'],
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
                'id': 'LC8_L1T_TOA',
                'bandNames': ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10'],
                'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'thermal'],
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