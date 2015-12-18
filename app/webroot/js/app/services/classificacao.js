'use strict';

angular.module('MapBiomas.services')
    .factory('ClassificacaoService', ['$resource',
        function ($resource) {
            var ClassificacaoService = $resource('mapbiomas/services/classificacoes/:id', {
                id: '@id'
            }, {
                paginate: {
                    url: "mapbiomas/services/classificacoes",
                    isArray: false,
                    method: 'GET'
                },
            });
            return ClassificacaoService;
        }
    ]);