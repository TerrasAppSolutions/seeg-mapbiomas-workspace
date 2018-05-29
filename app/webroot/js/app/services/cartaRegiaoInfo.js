'use strict';

angular.module('MapBiomas.services')
    .factory('CartaRegiaoInfoService', ['$resource','$http',
        function ($resource,$http) {
            var CartaRegiaoInfoService = $resource('mapbiomas/services/carta_regiao_info/:id', {
                id: '@id'
            }, {
                paginate: {
                    url: "mapbiomas/services/carta_regiao_info",
                    isArray: false,
                    method: 'GET'
                }
            });

            return CartaRegiaoInfoService;
        }
    ]);