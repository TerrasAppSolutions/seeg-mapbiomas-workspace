'use strict';
angular.module('MapBiomas.controllers')
    .controller('ClasseAreasListarController', ['$rootScope', '$scope', '$stateParams', '$location', '$http', '$injector', '$filter','$window',
        function($rootScope, $scope, $stateParams, $location, $http, $injector, $filter,$window) {

            // dependências 
            var Notify = $injector.get('Notify');
            var ClasseAreaService = $injector.get('ClasseAreaService');
            var authUser = $injector.get('AppAuth').user;            
            var AreaClasseType = $injector.get('AreaClasseType');
            var Mload = $injector.get('Mload');

            // paginação 
            $scope.pageSize = 10;
            $scope.page = 1;
            $scope.totalPages = 0;

            // formFilter
            $scope.formFilterConditions = {};
            $scope.classeAreasTotal;

            $scope.selectAnos = [];

            /**
             * Inicia controller             
             */
            $scope.init = function() {

                $scope.AreaClasseType = AreaClasseType;

                // anos disponiveis para pesquisa
                for (var i = 2016; i >= 1985; i--) {
                    $scope.selectAnos.push(i.toString());
                }

                $scope.paginate($scope.page, $scope.pageSize);
            };
            

            // paginação de listagem de parametros de classificação
            $scope.paginate = function(page, limit) {

                var paginateConditions = factoryListConditions($scope.formFilterConditions);                

                if (paginateConditions == false) {
                    return;
                }

                ClasseAreaService.paginate({
                    page: page,
                    limit: limit,
                    options: {
                        conditions: paginateConditions,
                        order: "ClasseArea.id DESC",
                    }
                }, function(result) {
                    $scope.classeAreas = result.data;
                    $scope.page = result.page;
                    $scope.totalPages = result.totalPages;
                    $scope.classeAreasTotal = result.total;
                }, function(err) {

                });
            };

            // exporta registros para formato csv
            $scope.exportToCSV = function() {

                var paginateConditions = factoryListConditions($scope.formFilterConditions);                

                if (paginateConditions == false) {
                    return;
                }

                
                $scope.exportCSVloading = true;               
                ClasseAreaService.exportCSV({                    
                    options: {
                        conditions: paginateConditions                        
                    }
                }, function(result) {                
                    console.log($window);
                    $window.open(result);
                    $scope.exportCSVloading = false;               
                });
            };

            // form filter funções
            $scope.formFilterChange = function() {
                $scope.page = 1;
                $scope.paginate($scope.page, $scope.pageSize);
            };

            $scope.formFilterClear = function() {
                $scope.formFilterConditions = {};
                $('#formFilter-data_inicial').val("");
                $('#formFilter-data_final').val("");
                $scope.page = 1;                
                $scope.paginate($scope.page, $scope.pageSize);
            };

            // construtor de condições de pesquisa
            var factoryListConditions = function(formFilterConditions) {
                var conditions = {};

                var data_inicial, data_final;                
                
                if (formFilterConditions.carta) {
                    conditions["ClasseArea.carta iLike"] = "%" + formFilterConditions.carta + "%";
                }                

                if (formFilterConditions.year) {
                    conditions["ClasseArea.year"] = formFilterConditions.year;
                }

                if (formFilterConditions.bioma_id) {
                    conditions["ClasseArea.bioma_id"] = formFilterConditions.bioma_id;
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
                        "ClasseArea.created between ? and ?": [data_inicial, data_final],
                        "ClasseArea.modified between ? and ?": [data_inicial, data_final],
                    };
                }

                if (data_inicial > data_final) {
                    Notify.error('Starting date is greater than the end date', $('#formFilter-data_inicial'));
                    return false;
                }

                return conditions;
            };

            $scope.init();
        }
    ])
    .controller('ClasseAreasListarModalController',
        function($scope, $uibModalInstance, params) {

            /**
             * Controller do modal de listagem de classificações
             * este controller será herdado por ClasseAreasListarController
             * variavel params definda pelo controller MapBiomasController 
             * que executa o modal
             */

            $scope.cartaSelecionda = params.cartaSelecionda;

            $scope.modalClose = function() {
                $uibModalInstance.close();
            };
        }
    );