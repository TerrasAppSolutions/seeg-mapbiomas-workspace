'use strict';
angular.module('MapBiomasApp', [
    'MapBiomas', 'ngMaterial', 'pascalprecht.translate'
]).config(['$routeProvider', '$stateProvider', '$urlRouterProvider', '$mdThemingProvider', 'pikadayConfigProvider', '$translateProvider',
    function ($routeProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, pikaday, $translateProvider) {


        $mdThemingProvider.theme('default')
            .primaryPalette('teal', {
                'default': '500'
            })
            .accentPalette('blue', {
                'default': '300'
            });

        $stateProvider
            .state("map", {
                url: "/",
                controller: 'MapBiomasController',
                templateUrl: "js/app/views/workmap/workmap.html"
            });

        $urlRouterProvider.otherwise('/');


        pikaday.setConfig({
            format: "DD/MM/YYYY"
                //format: "YYYY-MM-DD"
        });

        angular.forEach(langs, function (lang, key) {              
              $translateProvider.translations(key, lang);
        });

        $translateProvider.preferredLanguage('en');
    }
]).run(['$rootScope', '$injector',
    function ($rootScope, $injector) {
        var AppAuth = $injector.get('AppAuth');
        var AppConfig = $injector.get('AppConfig');
    }
]);
