'use strict';
angular.module('Terras.services').factory('Usuario', ['$resource', 'CacheService', function($resource, CacheService) {
        var Usuario = $resource('/terras//terras/services/usuarios/:id', {
            id: '@id'
        }, {
            paginate: {
                url: "/terras/services/usuarios",
                isArray: false,
                method: 'GET'
               // cache: CacheService
            }
        });
        return Usuario;
    }]);