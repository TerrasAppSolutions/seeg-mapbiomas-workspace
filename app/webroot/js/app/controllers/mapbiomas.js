'use strict';
angular.module('MapBiomas.controllers')
    .controller('MapBiomasController', ['$rootScope', '$scope', '$routeParams', '$location', '$http', '$filter', '$injector',
        function($rootScope, $scope, $routeParams, $location, $http, $filter, $injector) {

            var AppAuth = $injector.get('AppAuth');
            var Mload = $injector.get('Mload');
            var $uibModal = $injector.get('$uibModal');
            var Notify = $injector.get('Notify');

            var WorkmapAPI = $injector.get('WorkmapAPI');
            var ClassificacaoService = $injector.get('ClassificacaoService');
            var DecisionTreeService = $injector.get('DecisionTreeService');
            var CartaResultadoService = $injector.get('CartaResultadoService');
            var GEEImageService = $injector.get('GEEImageService');
            var GeeImageService = $injector.get('GeeImageService');
            var CartaResultadoService = $injector.get('CartaResultadoService');

            var authUser = AppAuth.user;

            var elevationmin = 0;
            var elevationmax = 20;
            var originatorEv;
            var cartaSelecionda;


            /**
             * Inicia controller
             */
            $scope.init = function() {
                // inicia variaveis iniciais                
                $scope.processar_on = false;
                $scope.forest = true;
                $scope.nonforest = true;
                $scope.water = true;

                $scope.salvar_on = false;
                $scope.elevation_on = false;

                $scope.mapCartaOptions = {
                    toolTipCarta: false,
                    cartaName: "SB-21-Z-D",
                    loadResultados: false
                };

                $scope.selectAnos = [];
                $scope.resultados = [];
                $scope.loadResultados = false;

                // valores iniciais dos anos
                for (var i = 2016; i >= 1985; i--) {
                    $scope.selectAnos.push(i.toString());
                }

                $scope.classifProcess = {
                    Classificacao: {}
                };

                $scope.classificacaoResultados = [];

                // lista as coleções disponíveis
                ClassificacaoService.getColecoes({}, function(colecoes) {
                    $scope.colecoes = colecoes;
                });

                // listar dtrees salvas 
                // *futura implementação - ngmodel do select classificacao.decision_tree_id
                $scope.dtreeSelected = null;

                $scope.decisiontrees = [];

                // lista arvores de decisao
                decisionTreeList(true);
            };


            /**
             * Salva os parametros de classificação
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            $scope.salvarClassificacao = function(classificacao) {

                // valida parametros de classificacao
                if (!classificacaoValiacao(classificacao)) {
                    return;
                }

                // valida arvore de decisão
                if (!$scope.dtreeSelected.DecisionTree.version_final) {
                    Mload.load($filter('translate')('CLASSDTREEVALIDTITULO'), $filter('translate')('CLASSDTREEVALIDMSG') + '...');
                    return;
                }

                //atribui à classificação o bioma do usuario
                if (!classificacao.Classificacao.bioma_id) {
                    classificacao.Classificacao.bioma_id = authUser.UsuarioBioma.bioma_id;
                }

                // decision tree
                classificacao.Classificacao.dtv = getDecisionTreeParams($scope.dtreeSelected.DecisionTree.dtree);
                classificacao.Classificacao.decision_tree_id = $scope.dtreeSelected.DecisionTree.id;

                // salva a classificação
                ClassificacaoService.save(classificacao, function(classificacaoResp) {

                    // atribui o id salvo                    
                    $scope.setClassificacao(classificacaoResp);

                    Notify.success($filter('translate')('SALVAPARAMS-SUCESSO'));

                    // atualiza a lista de parametros
                    ClassificacaoService.query({
                        options: {
                            conditions: {
                                "Classificacao.carta": classificacaoResp.Classificacao.carta
                            },
                            order: "Classificacao.id DESC",
                            limit: 6
                        }
                    }, function(respData) {
                        $scope.classificacaoResultados = respData;
                    }, function() {});
                },function(){
                    Notify.warning($filter('translate')('SALVAPARAMS-AVISO'));
                });
            };


            /**
             * Salva novos parametros de classificação a partir de um existente
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            $scope.salvarNovoClassificacao = function(classificacao) {
                var newClassificacao = angular.copy(classificacao);
                delete newClassificacao.Classificacao.id;
                $scope.salvarClassificacao(newClassificacao);
            };


            /**
             * Processa imagem usando serviço gee python
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            $scope.geeImagemProcessar = function(classificacao) {

                var classificacaoProcesss = {
                    Classificacao: angular.copy(classificacao.Classificacao),
                    DecisionTree: {
                        dtree: $scope.dtreeSelected.DecisionTree.dtree
                    }
                };

                Mload.load($filter('translate')('PROCESSIMAGE'), $filter('translate')('AGUARDE') + '...');

                GeeImageService.getResultados(
                    classificacaoProcesss,
                    function(respData) {
                        var data = respData.data;
                        data.classificationParams = classificacao;
                        data.classificationParams.DecisionTree = classificacaoProcesss.DecisionTree;
                        $scope.imagensProcessadas = data;
                        $scope.$apply();
                        Mload.hide();
                    },
                    function(err) {
                        Mload.hide(function() {
                            Mload.load("Google Earth Engine process error", err, "modal-warning");
                            setTimeout(function() {
                                Mload.hide();
                            }, 10000);
                        });
                    },
                    function() {
                        Mload.hide();
                        Mload.load("Google Earth Engine Authentication", "You must to give permission access to process images on Workspace.");
                        setTimeout(function() {
                            Mload.hide();
                        }, 5000);
                    }
                );
            };


            /**
             * carrega dados de classificação ao selecionar uma carta
             * @param {String} carta codigo da carta selecionada
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            $scope.cartaEventClick = function(carta, classifProcess) {
                $scope.loadResultados = true;
                ClassificacaoService.query({
                    options: {
                        conditions: {
                            "Classificacao.carta": carta
                        },
                        order: "Classificacao.id DESC",
                        limit: 6
                    }
                }, function(respData) {
                    $scope.classificacaoResultados = respData;
                    $scope.loadResultados = false;
                });

                if (classifProcess) {
                    $scope.setClassificacao(classifProcess);
                } else {
                    $scope.classifProcess.Classificacao.carta = carta;
                }

                cartaSelecionda = carta;

                $scope.$apply();
            };

            /**
             * processa dados classificação e aplica os valores no formularios de classificação
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            $scope.processarResultado = function(classificacao) {
                $scope.setClassificacao(angular.copy(classificacao));
                $('[href="#tab-classificacoes"]').tab('show');
                $scope.geeImagemProcessar($scope.classifProcess);
            };
            
            /**
             * Aplica os valores no formularios de classificação
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            $scope.setFormResultado = function(classificacao) {
                $scope.setClassificacao(angular.copy(classificacao));                
                $('[href="#tab-classificacoes"]').tab('show');
            };

            /**
             * Função que executa quando o componente 
             * grafico decisiontree é modificado
             */
            $scope.dtreeRender = function(dtree) {

                $scope.dtreeSelected.DecisionTree.dtree = dtree;

                if (!$scope.imagensProcessadas) {
                    $scope.$apply();
                    return;
                }

                var dtreeLayer = WorkmapAPI.getWorkLayer();

                if (dtreeLayer) {

                    dtreeLayer.setProcessedLayers(validateDtreeLayers($scope.imagensProcessadas, dtree));

                    dtreeLayer.setDtree(dtree);
                }

                $scope.$apply();

            };


            /**
             * aplica os valores no formularios de classificação
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            $scope.setClassificacao = function(classificacao) {
                if (classificacao.Classificacao.decision_tree_id) {

                    var dtreeSelected;
                    $scope.decisiontrees.forEach(function(value, index) {
                        if (value.DecisionTree.id == classificacao.Classificacao.decision_tree_id) {
                            dtreeSelected = angular.copy($scope.decisiontrees[index]);
                        }
                    });

                    $scope.dtreeSelected = setDecisionTreeParams(dtreeSelected, classificacao.Classificacao.dtv);

                } else {
                    classificacao.Classificacao.decision_tree_id = $scope.dtreeSelected.DecisionTree.id;
                    classificacao.DecisionTree = $scope.dtreeSelected.DecisionTree;
                }

                $scope.classifProcess = classificacao;
                $scope.classifProcess.Classificacao.versao = parseInt($scope.classifProcess.Classificacao.versao);
            };

            /**
             * Função que executa quando dtree selecionada é alterada             
             */
            $scope.dtreeSelectedChange = function(dtreeSelectedId) {

                var dtreeSelected;

                $scope.decisiontrees.forEach(function(value, index) {
                    if (value.DecisionTree.id == dtreeSelectedId) {
                        dtreeSelected = angular.copy($scope.decisiontrees[index]);
                        if ($scope.classifProcess.Classificacao.dtv) {
                            dtreeSelected = setDecisionTreeParams(dtreeSelected, $scope.classifProcess.Classificacao.dtv);
                        }
                    }
                });


                if (!dtreeSelected) {
                    return;
                }

                $scope.dtreeSelected = dtreeSelected;

                var dtree = $scope.dtreeSelected.DecisionTree.dtree;

                var workLayer = WorkmapAPI.getWorkLayer();

                if (workLayer) {
                    var layers = validateDtreeLayers($scope.imagensProcessadas, dtree);
                    if (layers) {
                        workLayer.setProcessedLayers(layers);
                        workLayer.setDtree(dtree);
                    } else {
                        $scope.geeImagemProcessar($scope.classifProcess);
                    }
                }

            };

            /**
             * dispara quando o valor do componente select
             * referente ao ano é modificado
             * @param {String} ano ano do parametro selecionado
             */
            $scope.selectAnoChange = function(ano) {
                var resultadoAno = null;
                if ($scope.classifProcess.Classificacao &&
                    $scope.classifProcess.Classificacao.t0 &&
                    $scope.classifProcess.Classificacao.t1) {

                    var t0 = $scope.classifProcess.Classificacao.t0;
                    var t1 = $scope.classifProcess.Classificacao.t1;

                    var ano0 = $scope.classifProcess.Classificacao.t0.substr(0, 4);
                    var ano1 = $scope.classifProcess.Classificacao.t1.substr(0, 4);

                    $scope.classifProcess.Classificacao.t0 = t0.replace(ano0, ano);
                    $scope.classifProcess.Classificacao.t1 = t1.replace(ano1, ano);

                } else {
                    $scope.classifProcess.Classificacao.t0 = ano + "-01-01";
                    $scope.classifProcess.Classificacao.t1 = ano + "-12-30"
                }
            };

            /**
             * exibi as classes no mapa
             */
            $scope.showClasses = function(class_, enable) {
                WorkmapAPI.showClasses(class_, enable);
            };


            /**
             * Exibe Modal de listagem de classificações
             */
            $scope.dialogClassificacoesListar = function() {
                var scopeCtrl = $scope;

                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'js/app/views/classificacoes/dialog_listar.html',
                    controller: 'ClassificacoesListarModalController',
                    size: 'lg',
                    windowClass: 'classification-list',
                    resolve: {
                        params: function() {
                            return {
                                processarResultado: scopeCtrl.processarResultado,
                                cartaSelecionda: cartaSelecionda
                            };
                        }
                    }
                });
            };

            /**
             * Exibe Modal de listagem de area de classe
             */
            $scope.dialogClasseAreasListar = function() {
                var scopeCtrl = $scope;

                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'js/app/views/classe_areas/dialog_listar.html',
                    controller: 'ClasseAreasListarModalController',
                    size: 'lg',
                    windowClass: 'classification-list',
                    resolve: {
                        params: function() {
                            return {
                                cartaSelecionda: cartaSelecionda
                            };
                        }
                    }
                });
            };

            $scope.clearParams = function(classifProcess) {

                var classifProcessCopy = angular.copy(classifProcess);

                classifProcess.Classificacao = {};

                classifProcess.Classificacao = {
                    carta: classifProcessCopy.Classificacao.carta
                };
            };


            $scope.$watch('classifProcess.Classificacao.carta', function(value) {
                if (value) {
                    ClassificacaoService.getCartaRegioes({
                        carta: value,
                        bioma: authUser.UsuarioBioma.Bioma.nome
                    }, function(respData) {
                        $scope.cartaRegioes = respData;
                        $scope.loadResultados = false;
                    });
                }
            });

            $scope.$watch('elevation_on', function(newValue, oldValue) {
                if (newValue && $scope.classifProcess) {
                    $scope.classifProcess.Classificacao.elevation_on = 1;
                } else {
                    $scope.classifProcess.Classificacao.elevation_on = 0;
                }
            });

            var classificacaoValiacao = function(classificacao) {

                var valido = true;

                // valida coleção
                var colecaoSelected = _.find($scope.colecoes, function(c) {
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

            var getDecisionTreeParams = function(dtree) {

                var dtv = {};

                if ($scope.classifProcess.Classificacao.decision_tree_id == 1) {
                    dtv.dtv1 = dtree['3-1'].rule.thresh;
                    dtv.dtv2 = dtree['4-2'].rule.thresh;
                    dtv.dtv3 = dtree['5-3'].rule.thresh;
                    dtv.dtv4 = dtree['2-1'].rule.thresh;
                } else {
                    angular.forEach(dtree, function(node, key) {
                        if (node.kind == 'decision') {
                            dtv[key] = node.rule.thresh;
                        }
                    });
                }

                return dtv;
            };

            var setDecisionTreeParams = function(decisionTree, dtv) {
                var decisionTreeParams = decisionTree;
                if (decisionTree.DecisionTree.id == 1 && dtv.dtv1) {
                    decisionTreeParams.DecisionTree.dtree['3-1'].rule.thresh = parseInt(dtv.dtv1)
                    decisionTreeParams.DecisionTree.dtree['4-2'].rule.thresh = parseInt(dtv.dtv2);
                    decisionTreeParams.DecisionTree.dtree['5-3'].rule.thresh = parseInt(dtv.dtv3);
                    decisionTreeParams.DecisionTree.dtree['2-1'].rule.thresh = parseInt(dtv.dtv4);
                } else {
                    angular.forEach(decisionTreeParams.DecisionTree.dtree, function(node, key) {
                        if (node.kind == 'decision' && dtv[key]) {
                            node.rule.thresh = dtv[key];
                        }
                    });
                }

                return decisionTreeParams;
            };


            var decisionTreeList = function(selectFirst, callback) {                

                var conditions = {
                    "OR": [{
                            "DecisionTree.bioma_id": authUser.UsuarioBioma.bioma_id
                        },
                        ["DecisionTree.bioma_id ISNULL"]
                    ],
                    "DecisionTree.version_final": "TRUE"
                };

                if (authUser.Usuario.perfil_id == 1 || authUser.Usuario.perfil_id == 10) {
                    conditions = {};                    
                }

                DecisionTreeService.query({
                    options: {
                        conditions: conditions,
                        order: ["DecisionTree.bioma_id DESC", "DecisionTree.id ASC"]
                    }
                }, function(respData) {

                    $scope.decisiontrees = _.map(respData, function(value) {

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

                    if (selectFirst) {
                        // seleciona a primeira arvore por padrao
                        $scope.dtreeSelected = $scope.decisiontrees[0];
                        $scope.classifProcess.Classificacao.decision_tree_id = $scope.dtreeSelected.DecisionTree.id;
                    }

                    if (callback) {
                        callback($scope.decisiontrees);
                    }

                });
            };

            var validateDtreeLayers = function(paramsLayers, dtree) {

                if (!dtree) {
                    return {};
                }

                var layers = {};

                var matchLayers = true;

                var dtreeKeys = Object.keys(dtree);

                dtreeKeys.forEach(function(dtreeKey) {
                    var dtreeNode = dtree[dtreeKey];
                    if (dtreeNode.kind == 'decision') {
                        if (paramsLayers[dtreeNode.rule.variable]) {
                            layers[dtreeNode.rule.variable] = paramsLayers[dtreeNode.rule.variable];
                        } else {
                            matchLayers = false;
                        }
                    }
                });

                if (!matchLayers) {
                    return matchLayers;
                }

                return layers;
            };
        }
    ]);