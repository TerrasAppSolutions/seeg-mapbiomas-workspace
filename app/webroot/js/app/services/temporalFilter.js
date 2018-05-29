'use strict';

angular.module('MapBiomas.services')
    .factory('TemporalFilterService', ['$resource', '$http',
        function ($resource, $http) {
            var TemporalFilterService = $resource('mapbiomas/services/temporal_filter/:id', {
                id: '@id'
            }, {
                paginate: {
                    url: "mapbiomas/services/temporal_filter",
                    isArray: false,
                    method: 'GET'
                },
                delete: {
                    url: "mapbiomas/services/temporal_filter/delete/:id",
                    isArray: false,
                    method: 'GET'
                }
            });

            return TemporalFilterService;
        }
    ]);