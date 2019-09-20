'use strict';

angular.module('MapBiomas.services')
    .factory('IntegrationService', ['$resource', '$http',
        function ($resource, $http) {
            var IntegrationService = $resource('mapbiomas/services/integration/:id', {
                id: '@id'
            }, {
                paginate: {
                    url: "mapbiomas/services/integration",
                    isArray: false,
                    method: 'GET'
                },
                delete: {
                    url: "mapbiomas/services/integration/delete/:id",
                    isArray: false,
                    method: 'GET'
                },
                saveLot: {
                    url: "mapbiomas/services/integration/save_lot",
                    isArray: false,
                    method: 'POST'
                }
            });

            return IntegrationService;
        }
    ]);