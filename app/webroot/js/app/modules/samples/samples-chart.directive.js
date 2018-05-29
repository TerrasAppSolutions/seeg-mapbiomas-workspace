/**
 * @namespace MapBiomas.samples.samplesChartClasses
 * @description Componente de grafico classe de amostras
 */
(function () {
    'use strict';

    angular
        .module('MapBiomas.samples')
        .directive('samplesChartClasses', samplesChartClasses);

    samplesChartClasses.$inject = [];

    function samplesChartClasses() {

        var template = '<canvas style="height:250px"></canvas>';

        var directive = {
            template: template,
            replace: true,
            restrict: 'EA',            
            link: SamplesChartClassesLink,
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
        function SamplesChartClassesLink($scope, element, attrs) {

            var vm = $scope.vm;

            element.css({
                'margin':"20px 0 0 0",
                'height': '100%',
                'width': '100%',
            });

            var randomScalingFactor = function () {
                return Math.round(Math.random() * 100);
            };

            var config = {
                type: 'pie',
                data: {
                    datasets: [{
                        data: [
                            randomScalingFactor(),
                            randomScalingFactor(),
                            randomScalingFactor(),
                            randomScalingFactor()
                        ],
                        backgroundColor: [
                            '#129912',
                            '#BBFCAC',
                            '#FFC278',
                            '#EA9999'
                        ],
                        label: 'Classes'
                    }],
                    labels: [
                        "1.1 Formações Florestais Naturais",
                        "2 Formações Naturais não Florestais",
                        "3 Uso Agropecuário",
                        "4 Áreas não vegetadas"
                    ]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'bottom'
                    }
                }
            };
            var ctx = element[0].getContext("2d");
            var myPie = new Chart(ctx, config);
        }
    }
})();