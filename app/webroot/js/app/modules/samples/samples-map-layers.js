/**
 * @namespace MapBiomas.samples.SamplesMapLayers
 * @description Camadas do mapa de desenho de amostras
 */
(function () {

	'use strict';

	var $injector;

	angular.module('MapBiomas.samples').service('SamplesMapLayers', ['$injector',
		function (injector) {
			$injector = injector;
			return SamplesMapLayers;
		}
	]);

	function SamplesMapLayers(map) {

		var SamplesMapUtil = $injector.get('SamplesMapUtil');

		/**
		 * Camada de cartas do mapa
		 * @private
		 * @type {L.GeoJson}
		 */
		var cartasLayers;


		/**
		 * Objetos de estilos de camadas
		 * @private
		 * @type {Object}
		 */
		var styles = {
			"drawnLayer": {
				"color": "#72C2DB",
				"weight": 2.0,
				"opacity": 1,
				"fillOpacity": 0.1
			}
		};

		/**
		 * Controles de desenho do mapa
		 * @private
		 * @type {L.Control.Draw}
		 */
		var drawControl;

		/**
		 * Inicia camadas basicas do componentes
		 */
		function init() {
			initGridLayer();
		}

		/**
		 * Inicia camadas basicas do componentes
		 */
		function initGridLayer() {
			// adiciona camada google
			var googleTerrain = new L.Google('SATELLITE');
			map.addLayer(googleTerrain);

			// camada de cartas                     
			cartasLayers = L.geoJson(cartas, {
				style: {
					"color": "#78b569",
					"weight": 0.5,
					"opacity": 0.1,
					"fillOpacity": 0,
				}
			});

			map.addLayer(cartasLayers);

			map.fitBounds(cartasLayers.getBounds());

			// evento de dbclick na camada de cartas
			cartasLayers.on('dblclick', function (e) {
				var gridCode = e.layer.feature.properties.name;
				selectLayerGrid(cartasLayers, gridCode);
			});
		}

		/**
		 * Seleciona visualmente (style) uma carta pelo codigo
		 * @param  {String} gridCode codigo da carta
		 * @return {L.Layer} Tile Layer do Leaflet
		 */
		function selectLayerGrid(gridLayer, gridCode) {

			var styles = {
				default: {
					"color": "#78b569",
					"weight": 0.5,
					"opacity": 0.1,
					"fillOpacity": 0,
				},
				selected: {
					"color": "#ffff00",
					"weight": 2.0,
					"opacity": 1,
					"fillOpacity": 0.0
				}
			};

			var gridSelected;

			gridLayer.getLayers().forEach(function (layer) {
				if (layer.feature.properties.name == gridCode) {
					gridSelected = layer;
				}
			});

			gridLayer.setStyle(styles.default);

			gridSelected.setStyle(styles.selected);

			if (gridLayer._map) {
				gridLayer._map.fitBounds(gridSelected.getBounds(), {
					maxZoom: 9
				});
			}
		}


		return {
			init: init
		};
	}
})();