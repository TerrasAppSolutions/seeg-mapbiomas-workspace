'use strict';

angular.module('MapBiomas.services')
    .factory('MosaicCartaProjectService', ['$resource', '$http',
        function ($resource, $http) {
            var IntegrationFilterService = $resource('mapbiomas/services/mosaic_carta_project/:id', {
                id: '@id'
            }, {
                    paginate: {
                        url: "mapbiomas/services/mosaic_carta_project",
                        isArray: false,
                        method: 'GET'
                    },
                    delete: {
                        url: "mapbiomas/services/mosaic_carta_project/delete/:id",
                        isArray: false,
                        method: 'GET'
                    },
                    saveLot: {
                        url: "mapbiomas/services/mosaic_carta_project/save_lot",
                        isArray: true,
                        method: 'POST'
                    }
                });

            return IntegrationFilterService;
        }
    ]);