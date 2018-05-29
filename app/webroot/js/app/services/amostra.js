/** 
 * @namespace app.service.data.amostra
 * @description Servico de dados de amostras
 */
(function() {
    'use strict';
    angular.module('MapBiomas.services').service('AmostraDataService', AmostraDataService);
    
    AmostraDataService.$inject = ['$resource', 'AppConfig'];

    function AmostraDataService($resource, AppConfig) {
        var dataService = $resource('mapbiomas/services/amostras/:id', {
            id: '@id'
        }, {
            paginate: {
                url: 'mapbiomas/services/amostras',
                isArray: false,
                method: 'GET'
            },
            delete: {
                url: 'mapbiomas/services/amostras/delete/:id',
                isArray: false,
                method: 'DELETE'
            }
        });
        return dataService;
    }
})();