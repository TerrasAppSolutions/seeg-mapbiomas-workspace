'use strict';

angular.module('MapBiomas.services')
    .factory('FeatureSpaceService', ['$resource', '$http',
        function ($resource, $http) {
            var TemporalFilterService = $resource('mapbiomas/services/feature_space/:id', {
                id: '@id'
            }, {
                paginate: {
                    url: "mapbiomas/services/feature_space",
                    isArray: false,
                    method: 'GET'
                },
                delete: {
                    url: "mapbiomas/services/feature_space/delete/:id",
                    isArray: false,
                    method: 'GET'
                }
            });

            return TemporalFilterService;
        }
    ]);