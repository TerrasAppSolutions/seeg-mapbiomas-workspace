'use strict';

angular.module('MapBiomas.services')
    .factory('TemporalFilterProjectService', ['$resource', '$http',
        function ($resource, $http) {
            var TemporalFilterService = $resource('mapbiomas/services/temporal_filter_project/:id', {
                id: '@id'
            }, {
                    paginate: {
                        url: "mapbiomas/services/temporal_filter_project",
                        isArray: false,
                        method: 'GET'
                    },
                    delete: {
                        url: "mapbiomas/services/temporal_filter_project/delete/:id",
                        isArray: false,
                        method: 'GET'
                    },
                    clone: {
                        url: "mapbiomas/services/temporal_filter_project/clone/",
                        isArray: false,
                        method: 'POST'
                    },
                    activate: {
                        url: "mapbiomas/services/temporal_filter_project/activate/",
                        isArray: true,
                        method: 'POST'
                    }
                });

            return TemporalFilterService;
        }
    ]);