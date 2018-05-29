(function () {
    'use strict';

    angular
        .module('MapBiomas.widgets')
        .directive('widgetAltitudeGradient', widgetAltitudeGradient);

    function widgetAltitudeGradient() {

        /*
         * Parametros da diretiva
         */
        var directive = {
            restrict: 'A',
            link: widgetAltitudeGradientLink,
        };

        return directive;

        function widgetAltitudeGradientLink(scope, element, attrs) {
            console.log("TESTEEEE");
        }
    }
})();
