'use strict';
angular.module('MapBiomas.controllers')
    .controller('DtreeController', ['$rootScope', '$scope', '$routeParams', '$location', '$http', '$filter', '$injector',
        function($rootScope, $scope, $routeParams, $location, $http, $filter, $injector) {

            var AppAuth = $injector.get('AppAuth');
            var Mload = $injector.get('Mload');
            var $uibModal = $injector.get('$uibModal');
            var Notify = $injector.get('Notify');            

            var DtreeMapAPI = $injector.get('DtreeMapAPI');
            var ClassificacaoService = $injector.get('ClassificacaoService');
            var DecisionTreeService = $injector.get('DecisionTreeService');
            var GeeImageService = $injector.get('GeeImageService');

            var authUser = AppAuth.user;

            var cartaSelecionda;

            /**
             * Inicia controller
             */
            $scope.init = function() {
                // inicia variaveis  
                $scope.selectAnos = [];
                $scope.resultados = [];
                $scope.loadResultados = false;

                // valores iniciais dos anos
                for (var i = 1985; i <= 2016; i++) {
                    $scope.selectAnos.push(i.toString());
                }

                $scope.classifProcess = {
                    Classificacao: {}
                };

                // listar dtrees salvas 
                // *futura implementação - ngmodel do select classificacao.decision_tree_id
                $scope.dtreeSelected = null;

                $scope.dtreeForm = null;

                decisionTreeList(true);
            };

            $scope.saveDtree = function(dtree) {

                if (!dtree.DecisionTree.id) {
                    dtree.DecisionTree.bioma_id = authUser.UsuarioBioma.bioma_id;
                }

                DecisionTreeService.save(dtree, function(dtreeResp) {

                    Notify.success($filter('translate')('SALVADTREE-SUCESSO'));

                    decisionTreeList(false, function(data) {
                        angular.forEach(data, function(value, key) {
                            if (value.DecisionTree.id == dtreeResp.DecisionTree.id) {
                                $scope.dtreeSelected = $scope.decisiontrees[key];
                                $scope.dtreeForm = dtreeResp;                                
                            }                            
                        });
                    });
                },function(){
                    Notify.warning($filter('translate')('SALVADTREE-AVISO'));
                });
            };

            $scope.saveNewDtree = function(dtree) {
                var dtreeNew = angular.copy(dtree);
                delete dtreeNew.DecisionTree.id;
                delete dtreeNew.DecisionTree.classe_legenda_id;
                $scope.saveDtree(dtreeNew);
            };


            /**
             * Remove Decision tree
             * @param {Object} objeto DecisionTree
             */
            $scope.removeDtree = function(dtree) {

                if (dtree.DecisionTree.usuario_id != authUser.UsuarioBioma.usuario_id) {
                    Mload.alert('Removal not allowed', "This decision tree was created by another user.", "modal-info");
                    return;
                }

                DecisionTreeService.delete({
                    id: dtree.DecisionTree.id
                }, function(dtreeResp) {
                    decisionTreeList(true);
                });
            };


            /**
             * Processa imagem usando serviço gee python
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            $scope.geeImagemProcessar = function(classificacao) {

                var dtree = $scope.dtreeForm.DecisionTree.dtree;

                var classificacaoProcesss = {
                    Classificacao: angular.copy(classificacao.Classificacao),
                    DecisionTree: {
                        dtree: dtree
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
                    function() {
                        Mload.hide();
                    },
                    function() {
                        Mload.hide();
                        Mload.load("Google Earth Engine Authentication", "You must to give permission access to process images on Workspace.");
                        setTimeout(function() {
                            Mload.hide();
                        }, 5000);
                    },
                    true
                );
            };


            /**
             * carrega dados de classificação ao selecionar uma carta
             * @param {String} carta codigo da carta selecionada
             * @param {Object} classificacao objeto modelo de dados de classificacao
             */
            $scope.cartaEventClick = function(carta) {

                $scope.classifProcess.Classificacao.carta = carta;

                cartaSelecionda = carta;

                $scope.$apply();
            };


            /**
             * Função que executa quando o componente g
             * rafico decisiontree é modificado
             */
            $scope.dtreeRender = function(dtree) {

                $scope.dtreeForm.DecisionTree.dtree = dtree;

                if (!$scope.imagensProcessadas) {
                    $scope.$apply();
                    return;
                }

                var dtreeLayer = DtreeMapAPI.getWorkLayer();

                if (dtreeLayer) {

                    dtreeLayer.setProcessedLayers(validateDtreeLayers($scope.imagensProcessadas, dtree));

                    dtreeLayer.setDtree(dtree);
                }

                $scope.$apply();
            };

            /**
             * Função que executa quando dtree selecionada é alterada             
             */
            $scope.dtreeSelectedChange = function() {

                if ($scope.dtreeSelected) {
                    $scope.dtreeForm = angular.copy($scope.dtreeSelected);
                } else {
                    $scope.dtreeForm = {
                        DecisionTree: {
                            dtree: null
                        }
                    };
                }

                var dtree = $scope.dtreeForm.DecisionTree.dtree;

                var dtreeWorkLayer = DtreeMapAPI.getWorkLayer();

                if (dtreeWorkLayer) {

                    dtreeWorkLayer.setProcessedLayers(validateDtreeLayers($scope.imagensProcessadas, dtree));

                    dtreeWorkLayer.setDtree(dtree);
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


            var decisionTreeList = function(selectFirst, callback) {                

                var conditions = {
                    "OR": [{
                            "DecisionTree.bioma_id": authUser.UsuarioBioma.bioma_id
                        },
                        ["DecisionTree.bioma_id ISNULL"]
                    ]
                };

                if (authUser.Usuario.perfil_id == 1) {
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
                        $scope.dtreeForm = $scope.decisiontrees[0];
                        //$scope.classifProcess.Classificacao.decision_tree_id = $scope.dtreeSelected.DecisionTree.id;
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

                var dtreeKeys = Object.keys(dtree);

                dtreeKeys.forEach(function(dtreeKey) {
                    var dtreeNode = dtree[dtreeKey];
                    if (dtreeNode.kind == 'decision') {
                        layers[dtreeNode.rule.variable] = paramsLayers[dtreeNode.rule.variable];
                    }
                });

                return layers;
            };
        }
    ]);