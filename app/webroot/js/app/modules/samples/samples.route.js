/** 
 * @namespace MapBiomas.samples.route
 * @description Módulo route de samples
 */
(function () {
    'use strict';

    angular.module('MapBiomas.samples')
        .config(config);

    config.$inject = ['$routeProvider', '$stateProvider', '$urlRouterProvider'];

    function config($routeProvider, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('samples', {
                url: '/samples',
                views: {
                    '': {
                        templateUrl: 'js/app/modules/samples/samples.html'
                    },
                    'panel-right@samples': {
                        templateUrl: 'js/app/modules/samples/samples-panel-right.html',
                    }
                }
            });
    };
})();