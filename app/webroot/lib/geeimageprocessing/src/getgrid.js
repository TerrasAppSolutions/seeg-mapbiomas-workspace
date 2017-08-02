/**
 * [getGrid description]
 * @param  {[type]} gridName [description]
 * @return {[type]}          [description]
 */
var GetGrid = function() {

    this.jsonName = '/geodata/cartas_5km.geojson';

    /**
     * [init description]
     * @param  {[type]} gridName [description]
     * @return {[type]}          [description]
     */
    this.init = function() {

    };

    this.getByName = function(gridName) {

        var feature;

        for (var i in json.features) {
            if (json.features[i].properties.name === gridName) {

                feature = json.features[i];

            }
        }

        return ee.Geometry.LinearRing(
            feature.geometry.coordinates[0]).bounds();


    };

    this.init();

};