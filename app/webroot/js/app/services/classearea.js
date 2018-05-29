'use strict';

angular.module('MapBiomas.services')
    .factory('ClasseAreaService', ['$resource', '$http',
        function($resource, $http) {
            var ClasseAreaService = $resource('mapbiomas/services/classe_areas/:id', {
                id: '@id'
            }, {
                paginate: {
                    url: "mapbiomas/services/classe_areas",
                    isArray: false,
                    method: 'GET'
                },
                delete: {
                    url: "mapbiomas/services/classe_areas/delete/:id",
                    isArray: false,
                    method: 'GET'
                }
            });

            angular.extend(ClasseAreaService, {
                exportCSV: function(params, callback) {
                    $http.get('mapbiomas/services/classe_areas/exportcsv', {
                        params: params
                    }).then(function(response) {
                        callback(response.data);
                    });
                }
            });

            return ClasseAreaService;
        }
    ]);