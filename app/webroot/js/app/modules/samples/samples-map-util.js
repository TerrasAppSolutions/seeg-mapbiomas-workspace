/**
 * @namespace app.service.SamplesMapUtil
 * @description Servico camadas do externas
 */
(function () {

	'use strict';

	angular.module('MapBiomas.samples').service('SamplesMapUtil', SamplesMapUtil);

	SamplesMapUtil.$inject = ['AppConfig'];

	function SamplesMapUtil(AppConfig) {

		var service = {
			randomPoints: randomPoints
		};

		return service;

		function randomPoints(layer, qtd) {
			
			
			var polygon = {
                  "type": "FeatureCollection",
                  "features":[layer.toGeoJSON()]
                };
			
			var points = randomPointsModule(polygon, qtd);

			
			return  L.geoJson(points);

		};


		function randomPointsModule (polygon, n_points) {

			var points = {
				"type": "FeatureCollection",
				"features": []
			};

			var latlngs= turf.coordAll(polygon);
			var poly = turf.polygon([latlngs]);

			var count = Math.round(parseFloat(n_points));
			for (var i = 1; i <= count; i++) {

				var bbox = turf.bbox(polygon);


				var point_temp = turf.random('points', 1, {
					bbox: bbox
				});
				var latlong = turf.coordAll(point_temp);

				var pt = turf.point(latlong[0]);

				var inside = turf.inside(pt, poly);
				if (inside === true) {
					points.features.push(pt);
				}
				if (inside === false) {

					i = --i;
				}


			}

			return points;
		}
	}
})();