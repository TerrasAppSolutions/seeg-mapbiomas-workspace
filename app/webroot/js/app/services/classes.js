'use strict';

angular.module('MapBiomas.services')
    .factory('ClassesService', ['$resource',
        function ($resource) {
            var Classes = $resource('mapbiomas/services/classes/:id', {
                id: '@id'
            }, {
                    paginate: {
                        url: "mapbiomas/services/classes",
                        isArray: false,
                        method: 'GET'
                    }
                });
            return Classes;
        }
    ]);