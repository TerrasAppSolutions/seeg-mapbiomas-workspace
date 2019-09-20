'use strict';

angular.module('MapBiomas.services')
    .factory('ClassificationService', ['$resource', '$http',
        function ($resource, $http) {
            var ClassificationService = $resource('mapbiomas/services/classification/:id', {
                id: '@id'
            }, {
                    paginate: {
                        url: "mapbiomas/services/classification",
                        isArray: false,
                        method: 'GET'
                    },
                    delete: {
                        url: "mapbiomas/services/classification/delete/:id",
                        isArray: false,
                        method: 'GET'
                    },
                    saveLot: {
                        url: "mapbiomas/services/classification/save_lot",
                        isArray: true,
                        method: 'POST'
                    }
                });

            return ClassificationService;
        }
    ]);