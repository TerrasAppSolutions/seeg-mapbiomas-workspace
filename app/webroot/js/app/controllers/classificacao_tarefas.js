'use strict';
angular.module('MapBiomas.controllers')
    .controller('ClassificacaoTarefasListarController', ['$rootScope', '$scope', '$routeParams', '$location', '$http', '$injector',
        function($rootScope, $scope, $routeParams, $location, $http, $injector) {

            var ExportacaoTarefaService = $injector.get('ExportacaoTarefaService');
            var Notify = $injector.get('Notify');
            var Mload = $injector.get('Mload');

            var authUser = $injector.get('AppAuth').user;

            $scope.pageSize = 8;
            $scope.page = 1;
            $scope.totalPages = 0;

            $scope.formFilterConditions = {};

            // modo de listar: 'table' ou 'map'
            $scope.viewMode = "table";

            $scope.selectAnos = [];

            $scope.init = function() {

                // anos disponiveis para pesquisa
                for (var i = 2018; i >= 1985; i--) {
                    $scope.selectAnos.push(i.toString());
                }

                var actions = {
                    table: function() {
                        $scope.paginate($scope.page, $scope.pageSize);
                    },
                    map: function() {
                        $scope.loadMapCartasList();
                    }
                };
                actions[$scope.viewMode]();
            };

            $scope.paginate = function(page, limit) {

                var paginateConditions = factoryListConditions($scope.formFilterConditions);

                if (paginateConditions == false) {
                    return;
                }

                ExportacaoTarefaService.paginate({
                    page: page,
                    limit: limit,
                    options: {
                        conditions: paginateConditions,
                        order: "ClassificacaoTarefa.id DESC",
                    }
                }, function(result) {
                    $scope.exportacaoTarefas = result.data;
                    $scope.page = result.page;
                    $scope.totalPages = result.totalPages;

                    $scope.exportacaoTarefasTotal = result.total;

                    if (result.data.length == 0) {
                        Notify.info('No records found');
                    }

                }, function(err) {

                });
            };

            $scope.formFilterChange = function() {
                var actions = {
                    table: function() {
                        $scope.page = 1;
                        $scope.paginate($scope.page, $scope.pageSize);
                    },
                    map: function() {
                        $scope.loadMapCartasList();
                    }
                };
                actions[$scope.viewMode]();
            };

            $scope.formFilterClear = function() {
                $scope.formFilterConditions = {};
                $('#formFilter-data_inicial').val("");
                $('#formFilter-data_final').val("");
                var actions = {
                    table: function() {
                        $scope.paginate($scope.page, $scope.pageSize);
                    },
                    map: function() {
                        $scope.loadMapCartasList();
                    }
                };
                actions[$scope.viewMode]();
            };

            $scope.taskAction = function(tarefa, action) {

                var actions = {
                    restart: function(tarefa) {
                        tarefa.ClassificacaoTarefa.status = 0;
                        tarefa.ClassificacaoTarefa.completed = null;

                        ExportacaoTarefaService.save(tarefa, function(tarefaResp) {
                            tarefa = tarefaResp;
                            Notify.info('Task restarted');
                        });
                    },
                    complete: function(tarefa) {
                        tarefa.ClassificacaoTarefa.status = 2;
                        tarefa.ClassificacaoTarefa.completed = moment(new Date()).format('YYYY-MM-DD h:mm:ss');;

                        ExportacaoTarefaService.save(tarefa, function(tarefaResp) {
                            tarefa = tarefaResp;
                            Notify.info('Task forced to complete');
                        });

                    },
                    remove: function(tarefa) {

                    },
                };

                Mload.confirms("Confirm this action?", function(r) {
                    if (r) {
                        actions[action](tarefa);
                        $scope.$apply();
                    }
                });

            };

            // listar dados para map view
            $scope.loadMapCartasList = function() {

                var conditions = factoryListConditions($scope.formFilterConditions);

                if (conditions == false) {
                    return;
                }

                ExportacaoTarefaService.groupCartas({
                    options: {
                        conditions: conditions
                    }
                }, function(result) {

                    var total = _.reduce(result, function(memo, value) {
                        return memo + value.ClassificacaoTarefa.count;
                    }, 0);

                    $scope.mapcartaslist = result;

                    Notify.info(total + ' records found');

                }, function(err) {});
            };

            $scope.viewModeChange = function() {
                var actions = {
                    table: function() {
                        $scope.paginate($scope.page, $scope.pageSize);
                    },
                    map: function() {
                        $scope.loadMapCartasList();
                    }
                };
                actions[$scope.viewMode]();
            };

            var factoryListConditions = function(formFilterConditions) {
                var conditions = {};

                var data_inicial, data_final;

                if (Object.keys(formFilterConditions).length == 0) {
                    return conditions;
                }

                if (formFilterConditions.carta_paramid &&
                    formFilterConditions.carta_paramid.search("-") < 0 &&
                    parseInt(formFilterConditions.carta_paramid)) {
                    conditions["Classificacao.id"] = formFilterConditions.carta_paramid;
                }

                if (formFilterConditions.carta_paramid &&
                    !parseInt(formFilterConditions.carta_paramid)) {
                    conditions["Carta.codigo iLike"] = "%" + formFilterConditions.carta_paramid + "%";
                }

                if (formFilterConditions.bioma_id) {
                    conditions["Classificacao.bioma_id"] = formFilterConditions.bioma_id;
                }

                if (formFilterConditions.year) {
                    conditions["Classificacao.year"] = formFilterConditions.year;
                }

                if (formFilterConditions.versao_final != "") {
                    conditions["Classificacao.versao_final"] = formFilterConditions.versao_final;
                }

                if (formFilterConditions.dtree) {
                    conditions["Classificacao.dtree"] = formFilterConditions.dtree;
                }

                if (formFilterConditions.fase) {
                    conditions["ClassificacaoTarefa.fase"] = formFilterConditions.fase;
                }

                if (formFilterConditions.status) {
                    conditions["ClassificacaoTarefa.status"] = formFilterConditions.status;
                }

                if (formFilterConditions.data_inicial &&
                    formFilterConditions.data_inicial.getDate()) {
                    data_inicial = moment(formFilterConditions.data_inicial.getDate()).format('YYYY-MM-DD') + ' 00:00:00';
                }

                if (formFilterConditions.data_final &&
                    formFilterConditions.data_final.getDate()) {
                    data_final = moment(formFilterConditions.data_final.getDate()).format('YYYY-MM-DD') + ' 23:59:59';
                }

                if (data_inicial && data_final) {
                    conditions["ClassificacaoTarefa.created between ? and ?"] = [data_inicial, data_final];
                }

                if (data_inicial > data_final) {
                    Notify.error('Starting date is greater than the end date', $('#formFilter-data_inicial'));
                    return false;
                }

                return conditions;
            };

            $scope.init();
        }
    ]);