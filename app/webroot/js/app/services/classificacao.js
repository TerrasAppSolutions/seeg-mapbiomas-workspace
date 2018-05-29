'use strict';

angular.module('MapBiomas.services')
    .factory('ClassificacaoService', ['$resource','$http',
        function ($resource,$http) {
            var ClassificacaoService = $resource('mapbiomas/services/classificacoes/:id', {
                id: '@id'
            }, {
                paginate: {
                    url: "mapbiomas/services/classificacoes",
                    isArray: false,
                    method: 'GET'
                },
                getCartaRegioes: {
                    url: "mapbiomas/services/classificacoes/cartaregioes/:bioma/:carta",
                    isArray: true,
                    method: 'GET'
                },
                getBiomas: {
                    url: "mapbiomas/services/classificacoes/biomas",
                    isArray: true,
                    method: 'GET'
                },
                getColecoes: {
                    url: "mapbiomas/services/classificacoes/colecoes",
                    isArray: true,
                    method: 'GET'
                },
                groupCartas: {
                    url: "mapbiomas/services/classificacoes/groupcartas",
                    isArray: true,
                    method: 'GET'
                }
            });

            angular.extend(ClassificacaoService, {
                exportCSV: function(params, callback) {
                    $http.get('mapbiomas/services/classificacoes/exportcsv', {
                        params: params
                    }).then(function(response) {
                        callback(response.data);
                    });
                }
            });

            return ClassificacaoService;
        }
    ]);