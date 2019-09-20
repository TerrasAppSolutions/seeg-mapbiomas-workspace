'use strict';

angular.module('MapBiomas.services')
    .factory('ClasseAssetService', ['$resource', '$http',
        function ($resource, $http) {
            var ClasseAssetService = $resource('mapbiomas/services/classe_asset/:id', {
                id: '@id'
            }, {
                paginate: {
                    url: "mapbiomas/services/classe_asset",
                    isArray: false,
                    method: 'GET'
                }
            });

            return ClasseAssetService;
        }
    ]);