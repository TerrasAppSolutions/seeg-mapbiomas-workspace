'use strict';
angular.module('MapBiomas.controllers')
    .controller('IntegrationController', ['$injector', '$scope',
        function ($injector, $scope) {

            var vm = this;

            // dependências 
            var Notify = $injector.get('Notify');
            var $uibModal = $injector.get('$uibModal');
            var IntegrationProjectService = $injector.get('IntegrationProjectService');
            var IntegrationService = $injector.get('IntegrationService');
            var ClasseAssetService = $injector.get('ClasseAssetService');

            /**
             * Variáveis vm
             */
            // opções para projetos
            vm.integrationProjectOptions = [];
            // opção esolhida: temporal  project option id
            vm.choosedProject;
            // classes disponívleis
            vm.availableClasses = [];
            // classes selecionadas
            vm.selectedClasses = [];
            // inicia sortable dependendo do projeto
            vm.startSortable = {};

            /**
             * Funções vm
             */
            // modal de criação de projeto
            vm.createProjectModal = createProjectModal;
            // escolher integration project
            vm.projectChoices = projectChoices;
            // adiciona elemento
            vm.addElement = addElement;
            // remove elemento
            vm.removeElement = removeElement;
            // altera posição do elemento
            vm.changePosition = changePosition;
            // salvar regras de integração
            vm.saveIntegrationRules = saveIntegrationRules;
            // definição de projeto principal
            vm.defineAsMainProject = defineAsMainProject;
            // deletar projeto
            vm.deleteProject = deleteProject;
            // edição de projeto
            vm.editProject = editProject;

            // inicia controller
            var init = function () {
                // $('.collapse').collapse();
                // $('.dropdown-toggle').dropdown()

                // get all the projects
                IntegrationProjectService.query({
                    options: {
                        conditions: {},
                        order: "IntegrationProject.created DESC",
                    }
                }, function (respData) {
                    console.log("RESP", respData);
                    
                    vm.integrationProjectOptions = respData;
                });

                // get all classes
                ClasseAssetService.query({
                    options: {
                        conditions: {},
                        order: "Classe.valor ASC",
                    }
                }, function (respData) {
                    console.log("CLASSES", respData);
                    
                    vm.availableClasses = respData;
                });
            }

            /**
             * ng-change: escolha de projeto
             * @param {project} project projeto escolhido
             */
            function projectChoices(project) {
                vm.choosedProject = project;
                IntegrationService.query({
                    options: {
                        conditions: {
                            'integration_project_id': project.id
                        },
                        order: "prevalence_id",
                    }
                }, function (respData) {                    
                    vm.selectedClasses = respData;
                    vm.startSortable.run(respData);
                });
            }

            /**
             * Modal de criação de projeto
             * @param {none} none 
             */
            function createProjectModal(project) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'js/app/views/modules/integration-project.modal.html',
                    size: 'sm',
                    controller: function (Project, $scope, $uibModalInstance) {
                        // verifica se há projeto pré-definido
                        if (Project) {
                            $scope.integrationFilterProject = angular.copy(Project);
                        }
                        // open modal
                        $scope.ok = function (integrationProject) {
                            IntegrationProjectService.save(integrationProject, function (result) {                           

                                // adiciona a lista de opções de projeto
                                // caso não seja edição
                                if (!Project) {
                                    vm.integrationProjectOptions.unshift(result);
                                }
                                // após criado ele será selecionado
                                vm.choosedProject = result.IntegrationProject;

                                $uibModalInstance.close(true);
                            })
                        };
                        // close modal
                        $scope.cancel = function () {
                            $uibModalInstance.close(false);
                        };
                    },
                    resolve: {
                        Project: function () {
                            return project;
                        },
                    }
                });

                modalInstance.result.then(function (result) {
                    /**
                     * true: created
                     * false: canceled
                     */
                    if (result) {
                        // reinicia a ferramenta
                        // console.log("RESULT", result);
                        // vm.choosedProject = result;
                        
                        vm.startSortable.run([]);
                        Notify.success("Project successfuly created!");
                    }
                })
            }

            /**
             * adição de elemento
             * é chamado na diretiva widget.sortable
             * arr.splice(index, 0, item);
             * @param {info} info informações do elemento adicionado
             */
            function addElement(info) {
                vm.selectedClasses.splice(info.newIndex, 0, vm.availableClasses[info.oldIndex]);
                $scope.$apply();                
            }

            /**
             * remoção de elemento
             * @param {index} index index do elemento removido
             */
            function removeElement(index) {                
                vm.selectedClasses.splice(index, 1);
                $scope.$apply();
            }

            /**
             * alteração posição elemento
             * @param {info} info informação da troca de posição
             */
            function changePosition(info) {
                // retira elemento da lista
                var removedElement = vm.selectedClasses.splice(info.oldIndex, 1);
                // volta a adicionar em uma nova posição
                vm.selectedClasses.splice(info.newIndex, 0, removedElement[0]);
                $scope.$apply();
            }

            /**
             * função de salvamento de regras de filtro de integração
             * @param {rules} rules regras a serem salvas
             */
            function saveIntegrationRules(rules) {
                IntegrationService.saveLot(rules, function (result) {
                    Notify.success("Rules successfuly saved!");
                    //vm.selectedClasses = result;
                });
            }

            $scope.$watch('vm.selectedClasses', function (newValue, oldValue) {
                var sendRules = [];
                var rules = newValue;

                for (var i = 0; i < rules.length; i++) {
                    var element = angular.copy(rules[i]);
                    console.log("ELEMENTOOOOO", element);
                    
                    if (element['Integration']) {
                        delete element['Integration'];
                    }
                    element['Integration'] = {
                        classe_asset_id: element.ClasseAsset.id,
                        integration_project_id: vm.choosedProject.id,
                        prevalence_id: i,
                    };
                    sendRules.push(element);
                }
                vm.selectedClasses = sendRules;
            }, true);

            /**
             * 
             * @param {project} project projeto de integração
             */
            function defineAsMainProject(project) {
                console.log("PROJETO", project);
                IntegrationProjectService.activate(project, function (result) {
                    console.log("RESULTADOOOOO", result);

                    for (var i = 0; i < vm.integrationProjectOptions.length; i++) {
                        var element = vm.integrationProjectOptions[i];
                        
                        // todos os projeto ativos como falso
                        element.IntegrationProject.active = false;

                        // quando encontra o projeto, ele define como desejado
                        if (element.IntegrationProject.id == result.IntegrationProject.id) {
                            element.IntegrationProject.active = result.IntegrationProject.active;
                        }
                    }
                });
            }

            /**
             * função de deletar projeto
             * @param {project} project projeto de integração
             */
            function deleteProject(project) {
                console.log("Project", project);
                
                var r = confirm("Are you sure?");

                if (r) {
                    console.log("DELETED");

                    IntegrationProjectService.delete({
                        id: project.id
                    }, function (result) {
                        console.log("RESULTADO", result);
                        
                        // remove elemento da lista de projetos
                        var index = _.findIndex(vm.integrationProjectOptions, {
                            'IntegrationProject': project
                        });

                        // remove dados de projeto
                        delete vm.choosedProject;


                        vm.integrationProjectOptions.splice(index, 1);
                    });
                }
            }

            /**
             * edição de projeto de integração
             * @param {project} project projeto de integração
             */
            function editProject(project) {
                console.log("EDIT", project);
                createProjectModal(project);
            }

            init();
        }
    ]);