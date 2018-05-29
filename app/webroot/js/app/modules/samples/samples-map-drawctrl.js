/**
 * @namespace MapBiomas.samples.SamplesMapDrawCtrl
 * @description Classe de controles do mapa de desenho
 */
(function () {

	'use strict';

	var $injector;

	angular.module('MapBiomas.samples').service('SamplesMapDrawCtrl', ['$injector', function (injector) {
		$injector = injector;
		return SamplesMapDrawCtrl;
	}]);

	function SamplesMapDrawCtrl(map) {

		var _this = this;

		var SamplesMapUtil = $injector.get('SamplesMapUtil');

		/**
		 * Camada de poligonos desenhados no mapa
		 * @private
		 * @type {L.FeatureGroup}
		 */
		var drawnLayer = new L.FeatureGroup();

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
		 * Executa quando uma camada é desenhada
		 * @private
		 * @type {Function}
		 */
		var onDrawnEvent;


		/**
		 * Inicia controles do mapa
		 */
		function init() {

			// Inicia controle de desenho
			drawControl = new L.Control.Draw({
				draw: {
					polyline: false,
					polygon: {
						allowIntersection: false,
						showArea: true
					},
					circle: false,
					rectangle: {
						showArea: true
					},
					marker: false
				},
				edit: {
					featureGroup: drawnLayer,
					edit: false,
					remove: false
				}
			});

			// adiciona camada de poligonos desenhados
			map.addLayer(drawnLayer);

			// configura evento de criação de poligono
			map.on('draw:created', function (e) {

				var layer = e.layer;

				drawnLayer.clearLayers()

				// adiciona camada desenhada
				drawnLayer.addLayer(layer);
				// defini estilo da camada desenhada
				layer.setStyle(styles.drawnLayer);

				// gera pontos aleatorios a partir da camada desenhada
				var points = SamplesMapUtil.randomPoints(layer, 100);
				// adiciona os pontos gerados
				drawnLayer.addLayer(points);

				// dispara eventos de camada desenhada
				if (onDrawnEvent) {
					onDrawnEvent(layer, points);
				}
			});

			// configura evento de edição de poligono
			map.on('draw:edited', function (e) {
				var layers = e.layers;
				layers.eachLayer(function (layer) {
					console.log('edited: ', layer);
				});
			});

			// adiciona controle de desenho no mapa
			map.addControl(drawControl);
		}

		/**
		 * Oculta controle de desenho
		 */
		function hide() {
			try {
				map.removeControl(drawControl);
			}catch(e){
				// pode ser que o controle nao esteja no mapa
			}
		}

		/**
		 * Exibe controle de desenho
		 */
		function show() {
			hide();
			map.addControl(drawControl);
		}

		/**
		 * Configuta evento de camada desenhada
		 */
		function onDrawn(fn) {
			onDrawnEvent = fn;
		}

		return {
			init: init,
			hide: hide,
			show: show,
			onDrawn: onDrawn
		};
	}
})();