'use strict';

angular.module('MapBiomas.services')
    .factory('ClassificationProjectService', ['$resource', '$http',
        function ($resource, $http) {
            var ClassificationProjectService = $resource('mapbiomas/services/classification_project/:id', {
                id: '@id'
            }, {
                    paginate: {
                        url: "mapbiomas/services/classification_project",
                        isArray: false,
                        method: 'GET'
                    },
                    delete: {
                        url: "mapbiomas/services/classification_project/delete/:id",
                        isArray: false,
                        method: 'GET'
                    },
                    saveLot: {
                        url: "mapbiomas/services/classification_project/save_lot",
                        isArray: true,
                        method: 'POST'
                    }
                });

            return ClassificationProjectService;
        }
    ]);