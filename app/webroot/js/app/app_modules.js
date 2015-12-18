'use strict';

// Módulo de Plugins
angular.module('MapBiomas.plugins', [
    'ngSanitize',
    'ngAnimate',
    'ngRoute',
    'ui.router',
    'ui.slider',
    'ngMaterial',
    'pascalprecht.translate',
    'pikaday'
]);

// Módulo de diretivas
angular.module('MapBiomas.directives', []);

// Módulo de filtros
angular.module('MapBiomas.filters', []);

// Módulo utils
angular.module('MapBiomas.utils', []);

// MapBiomas servicos
angular.module('MapBiomas.services', ['ngResource']);

// MapBiomas controles
angular.module('MapBiomas.controllers', []);
//joao
/*
 * Modulo MapBiomas
 */
angular.module('MapBiomas', [
    'MapBiomas.plugins',
    'MapBiomas.utils',
    'MapBiomas.filters',
    'MapBiomas.directives',
    'MapBiomas.wgis',
    'MapBiomas.controllers',
    'MapBiomas.services'
]);
