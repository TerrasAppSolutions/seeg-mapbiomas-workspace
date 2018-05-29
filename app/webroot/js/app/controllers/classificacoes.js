'use strict';
angular.module('MapBiomas.controllers')
    .controller('ClassificacoesListarController', ['$rootScope', '$scope', '$stateParams', '$location', '$http', '$injector', '$filter', '$window',
        function ($rootScope, $scope, $stateParams, $location, $http, $injector, $filter, $window) {

            var vm = this;

            // dependências 
            var Notify = $injector.get('Notify');
            var ClassificacaoService = $injector.get('ClassificacaoService');
            var ExportacaoTarefaService = $injector.get('ExportacaoTarefaService');
            var CartaRegiaoInfoService = $injector.get('CartaRegiaoInfoService');
            var authUser = $injector.get('AppAuth').user;

            // paginação 
            $scope.pageSize = 10;
            $scope.page = 1;
            $scope.totalPages = 0;

            // formFilter
            $scope.formFilterConditions = {};
            $scope.classificacoesTotal;

            // modo de listar: 'table' ou 'map'
            $scope.viewMode = "map";

            $scope.selectAnos = [];

            // select Bioma
            $scope.selectBiomasDisabled = false;

            $scope.exportCSVloading = false;

            // inicia controller
            var init = function () {

                // somente administrador pode selecionar bioma
                if (authUser.Usuario.perfil_id != 1) {
                    $scope.formFilterConditions.bioma_id = authUser.UsuarioBioma.bioma_id;
                    $scope.selectBiomasDisabled = true;
                    $scope.pageBoxTitle = authUser.UsuarioBioma.Bioma.nome;
                }

                // modo de visualização selecionado por url
                if ($stateParams.viewmode) {
                    $scope.viewMode = $stateParams.viewmode;
                }

                // anos disponiveis para pesquisa
                for (var i = 2018; i >= 1985; i--) {
                    $scope.selectAnos.push(i.toString());
                }

                var actions = {
                    table: function () {
                        $scope.paginate($scope.page, $scope.pageSize);
                    },
                    map: function () {
                        $scope.loadMapCartasList();
                        $scope.paginate($scope.page, $scope.pageSize);
                    }
                };
                actions[$scope.viewMode]();

                // lista as coleções disponíveis
                ClassificacaoService.getColecoes({}, function (colecoes) {
                    $scope.colecoes = colecoes;
                });

                // lista os biomas disponíveis
                ClassificacaoService.getBiomas({}, function (biomas) {
                    $scope.biomas = biomas;
                });
            };

            // paginação de listagem de parametros de classificação
            $scope.paginate = function (page, limit) {

                var paginateConditions = factoryListConditions($scope.formFilterConditions);

                if (paginateConditions == false) {
                    return;
                }

                ClassificacaoService.paginate({
                    page: page,
                    limit: limit,
                    options: {
                        conditions: paginateConditions,
                        order: "Classificacao.id DESC",
                    }
                }, function (result) {
                    $scope.paramsClassificacoes = result.data;
                    $scope.page = result.page;
                    $scope.totalPages = result.totalPages;
                    $scope.classificacoesTotal = result.total;
                }, function (err) {

                });
            };

            /**
             * Edita os parametros de classificação
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            $scope.editarClassificacao = function (classificacao) {
                if ($scope.modalClose) {
                    $scope.modalClose();
                }
                // carrega state de edição de parametros, parametro variavel no final para forçar reload.
                $location.path('/classifications/parameters/edit/' + classificacao.Classificacao.id + '/' + new Date().getMilliseconds());
            };

            // gera uma nova tarefa de exportação
            $scope.mosaicTaskCreate = function (classificacao) {
                var classificacaoExport = {
                    ClassificacaoTarefa: {
                        'classificacao_id': classificacao.Classificacao.id,
                        'fase': '0',
                        'status': '0'
                    }
                };

                ExportacaoTarefaService.save(classificacaoExport, function (classificacaoExportResp) {
                    Notify.info($filter('translate')('EXPORTTASKSALVO'));
                    $scope.paginate($scope.page, $scope.pageSize);
                });
            };

            // gera uma nova tarefa de exportação
            $scope.consolidateTaskCreate = function (classificacao) {
                var classificacaoExport = {
                    ClassificacaoTarefa: {
                        'classificacao_id': classificacao.Classificacao.id,
                        'fase': '1',
                        'status': '0'
                    }
                };

                ExportacaoTarefaService.save(classificacaoExport, function (classificacaoExportResp) {
                    Notify.info($filter('translate')('EXPORTTASKSALVO'));
                    $scope.paginate($scope.page, $scope.pageSize);
                });
            };

            // gera uma nova tarefa de exportação
            $scope.removeTask = function (classificacao) {
                console.log(classificacao);
                return;
                var classificacaoExport = {
                    ClassificacaoTarefa: {
                        'classificacao_id': classificacao.Classificacao.id,
                        'fase': '1',
                        'status': '0'
                    }
                };

                ExportacaoTarefaService.save(classificacaoExport, function (classificacaoExportResp) {
                    Notify.info($filter('translate')('EXPORTTASKSALVO'));
                    $scope.paginate($scope.page, $scope.pageSize);
                });
            };

            // processar imagem no terras engine
            $scope.processarResultado = function (classificacao) {
                if ($scope.modalProcessarResultado) {
                    $scope.modalProcessarResultado(classificacao);
                }
            };

            // form filter funções
            $scope.formFilterChange = function () {
                var actions = {
                    table: function () {
                        $scope.page = 1;
                        $scope.paginate($scope.page, $scope.pageSize);
                    },
                    map: function () {
                        $scope.page = 1;
                        $scope.paginate($scope.page, $scope.pageSize);
                        $scope.loadMapCartasList();
                    }
                };
                actions[$scope.viewMode]();
            };

            $scope.formFilterClear = function () {
                $scope.formFilterConditions = {};
                $('#formFilter-data_inicial').val("");
                $('#formFilter-data_final').val("");
                var actions = {
                    table: function () {
                        $scope.paginate($scope.page, $scope.pageSize);
                    },
                    map: function () {
                        $scope.loadMapCartasList();
                    }
                };
                actions[$scope.viewMode]();
            };

            // listar dados para map view
            $scope.loadMapCartasList = function () {

                var conditions = factoryListConditions($scope.formFilterConditions);

                if (conditions == false) {
                    return;
                }

                ClassificacaoService.groupCartas({
                    options: {
                        conditions: conditions
                    }
                }, function (result) {

                    var total = _.reduce(result, function (memo, value) {
                        return memo + value.Classificacao.count;
                    }, 0);

                    $scope.mapcartaslist = result;
                    //Notify.info(total + ' records found');

                }, function (err) {});

            };

            $scope.viewModeChange = function () {
                var actions = {
                    table: function () {
                        $scope.paginate($scope.page, $scope.pageSize);
                    },
                    map: function () {
                        $scope.loadMapCartasList();
                    }
                };
                actions[$scope.viewMode]();
            };

            $scope.buscarCartaMap = function (cartaCodigo) {
                $scope.formFilterConditions.carta_paramid = cartaCodigo;
                $scope.formFilterChange();
            };

            // exporta registros para formato csv
            $scope.exportToCSV = function () {

                var paginateConditions = factoryListConditions($scope.formFilterConditions);

                if (paginateConditions == false) {
                    return;
                }

                $scope.exportCSVloading = true;

                var downloadWin = $window.open('about:blank', 'downloading');

                ClassificacaoService.exportCSV({
                    options: {
                        conditions: paginateConditions
                    }
                }, function (result) {
                    $scope.exportCSVloading = false;
                    downloadWin.location = result;
                });
            };

            // construtor de condições de pesquisa
            var factoryListConditions = function (formFilterConditions) {
                var conditions = {};

                var data_inicial, data_final;

                //conditions["Bioma.nome"] = authUser.UsuarioBioma.Bioma.nome;

                if (formFilterConditions.carta_paramid &&
                    formFilterConditions.carta_paramid.search("-") < 0 &&
                    parseInt(formFilterConditions.carta_paramid)) {
                    conditions["Classificacao.id"] = formFilterConditions.carta_paramid;
                }

                if (formFilterConditions.carta_paramid &&
                    !parseInt(formFilterConditions.carta_paramid)) {
                    conditions["Carta.codigo iLike"] = "%" + formFilterConditions.carta_paramid + "%";
                }

                // se houver carta selecionada
                if (!conditions["Carta.codigo iLike"]) {
                    conditions["Carta.codigo"] = $scope.cartaSelecionda;
                }
                if (formFilterConditions.year) {
                    conditions["Classificacao.year"] = formFilterConditions.year;
                }

                if (formFilterConditions.bioma_id) {
                    conditions["Classificacao.bioma_id"] = formFilterConditions.bioma_id;
                }

                if (formFilterConditions.colecao_id) {
                    conditions["Classificacao.colecao_id"] = formFilterConditions.colecao_id;
                }

                if (formFilterConditions.versao_final != "") {
                    conditions["Classificacao.versao_final"] = formFilterConditions.versao_final;
                }

                if (formFilterConditions.versao) {
                    conditions["Classificacao.versao"] = formFilterConditions.versao;
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
                    conditions["OR"] = {
                        "Classificacao.created between ? and ?": [data_inicial, data_final],
                        "Classificacao.modified between ? and ?": [data_inicial, data_final],
                    };
                }

                if (data_inicial > data_final) {
                    Notify.error('Starting date is greater than the end date', $('#formFilter-data_inicial'));
                    return false;
                }

                if (formFilterConditions.gee_asset_verificacao) {
                    conditions["ClassificacaoTarefa.gee_asset_verificacao"] = formFilterConditions.gee_asset_verificacao;
                }

                return conditions;
            };

            init();
        }
    ])
    .controller('ClassificacoesListarModalController',
        function ($scope, $uibModalInstance, params) {

            /**
             * Controller do modal de listagem de classificações
             * este controller será herdado por ClassificacoesListarController
             * variavel params definda pelo controller MapBiomasController 
             * que executa o modal
             */

            $scope.cartaSelecionda = params.cartaSelecionda;

            $scope.modalProcessarResultado = function (classificacao) {
                params.processarResultado(classificacao);
                $scope.modalClose();
            };

            $scope.processarResultado = function (classificacao) {
                console.log("processarResultado modal");
            };

            $scope.modalClose = function () {
                $uibModalInstance.close();
            };

        }
    )
    .controller('ClassificacoesEditarController', ['$scope', '$injector', '$stateParams', '$filter', '$location',
        function ($scope, $injector, $stateParams, $filter, $location) {

            var vm = this;

            // dependências
            var AppAuth = $injector.get('AppAuth');
            var Mload = $injector.get('Mload');
            var Notify = $injector.get('Notify');
            var ClassificacaoService = $injector.get('ClassificacaoService');
            var DecisionTreeService = $injector.get('DecisionTreeService');
            var CartaRegiaoInfoService = $injector.get('CartaRegiaoInfoService');

            // id do parametro da classificação
            var classificacaoId;

            // modal do formulário
            var $classificacaoFormModal = angular.element("#classificacaoFormModal");

            var authUser = AppAuth.user;

            /* definindo variáveis vm */
            vm.cartaRegiaoInfo;

            /* funções vm */
            vm.getCartaRegiaoInfo = getCartaRegiaoInfo;

            var init = function () {
                // id do parametro de classificação 
                if ($stateParams.classificacaoId) {

                    classificacaoId = $stateParams.classificacaoId;

                    ClassificacaoService.get({
                        id: classificacaoId
                    }, function (respData) {

                        /**
                         * Ao obter carta, ele obtém as regiões relacionadas com esta carta
                         */
                        CartaRegiaoInfoService.query({
                            options: {
                                conditions: {
                                    "name": respData.Classificacao.carta
                                }
                            }
                        }, function (result) {
                            vm.cartaRegiaoInfo = result;
                        });

                        // lista arvores de decisao
                        decisionTreeList(true, function () {
                            setClassificacao(respData);
                        });

                        $classificacaoFormModal.modal('show');

                    }, function () {});
                }

            };

            /**
             * Função de obtenção das cartas
             */
            function getCartaRegiaoInfo() {
                return vm.cartaRegiaoInfo;
            }

            /**
             * Salva os parametros de classificação
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            $scope.salvarClassificacao = function (classificacao) {
                // valida parametros de classificacao
                if (!classificacaoValiacao(classificacao)) {
                    return;
                }

                // valida arvore de decisão
                if (!$scope.dtreeSelected.DecisionTree.version_final) {
                    Mload.load($filter('translate')('CLASSDTREEVALIDTITULO'), $filter('translate')('CLASSDTREEVALIDMSG') + '...');
                    return;
                }

                // atribui à classificação o bioma do usuario
                if (!classificacao.Classificacao.bioma_id) {
                    classificacao.Classificacao.bioma_id = authUser.UsuarioBioma.bioma_id;
                }

                // decision tree
                classificacao.Classificacao.dtv = getDecisionTreeParams($scope.dtreeSelected.DecisionTree.dtree);
                classificacao.Classificacao.decision_tree_id = $scope.dtreeSelected.DecisionTree.id;

                // salva a classificação
                ClassificacaoService.save(classificacao, function () {
                    $scope.paginate($scope.page, $scope.pageSize);
                    $classificacaoFormModal.modal('hide');
                    // ajustar url
                    $location.path('/classifications/parameters/');
                    // notificação de parâmetros salvos
                    Notify.success($filter('translate')('SALVAPARAMS-SUCESSO'));
                });
            };

            /**
             * salvar como uma nova classificação
             */
            vm.salvarClassificacaoComo = function (e, classificacao) {
                e.preventDefault();
                // deleção do id para criação de nova classificação
                delete classificacao.Classificacao.id;
                // alteração do nome para salvamento como cópia
                classificacao.Classificacao.identificador = classificacao.Classificacao.identificador + ' copy';
                $scope.salvarClassificacao(classificacao);
            }

            /**
             * Função que executa quando dtree selecionada é alterada             
             */
            $scope.dtreeSelectedChange = function (dtreeSelectedId) {

                var dtreeSelected;

                $scope.decisiontrees.forEach(function (value, index) {
                    if (value.DecisionTree.id == dtreeSelectedId) {
                        dtreeSelected = angular.copy($scope.decisiontrees[index]);
                        if ($scope.classificacao.Classificacao.dtv) {
                            dtreeSelected = setDecisionTreeParams(dtreeSelected, $scope.classificacao.Classificacao.dtv);
                        }
                    }
                });

                if (!dtreeSelected) {
                    return;
                }

                $scope.dtreeSelected = dtreeSelected;
            };

            /**
             * Função que executa quando o componente 
             * grafico decisiontree é modificado
             */
            $scope.dtreeRender = function (dtree) {
                $scope.dtreeSelected.DecisionTree.dtree = dtree;
            };

            /**
             * aplica os valores no formularios de classificação
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            var setClassificacao = function (classificacao) {
                if (classificacao.Classificacao.decision_tree_id) {

                    var dtreeSelected;
                    $scope.decisiontrees.forEach(function (value, index) {
                        if (value.DecisionTree.id == classificacao.Classificacao.decision_tree_id) {
                            dtreeSelected = $scope.decisiontrees[index];
                        }
                    });

                    $scope.dtreeSelected = setDecisionTreeParams(dtreeSelected, classificacao.Classificacao.dtv);

                } else {
                    classificacao.Classificacao.decision_tree_id = $scope.dtreeSelected.DecisionTree.id;
                    classificacao.DecisionTree = $scope.dtreeSelected.DecisionTree;
                }

                $scope.classificacao = classificacao;
                //$scope.classificacao.Classificacao.versao = parseInt($scope.classificacao.Classificacao.versao);
            };

            var decisionTreeList = function (selectFirst, callback) {

                var conditions = {
                    "OR": [{
                            "DecisionTree.bioma_id": authUser.UsuarioBioma.bioma_id
                        },
                        ["DecisionTree.bioma_id ISNULL"]
                    ],
                    "DecisionTree.version_final": "TRUE"
                };

                if (authUser.Usuario.perfil_id == 1) {
                    conditions = {};
                }

                DecisionTreeService.query({
                    options: {
                        conditions: conditions,
                        order: ["DecisionTree.bioma_id DESC", "DecisionTree.id ASC"]
                    }
                }, function (respData) {

                    $scope.decisiontrees = _.map(respData, function (value) {

                        var label = "ID: " + value.DecisionTree.id;

                        if (value.DecisionTree.bioma_id) {
                            label += " | BIOMA: " + value.Bioma.nome;
                        } else {
                            label += " | BIOMA: ALL ";
                        }

                        if (value.DecisionTree.version) {
                            label += " | VERSION: " + value.DecisionTree.version;
                        }

                        if (value.DecisionTree.label) {
                            label += " | LABEL: " + value.DecisionTree.label;
                        }

                        value.DecisionTree.selectLabel = label;

                        return value;
                    });

                    if (callback) {
                        callback($scope.decisiontrees);
                    }
                });
            };

            var classificacaoValiacao = function (classificacao) {

                var valido = true;

                // valida coleção
                var colecaoSelected = _.find($scope.colecoes, function (c) {
                    return c.Colecao.id == classificacao.Classificacao.colecao_id;
                });

                if (colecaoSelected.Colecao.status == '0') {
                    Mload.alert('Closed collection', "The collection selected is closed. Please select another collection", "modal-warning");
                    valido = false;
                }

                if (colecaoSelected.Colecao.status == '1' &&
                    classificacao.Classificacao.id &&
                    classificacao.Colecao.status == '0') {
                    Mload.alert('Closed collection', "This classification parameter belongs to a closed collection. Please, save a new classification parameter.", "modal-warning");
                    valido = false;
                }
                return valido;
            };

            var getDecisionTreeParams = function (dtree) {

                var dtv = {};

                if ($scope.classificacao.Classificacao.decision_tree_id == 1) {
                    dtv.dtv1 = dtree['3-1'].rule.thresh;
                    dtv.dtv2 = dtree['4-2'].rule.thresh;
                    dtv.dtv3 = dtree['5-3'].rule.thresh;
                    dtv.dtv4 = dtree['2-1'].rule.thresh;
                } else {
                    angular.forEach(dtree, function (node, key) {
                        if (node.kind == 'decision') {
                            dtv[key] = node.rule.thresh;
                        }
                    });
                }

                return dtv;
            };

            var setDecisionTreeParams = function (decisionTree, dtv) {
                var decisionTreeParams = decisionTree;
                if (decisionTree.DecisionTree.id == 1 && dtv.dtv1) {
                    decisionTreeParams.DecisionTree.dtree['3-1'].rule.thresh = parseInt(dtv.dtv1)
                    decisionTreeParams.DecisionTree.dtree['4-2'].rule.thresh = parseInt(dtv.dtv2);
                    decisionTreeParams.DecisionTree.dtree['5-3'].rule.thresh = parseInt(dtv.dtv3);
                    decisionTreeParams.DecisionTree.dtree['2-1'].rule.thresh = parseInt(dtv.dtv4);
                } else {
                    angular.forEach(decisionTreeParams.DecisionTree.dtree, function (node, key) {
                        if (node.kind == 'decision' && dtv[key]) {
                            node.rule.thresh = dtv[key];
                        }
                    });
                }
                return decisionTreeParams;
            };

            init();
        }
    ]);