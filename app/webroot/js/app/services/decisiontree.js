'use strict';

angular.module('MapBiomas.services')
    .factory('DecisionTreeService', ['$resource', '$http',
        function($resource, $http) {
            var DecisionTreeService = $resource('mapbiomas/services/decision_trees/:id', {
                id: '@id'
            }, {
                paginate: {
                    url: "mapbiomas/services/decision_trees",
                    isArray: false,
                    method: 'GET'
                },
                delete: {
                    url: "mapbiomas/services/decision_trees/delete/:id",
                    isArray: false,
                    method: 'GET'
                }
            });            

            return DecisionTreeService;
        }
    ]);