'use strict';

angular.module('MapBiomas.services')
    .factory('CartaBiomaService', ['$resource', '$http',
        function ($resource, $http) {
            var CartaBiomaService = $resource('mapbiomas/services/carta_bioma/:id', {
                id: '@id'
            }, {
                    paginate: {
                        url: "mapbiomas/services/carta_bioma",
                        isArray: false,
                        method: 'GET'
                    },
                    delete: {
                        url: "mapbiomas/services/carta_bioma/delete/:id",
                        isArray: false,
                        method: 'GET'
                    },
                    saveLot: {
                        url: "mapbiomas/services/carta_bioma/save_lot",
                        isArray: true,
                        method: 'POST'
                    }
                });

            return CartaBiomaService;
        }
    ]);