/**
 * @namespace MapBiomas.samples.SamplesMapDirective
 * @description Componente de mapa de amostras
 */
(function () {
    'use strict';

    angular
        .module('MapBiomas.samples')
        .directive('samplesMap', SamplesMapDirective);

    SamplesMapDirective.$inject = [];

    function SamplesMapDirective() {

        var directive = {
            restrict: 'EA',
            transclude: true,
            controller: 'SamplesMapController',
            link: SamplesMapLink,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /**
         * Logica de visualização da directiva
         * @param  {Object} $scope  angular scope
         * @param  {Object} element angular element
         * @param  {Object} attrs   angular element attrs
         */
        function SamplesMapLink($scope, element, attrs) {

            var vm = $scope.vm;

            element.css({
                'height': '100%',
                'width': '100%',
            });


            // inicia mapa                    
            var $wgisWorkmap = $(element).wgis({
                osm: false,
                google: false,
                switchLayer: false,
                height: '100%',
                lmap: {
                    center: [-14.264383087562635, -59.0625],
                    zoom: 5,
                    minZoom: 5,
                    maxZoom: 15,
                    touchZoom: true,
                    scrollWheelZoom: true,
                    doubleClickZoom: true,
                    boxZoom: true,
                    zoomControl: true
                }
            });

            vm.init($wgisWorkmap._wgis.lmap);
        }
    }
})();