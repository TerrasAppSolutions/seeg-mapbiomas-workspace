'use strict';
angular.module('MapBiomas.controllers')
    .controller('MapBiomasController', ['$rootScope', '$scope', '$routeParams', '$location', '$http', '$injector',
        function ($rootScope, $scope, $routeParams, $location, $http, $injector) {

            var WorkmapAPI = $injector.get('WorkmapAPI');
            var ClassificacaoService = $injector.get('ClassificacaoService');
            var CartaResultadoService = $injector.get('CartaResultadoService');
            var GEEImageService = $injector.get('GEEImageService');
            var CartaResultadoService = $injector.get('CartaResultadoService');
            $scope.forest = true;
            $scope.nonforest = true;
            $scope.water = true;

            var elevationmin = 0;
            var elevationmax = 20;

            $scope.init = function () {
                // inicia variaveis iniciais
                $scope.mapCartaOptions = {
                    toolTipCarta: false,
                    cartaName: "SB-21-Z-D",
                    loadResultados: false
                };

                $scope.selectAnos = [];
                $scope.resultados = [];
                $scope.loadResultados = false;

                for (var i = 1984; i < 2016; i++) {
                    $scope.selectAnos.push(i.toString());
                }
            };

            $scope.salvarClassificacao = function (classificacao) {
                $scope.loadShow = true;
                ClassificacaoService.save(classificacao, function (classificacaoResp) {
                    ClassificacaoService.query({
                        options: {
                            conditions: {
                                "Classificacao.carta": classificacaoResp.Classificacao.carta
                            },
                            order:"Classificacao.id DESC"
                        }
                    }, function (respData) {
                        $scope.classificacaoResultados = respData;
                        $scope.loadShow = false;
                    },function(){
                        $scope.loadShow = false;
                    });
                });
            };

            $scope.showClasses = function(class_, enable){
              WorkmapAPI.showClasses(class_, enable);

            };


            $scope.elevation_on = false;

            $scope.salvarNovoClassificacao = function (classificacao) {
                var novoClassificacao = angular.copy(classificacao);
                delete novoClassificacao.Classificacao.id;
                $scope.salvarClassificacao(novoClassificacao);
            };

            // carrega dados de classificação ao selecionar uma carta
            $scope.cartaEventClick = function (carta) {
                $scope.loadResultados = true;
                ClassificacaoService.query({
                    options: {
                        conditions: {
                            "Classificacao.carta": carta
                        },
                        order:"Classificacao.id DESC"
                    }
                }, function (respData) {
                    $scope.classificacaoResultados = respData;
                    $scope.loadResultados = false;
                });
            };

            $scope.salvar_on = false;

            // processa imagem usando serviço gee python
            $scope.geeImagemProcessar = function (classificacao) {
                $scope.loadShow = true;
                $scope.loadResultados = true;
                var processParams = {
                    'year': classificacao.Classificacao.year,
                    'gridName': classificacao.Classificacao.carta,
                    't0': moment(classificacao.Classificacao.t0).format('YYYY-MM-DD'),
                    't1': moment(classificacao.Classificacao.t1).format('YYYY-MM-DD'),
                    'cc': classificacao.Classificacao.cloudcover,
                    'dtv_v1': classificacao.Classificacao.dtv.dtv1,
                    'dtv_v2': classificacao.Classificacao.dtv.dtv2,
                    'dtv_v3': classificacao.Classificacao.dtv.dtv3,
                    'dtv_v4': classificacao.Classificacao.dtv.dtv4,
                    'sensor': classificacao.Classificacao.sensor,
                    'color': classificacao.Classificacao.color,
                    'bioma': classificacao.Classificacao.bioma,
                    'region': classificacao.Classificacao.region,
                };

                $scope.$watch('elevation_on', function(newValue, oldValue){
                  if(newValue && classificacao){
                    classificacao.Classificacao.elevation_on = 1;
                  }else{
                    classificacao.Classificacao.elevation_on = 0;
                  }
                });


                if(classificacao.Classificacao.elevation_on === 1){
                    processParams.elevcotas_on = 1;
                    processParams.elevmin = parseInt(classificacao.Classificacao.elevation_min);
                    processParams.elevmax = parseInt(classificacao.Classificacao.elevation_max);
                    $scope.elevation_on = true;
                }else{
                   processParams.elevcotas_on = 0;
                   processParams.elevmin = 0;
                   processParams.elevmax = 20;
                   $scope.elevation_on = false;
                }


                var waterf = {'classValue': 1, 'maxSize': 5};
                var forestf = {'classValue': 2, 'maxSize': 5};
                var nonforestf = {'classValue': 3, 'maxSize': 5};
                processParams.spatialFilter = [waterf, forestf, nonforestf];


                console.log(classificacao.Classificacao);

                $scope.processar_on = false;

                GEEImageService.getResultados(
                    processParams,
                    function (respData) {
                        var data = respData.data;
                        $scope.imagensProcessadas = data;
                        $scope.loadShow = false;
                        $scope.loadResultados = false;
                        $scope.processar_on = true;
                        $scope.salvar_on = true;
                        console.log(respData);
                    },
                    function (respData) {
                        $scope.loadShow = false;
                        $scope.loadResultados = false;
                        $scope.processar_on = true;
                        $scope.salvar_on = false;
                        console.log(respData);
                    }

                );
            };


            $scope.processarResultado = function (classificacao) {
                $scope.classifProcess = angular.copy(classificacao);
                $scope.geeImagemProcessar($scope.classifProcess);
            };

            var originatorEv;
            $scope.openMenu = function ($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };

            $scope.decreaseValue = function (value) {
                value = parseInt(value) - 1;
            };

            $scope.increaseValue = function (value) {
                value = parseInt(value) + 1;
            };

            $scope.selectAnoChange = function (yearResultado) {

                if(yearResultado){
                  $scope.classifProcess = angular.copy(yearResultado);
                }

            }

            $scope.processar_on = false;

            $scope.$watch('classifProcess',
                function (newValue, oldValue) {
                    if (newValue) {
                          $scope.processar_on = true;
                    }
            });

            $scope.filterUpdate = function (classificacao) {
                WorkmapAPI.getDTreeLayer().setFilter(parseInt(classificacao.Classificacao.dtv.dtv1), parseInt(classificacao.Classificacao.dtv.dtv2), parseInt(classificacao.Classificacao.dtv.dtv3), parseInt(classificacao.Classificacao.dtv.dtv4));
            }

            $scope.init();

        }
    ]);
