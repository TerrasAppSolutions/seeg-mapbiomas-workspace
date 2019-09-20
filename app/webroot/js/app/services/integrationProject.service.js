'use strict';

angular.module('MapBiomas.services')
    .factory('IntegrationProjectService', ['$resource', '$http',
        function ($resource, $http) {
            var IntegrationProjectService = $resource('mapbiomas/services/integration_project/:id', {
                id: '@id'
            }, {
                    paginate: {
                        url: "mapbiomas/services/integration_project",
                        isArray: false,
                        method: 'GET'
                    },
                    delete: {
                        url: "mapbiomas/services/integration_project/delete/:id",
                        isArray: false,
                        method: 'GET'
                    },
                    activate: {
                        url: "mapbiomas/services/integration_project/activate/",
                        isArray: false,
                        method: 'POST'
                    }
                });

            return IntegrationProjectService;
        }
    ]);