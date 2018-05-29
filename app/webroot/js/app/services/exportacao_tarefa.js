'use strict';

angular.module('MapBiomas.services')
    .factory('ExportacaoTarefaService', ['$resource',
        function ($resource) {
            var ExportacaoTarefaService = $resource('mapbiomas/services/exportacao_tarefas/:id', {
                id: '@id'
            }, {
                paginate: {
                    url: "mapbiomas/services/exportacao_tarefas",
                    isArray: false,
                    method: 'GET'
                },
                groupCartas: {
                    url: "mapbiomas/services/exportacao_tarefas/groupcartas",
                    isArray: true,
                    method: 'GET'
                }
            });
            return ExportacaoTarefaService;
        }
    ]);