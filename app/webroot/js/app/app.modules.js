'use strict';

// Módulo de Plugins
angular.module('MapBiomas.plugins', [
    'ngSanitize',
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap',    
    'ui.router',
    'ui.slider',        
    'ui.select2',        
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

// MapBiomas widgets
angular.module('MapBiomas.widgets', []);

/*
 * Modulo MapBiomas
 */
angular.module('MapBiomas', [
    'MapBiomas.plugins',
    'MapBiomas.utils',
    'MapBiomas.filters',
    'MapBiomas.directives',
    'MapBiomas.wgis',
    'MapBiomas.workmap',
    'MapBiomas.workmap.draw',
    'MapBiomas.dtree',
    'MapBiomas.controllers',
    'MapBiomas.services',
    'MapBiomas.widgets',
    // Modules (refactoring to feature structure)
    'MapBiomas.samples'
]);
