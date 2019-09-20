'use strict';

angular.module('MapBiomas.services')
    .factory('MosaicCartaService', ['$resource', '$http',
        function ($resource, $http) {
            var IntegrationFilterService = $resource('mapbiomas/services/mosaic_carta/:id', {
                id: '@id'
            }, {
                    paginate: {
                        url: "mapbiomas/services/mosaic_carta",
                        isArray: false,
                        method: 'GET'
                    },
                    delete: {
                        url: "mapbiomas/services/mosaic_carta/delete/:id",
                        isArray: false,
                        method: 'GET'
                    },
                    saveLot: {
                        url: "mapbiomas/services/mosaic_carta/save_lot",
                        isArray: true,
                        method: 'POST'
                    }
                });

            return IntegrationFilterService;
        }
    ]);