'use strict';

angular.module('MapBiomas.services')
    .factory('AssetSampleService', ['$resource', '$http',
        function ($resource, $http) {
            var AssetSampleService = $resource('mapbiomas/services/asset_sample/:id', {
                id: '@id'
            }, {
                    paginate: {
                        url: "mapbiomas/services/asset_sample",
                        isArray: false,
                        method: 'GET'
                    },
                });

            return AssetSampleService;
        }
    ]);