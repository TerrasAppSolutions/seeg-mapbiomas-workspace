'use strict';
angular.module('MapBiomas.controllers')
    .controller('TemporalFilterController', ['$injector', '$scope',
        function ($injector, $scope) {

            var vm = this;

            // dependências 
            var Notify = $injector.get('Notify');
            var $uibModal = $injector.get('$uibModal');
            var TemporalFilterService = $injector.get('TemporalFilterService');
            var TemporalFilterProjectService = $injector.get('TemporalFilterProjectService');
            var ClassesService = $injector.get('ClassesService');

            /**
             * Variáveis vm
             */

            // filtro temporal

            // kernel de valores
            vm.kernelValues;
            // valores de classe
            vm.classeValues = [];
            // regra para ser salva
            vm.ruleToSave = {
                active: true
            };
            // todas as regras
            vm.allRules = [];
            // objeto de classes
            vm.classesObject = {};
            // opções para projetos
            vm.temporalFilterProjectOptions = [];
            // opção esolhida: temporal filter project option id
            vm.tfProjectChoosed;
            // select para habilitar
            vm.selectToEnable;
            // anos que podem ser processados
            vm.years = _.range(2010, 2018);

            /**
             * Funções vm
             */
            vm.saveRuleTemporal = saveRuleTemporal;
            vm.deleteRule = deleteRule;
            // definindo algumas regras de acordo com o tipo de regra
            vm.rulesToKernel = rulesToKernel;
            // modal de criação de projeto
            vm.createProjectModal = createProjectModal;
            // modal de criação de projeto
            vm.cloneProjectModal = cloneProjectModal;
            // escolher temporal filter project
            vm.chooseTFProject = chooseTFProject;
            // habilitar seleção de select
            vm.enableSelect = enableSelect;

            /**
             * Scope variables
             */
            $scope.pageSize = 5;
            $scope.page = 1;
            $scope.totalPages = 0;

            $scope.formFilterConditions = {};

            // nome do bioma do projeto selecionado
            vm.biomeName;

            // inicia controller
            var init = function () {
                // get all the projects
                TemporalFilterProjectService.query({
                    options: {
                        conditions: {},
                        order: "TemporalFilterProject.created DESC",
                    }
                }, function (respData) {
                    vm.temporalFilterProjectOptions = respData;
                });

                // obtenção dos valores de classes
                ClassesService.query({
                    options: {
                        conditions: {},
                        order: "Classe.id ASC",
                    }
                }, function (respData) {
                    vm.classeValues = respData;
                    // adiciona o valor de qualquer classe no início da lista de classes
                    vm.classeValues.unshift({
                        Classe: {
                            valor: 0,
                            classe: 'Qualquer Classe'
                        }
                    });
                    vm.classesObject = translateToObjectReference(vm.classeValues);                    
                });

                // filtro temporal
                vm.kernelValues = [3, 5];
            };

            /**
             * 
             * @param {[3, 5]} kernel kernel selecionado
             * @param {['RG', 'RP', 'RU']} type regra de definição para o filtro
             */
            function enableSelect(kernel, type) {
                // se a regra é 'RG', habilita 'qualquer classe' em 't'
                if (type === 'RG') {
                    vm.selectToEnable = 't';
                } else if (kernel === 5 && type === 'RP') {
                    vm.selectToEnable = 'tminus2';
                } else if (kernel === 3 && type === 'RP') {
                    vm.selectToEnable = 'tminus1';
                } else if (kernel === 5 && type === 'RU') {
                    vm.selectToEnable = 'tplus2';
                } else if (kernel === 3 && type === 'RU') {
                    vm.selectToEnable = 'tplus1';
                } else {
                    delete vm.selectToEnable;
                }
            }

            /**
             * ng-change: escolha de projeto
             * @param {chooseTFProject} id 
             */
            function chooseTFProject(project) {
                console.log("bioma: ", project);

                // configura nome bioma
                vm.biomeName = project.biome_name;
                
                // reiniciando paginação
                $scope.pageSize = 5;
                $scope.page = 1;
                $scope.totalPages = 0;
                // obtenção das regras de filtro já armazenadas
                $scope.paginate($scope.page, $scope.pageSize);
            }

            /**
             * Salvamento de regra de filtro temporal
             * O parâmetro change refere a definição de regra ativa ou não. Assim diferencia de um salvamento completo
             * @param {saveRuleTemporal} rule 
             */
            function saveRuleTemporal(rule, change) {
                // adicionando id do projeto
                rule['filter_project_id'] = vm.tfProjectChoosed.id;
                // salva o filtro temporal
                TemporalFilterService.save(rule, function (result) {
                    if (!change) {
                        // inserindo dado no início do vetor
                        vm.allRules.unshift(result);
                        // apaga dados do formulário
                        vm.ruleToSave = {
                            active: true
                        };
                        // redefine a paginação ao deletar elemento
                        $scope.paginate($scope.page, $scope.pageSize);
                        Notify.success("Rule saved!");
                    }
                });
            }

            /**
             * Deleção de regra de filtro temporal
             * @param {deleteRule} id 
             */
            function deleteRule(id, index) {
                TemporalFilterService.delete({
                    id: id
                }, function (result) {
                    vm.allRules.splice(index, 1);
                    // redefine a paginação ao deletar elemento
                    $scope.paginate($scope.page, $scope.pageSize);
                    Notify.success("Rule deleted!");
                }, function (err) {});
            }

            /**
             * regras de acordo com a esolha do kernel
             * apagar valores da primeira e última classe para kernel 3
             */
            function rulesToKernel() {
                if (vm.ruleToSave.kernel === 3) {
                    delete vm.ruleToSave.tminus2;
                    delete vm.ruleToSave.tplus2;
                }
            }

            /**
             * Recebe um array e retorna um objeto que toma como referência o id
             * @param {translateToObjectReference} obj 
             */
            function translateToObjectReference(array) {
                var obj = {};
                for (var i = 0; i < array.length; i++) {
                    var element = array[i];
                    obj[element.Classe.valor] = element.Classe;
                }
                return obj;
            }

            /**
             * Paginação de regras de filtro de integração
             * @param {paginate} page 
             * @param {Limit 5} limit 
             */
            $scope.paginate = function (page, limit) {
                var paginateConditions = factoryListConditions($scope.formFilterConditions);

                if (paginateConditions == false) {
                    return;
                }

                TemporalFilterService.paginate({
                    page: page,
                    limit: limit,
                    options: {
                        conditions: paginateConditions,
                        order: "TemporalFilter.created DESC",
                    }
                }, function (result) {
                    vm.allRules = result.data;
                    $scope.page = result.page;
                    $scope.totalPages = result.totalPages;

                    $scope.exportacaoTarefasTotal = result.total;

                    if (result.data.length == 0) {
                        Notify.info('No records found');
                    }
                }, function (err) {
                    Notify.error('Error in getting rules. Try again later.');
                });
            };

            // construtor de condições de pesquisa
            var factoryListConditions = function (formFilterConditions) {
                var conditions = {};

                var data_inicial, data_final;

                conditions['filter_project_id'] = vm.tfProjectChoosed.id;

                if (data_inicial > data_final) {
                    Notify.error('Starting date is greater than the end date', $('#formFilter-data_inicial'));
                    return false;
                }

                return conditions;
            };

            /**
             * Modal de criação de projeto
             */
            function createProjectModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'js/app/views/filtros/create-project-modal.html',
                    size: 'sm',
                    controller: function ($scope, $uibModalInstance) {
                        // open modal
                        $scope.ok = function (temporalFilterProject) {
                            TemporalFilterProjectService.save(temporalFilterProject, function (result) {
                                // adiciona a lista de opções de projeto
                                vm.temporalFilterProjectOptions.unshift(result);
                                // após criado ele será selecionado
                                vm.tfProjectChoosed = result.TemporalFilterProject;
                                // redefine a paginação ao deletar elemento
                                //
                                $uibModalInstance.close(true);
                            })
                        };
                        // close modal
                        $scope.cancel = function () {
                            $uibModalInstance.close(false);
                        };
                    },
                    resolve: {}
                });

                modalInstance.result.then(function (result) {
                    /**
                     * true: created
                     * false: canceled
                     */
                    if (result) {
                        Notify.success("Project successfuly created!");
                        $scope.paginate($scope.page, $scope.pageSize);
                    }
                })
            }
            /**
             * Modal de clonagem de projeto
             */
            function cloneProjectModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'js/app/views/filtros/create-project-modal.html',
                    size: 'sm',
                    controller: function (choosedProject, $scope, $uibModalInstance) {
                        console.log("Choosed", choosedProject);
                        // deleção de dados
                        $scope.temporalFilterProject = angular.copy(choosedProject);
                        delete $scope.temporalFilterProject.biome_name;
                        delete $scope.temporalFilterProject.modified;
                        delete $scope.temporalFilterProject.created;
                        $scope.temporalFilterProject.name = $scope.temporalFilterProject.name + ' - Copy';

                        
                        // open modal
                        $scope.ok = function (temporalFilterProject) {
                            TemporalFilterProjectService.clone(temporalFilterProject, function (result) {
                                console.log("RESULT", result);
                                
                                // adiciona a lista de opções de projeto
                                vm.temporalFilterProjectOptions.unshift(result);
                                // após criado ele será selecionado
                                vm.tfProjectChoosed = result.TemporalFilterProject;
                                // redefine a paginação ao deletar elemento
                                //
                                $uibModalInstance.close(result);
                            })
                        };
                        // close modal
                        $scope.cancel = function () {
                            $uibModalInstance.close(false);
                        };
                    },
                    resolve: {
                        choosedProject: function () {
                            return vm.tfProjectChoosed;
                        },
                    }
                });

                modalInstance.result.then(function (result) {
                    /**
                     * true: created
                     * false: canceled
                     */
                    if (result) {
                        Notify.success("Project copy successfuly created!");
                        chooseTFProject(result.TemporalFilterProject);
                    }
                })
            }

            init();
        }
    ]);