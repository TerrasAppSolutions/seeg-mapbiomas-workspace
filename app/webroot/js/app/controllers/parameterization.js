/**
 * Parameterization of Random Forest Classifier
 * Work with parameterization.html
 */

'use strict';
angular.module('MapBiomas.controllers')
    .controller('ParameterizationController', ['$injector', '$scope',
        function ($injector, $scope) {
            // dependências
            var ClassesService = $injector.get('ClassesService');
            var AssetSampleService = $injector.get('AssetSampleService');
            var Notify = $injector.get('Notify');
            var BandCustomService = $injector.get('BandCustomService');
            var FeatureSpaceService = $injector.get('FeatureSpaceService');
            var MosaicCartaProjectService = $injector.get('MosaicCartaProjectService');
            var ClassificationProjectService = $injector.get('ClassificationProjectService');
            var ClassificationService = $injector.get('ClassificationService');
            var CartaBiomaService = $injector.get('CartaBiomaService');

            // variáveis
            var vm = this;
            vm.classes = [];
            vm.mosaicProjects = [];
            vm.projectChoosed;
            vm.selectedClasses = [];
            vm.assets = [];
            vm.randomForestProject = {};
            vm.randomForestProjects = [];
            vm.collection;
            vm.randomForestTasks = {};

            /**
             * Scope variables
             */
            $scope.pageSize = 20;
            $scope.page = 1;
            $scope.totalPages = 0;

            // variáveis globais
            var treeBands = [];
            var bandsDictionary = {};
            var allBands = [];
            var allClasses = [];

            // functions
            vm.createTableOfProject = createTableOfProject;
            vm.toggleClasseSelection = toggleClasseSelection;
            vm.createProject = createProject;
            vm.chooseProject = chooseProject;
            vm.createTasks = createTasks;
            vm.changeStatusTask = changeStatusTask;
            vm.deleteProject = deleteProject;
            vm.cloneProject = cloneProject;
            vm.editProject = editProject;
            vm.cancelEditProject = cancelEditProject;
            vm.resetFeatureSpace = resetFeatureSpace;
            vm.deleteTask = deleteTask;

            // inicia controller
            var init = function () {
                // obtenção dos valores de classes
                ClassesService.query({
                    options: {
                        conditions: {},
                        order: "Classe.valor ASC",
                    }
                }, function (respData) {
                    allClasses = angular.copy(respData);
                    // console.log("REsp", allClasses);

                    vm.classes = respData;
                });

                // asset de amostras random forest
                AssetSampleService.query(function (result) {
                    console.log("Resutlado", result);
                    vm.assets = result;
                })

                // carrega dados de feature space
                FeatureSpaceService.query(function (result) {
                    // global variables
                    //var bands = BandCustomService.getBands();
                    allBands = angular.copy(result);
                    treeBands = BandCustomService.generateTree(angular.copy(result));
                    console.log("TRREE", result);
                    // return;

                    // bandsDictionary = translateToObjectReference(result);

                    // console.log("bandsDictionary", bandsDictionary);


                    BandCustomService.createJsTreeTable(treeBands);
                    // console.log("treeBands", treeBands);
                });

                // get stored mosaics
                MosaicCartaProjectService.query({
                    options: {
                        conditions: {},
                    }
                }, function (result) {
                    for (var i = 0; i < result.length; i++) {
                        var element = result[i];
                        result[i].MosaicCartaProject.parameters = JSON.parse(element.MosaicCartaProject.parameters);
                        vm.mosaicProjects.push(result[i]);
                    }
                });

                // obtem dado de projetos random forest
                ClassificationProjectService.query({
                    options: {
                        conditions: {},
                        order: "created ASC",
                    }
                }, function (result) {
                    // for (var i = 0; i < result.length; i++) {
                    //     var element = result[i];
                    //     result[i].MosaicCartaProject.parameters = JSON.parse(element.MosaicCartaProject.parameters);
                    //     vm.mosaicProjects.push(result[i]);
                    // }
                    // console.log("RESULYTADO", result);
                    for (var i = 0; i < result.length; i++) {
                        var element = result[i];
                        result[i].ClassificationProject.parameters = JSON.parse(element.ClassificationProject.parameters);
                        vm.randomForestProjects.push(result[i]);
                    }
                    console.log("RANDOM PROJECT", vm.randomForestProjects);

                    // vm.randomForestProjects = result;
                });

                CartaBiomaService.query(function (cartaBioma) {
                    // console.log("cartaBioma", cartaBioma);
                    vm.cartaBioma = cartaBioma;
                    var data = [];
                    for (var i = 0; i < cartaBioma.length; i++) {
                        var carta = cartaBioma[i];
                        // $("#chart-multiple").addSelect2Items([{
                        //     id: carta.Carta.id,
                        //     text: carta.Carta.codigo
                        // }], {});

                        data.push({
                            id: carta.Carta.id,
                            text: carta.Carta.codigo
                        })
                    }

                    $("#chart-multiple").select2({
                        placeholder: "Select charts",
                        // theme: "flat"
                        data: data,
                        multiple: true,
                        width: '300px'
                    });
                });
            }

            function createTableOfProject(project) {
                console.log("TESTEEEEEEEEE", project);
                var features = project.MosaicCartaProject.parameters.bands;

                var featuresDictionary = BandCustomService.translateToObjectReference(features);

                var mapBands = BandCustomService.generateTree(allBands, featuresDictionary, true);

                console.log("mapBands", mapBands);
                // return;

                BandCustomService.createJsTreeTable(mapBands);
            }

            /**
             * Recebe um array e retorna um objeto que toma como referência o id
             * @param {translateToObjectReference} obj 
             */
            // function translateToObjectReference(array) {
            //     var obj = {};
            //     for (var i = 0; i < array.length; i++) {
            //         var element = array[i];
            //         obj[element.text] = element;
            //     }
            //     return obj;
            // }

            // function createJsTreeTable(data) {

            //     // console.log("DATA", data);


            //     // se a árvore já existe, ela é removida
            //     if ($('#tree')) {
            //         $('#tree').remove();
            //     }

            //     // remove tree table também
            //     if ($('.jstree-table-wrapper')) {
            //         $('.jstree-table-wrapper').remove();
            //     }

            //     $('#append-jstreetable').append('<div id="tree"></div>')

            //     // tree for bands
            //     $("#tree").jstree({
            //         "checkbox": {
            //             "keep_selected_style": false,
            //             'cascade': "",
            //         },
            //         //"plugins": ["checkbox"],
            //         // "plugins": ["checkbox", "table", "dnd", "contextmenu", ],
            //         "plugins": ["table", "dnd", "contextmenu", ],
            //         "core": {
            //             'data': data,
            //             "themes": {
            //                 "icons": false
            //             },
            //         },
            //         // configure tree table
            //         "table": {
            //             columns: [{
            //                     width: 200,
            //                     header: "Bands"
            //                 },
            //                 {
            //                     width: 100,
            //                     value: "dry",
            //                     header: "Dry",
            //                     format: function (v) {                                                                     
            //                         if (v) {
            //                             return '<input type="checkbox" name="' + v.name + '" class="' + v.class + '" data-value="' + v.value + '" data-id="' + v.id + '" ' + v.checked + ' ' + v.disabled + '>'
            //                         }
            //                     }
            //                 },
            //                 {
            //                     width: 100,
            //                     value: "wet",
            //                     header: "Wet",
            //                     format: function (v) {                                                                     
            //                         if (v) {
            //                             return '<input type="checkbox" name="' + v.name + '" class="' + v.class + '" data-value="' + v.value + '" data-id="' + v.id + '" ' + v.checked + ' ' + v.disabled + '>'
            //                         }
            //                     }
            //                 },
            //                 {
            //                     width: 100,
            //                     value: "none",
            //                     header: "None",
            //                     format: function (v) {                                                                     
            //                         if (v) {
            //                             return '<input type="checkbox" name="' + v.name + '" class="' + v.class + '" data-value="' + v.value + '" data-id="' + v.id + '" ' + v.checked + ' ' + v.disabled + '>'
            //                         }
            //                     }
            //                 }
            //             ],
            //             resizable: false,
            //             draggable: false,
            //             contextmenu: true,
            //             width: 303,
            //             height: 300
            //         }
            //     });

            //     BandCustomService.checkSeason();
            // }

            /**
             * https: //stackoverflow.com/questions/14514461/how-do-i-bind-to-list-of-checkbox-values-with-angularjs
             * @param {classe} classe classe mapbiomas
             */
            function toggleClasseSelection(classe) {

                console.log("CLASSE", classe);


                var idx = vm.selectedClasses.indexOf(classe);

                // Is currently selected
                if (idx > -1) {
                    vm.selectedClasses.splice(idx, 1);
                }

                // Is newly selected
                else {
                    vm.selectedClasses.push(classe);
                }

                console.log("vm.selectedClasses", vm.selectedClasses);


            }

            /**
             * 
             * @param {randomForestProject} randomForestProject variavel para criacao de projeto random forest
             * @param {control} control controle de criação, edição e deleção
             */
            function createProject(randomForestProject, control) {

                var randomForestData = randomForestProject;

                if (!control) {
                    randomForestData['parameters'] = {
                        bands: BandCustomService.getBands(),
                        classes: vm.selectedClasses,
                        collection: vm.collection
                    };
                }

                randomForestData.parameters = JSON.stringify(randomForestData.parameters);

                // return;

                console.log("STORE", randomForestData);

                ClassificationProjectService.save(randomForestData, function (result) {
                    console.log("RESULTADO", result);

                    Notify.success("Project successfuly created!");
                    vm.randomForestProjects.push(result);

                    vm.projectChoosed = result;

                    // captura as tarefas criadas
                    vm.chooseProject(vm.projectChoosed);

                    // apaga as informações de projeto
                    vm.randomForestProject = {};
                    delete vm.collection;
                    vm.classes = angular.copy(allClasses);
                    BandCustomService.createJsTreeTable(treeBands);
                });

            }

            function chooseProject(project) {
                console.log("PROJETO", project);

                // reiniciando paginação
                $scope.pageSize = 20;
                $scope.page = 1;
                $scope.totalPages = 0;
                // obtenção das regras de filtro já armazenadas
                $scope.paginate($scope.page, $scope.pageSize);
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

                ClassificationService.paginate({
                    page: page,
                    limit: limit,
                    options: {
                        conditions: paginateConditions,
                        // order: "TemporalFilter.created DESC",
                    }
                }, function (result) {

                    console.log("DATA", result);

                    vm.randomForestTasks = result.data;
                    $scope.page = result.page;
                    $scope.totalPages = result.totalPages;

                    // $scope.exportacaoTarefasTotal = result.total;

                    if (result.data.length == 0) {
                        Notify.info('No records found');
                    }
                }, function (err) {
                    Notify.error('Error in getting rules. Try again later.');
                });
            }

            // construtor de condições de pesquisa
            var factoryListConditions = function (formFilterConditions) {
                var conditions = {};

                var data_inicial, data_final;
                console.log("vm.chooseProject", vm.projectChoosed);


                conditions['project_id'] = vm.projectChoosed.ClassificationProject.id;

                if (data_inicial > data_final) {
                    Notify.error('Starting date is greater than the end date', $('#formFilter-data_inicial'));
                    return false;
                }

                return conditions;
            };

            function createTasks(project) {
                console.log("project", project);
                var selections = $("#chart-multiple").select2('data');
                var randomForestCharts = [];

                // caso aplique ou não para todas as cartas
                if (!vm.applyForAllCharts) {
                    cartas = selections;
                } else {
                    cartas = vm.cartaBioma;
                }

                console.log("cartas", cartas);

                // loop por carta
                for (var i = 0; i < cartas.length; i++) {
                    var element = cartas[i];

                    // caso o elemento tenha vindo da seleção
                    if (!element.Carta) {
                        element.codigo = element.text;
                        element.Carta = element;
                    }

                    // console.log("J", rangeYear[j]);
                    randomForestCharts.push({
                        carta: element.Carta.codigo,
                        carta_id: element.Carta.id,
                        project_id: project.ClassificationProject.id,
                        biome_id: project.ClassificationProject.biome_id,
                        active: true
                    });
                }

                ClassificationService.saveLot(randomForestCharts, function (result) {
                    console.log("RESULT", result);

                    // for (var i = 0; i < result.length; i++) {
                    //     var element = result[i];
                    //     result[i].ClassificationProject.parameters = JSON.parse(element.ClassificationProject.parameters);
                    //     vm.randomForestTasks.push(result[i]);
                    // }

                    chooseProject();

                    Notify.success("Tasks successfuly created!");

                    // apagar campos de input
                    $("#chart-multiple").select2("val", "");
                })

                console.log("randomForestCharts", randomForestCharts);

            }

            function changeStatusTask(task) {
                console.log("Task", task);
                // return;
                task.Classification.active = !task.Classification.active;

                ClassificationService.save(task, function (result) {
                    console.log("RESULTADO", result);
                });
            }

            /**
             * Deletar projeto de random forest
             * @param {project} project project of the random forest
             */
            function deleteProject(project) {
                console.log("Projeto", project);

                var r = confirm("Are you sure?");

                if (r) {
                    console.log("DELETED");
                    ClassificationProjectService.delete({
                        id: project.ClassificationProject.id
                    }, function (result) {
                        console.log("RESULTADO", result);
                        // remove elemento da lista de projetos
                        var index = _.findIndex(vm.randomForestProjects, project);
                        
                        // remove dados de projeto
                        delete vm.projectChoosed;

                        vm.randomForestProjects.splice(index, 1);
                    });
                }
            }

            /**
             * clone de projeto
             * @param {project} project projeto a ser clonado
             */
            function cloneProject(project) {
                console.log("PROJETO", project);

                var clonedProject = angular.copy(project.ClassificationProject);
                delete clonedProject.id;
                clonedProject.project_name = clonedProject.project_name + ' cloned';
                createProject(clonedProject, true);
            }

            /**
             * edição de projeto
             * @param {project} project projeto para ser editado
             */
            function editProject(project) {
                console.log("Projeto", project);

                // project variable
                vm.randomForestProject = angular.copy(project.ClassificationProject);

                // collection
                vm.collection = vm.randomForestProject.parameters.collection;

                // classes
                var foundClasses = _.map(vm.randomForestProject.parameters.classes, function (element) {
                    return _.find(vm.classes, function (cl) {
                        return element.Classe.id == cl.Classe.id
                    })
                });

                vm.selectedClasses = foundClasses;

                // feature space
                var features = vm.randomForestProject.parameters.bands;

                var featuresDictionary = BandCustomService.translateToObjectReference(features);

                var mapBands = BandCustomService.generateTree(allBands, featuresDictionary);

                console.log("mapBands", mapBands);
                // return;

                BandCustomService.createJsTreeTable(mapBands);
            }

            /**
             * Cancelamento de edição de projeto
             */
            function cancelEditProject() {
                vm.randomForestProject = {};
                delete vm.collection;
                vm.classes = angular.copy(allClasses);
                BandCustomService.createJsTreeTable(treeBands);
            }

            function resetFeatureSpace() {
                console.log("RESET");
                BandCustomService.createJsTreeTable(treeBands);
            }

            /**
             * função de deleção de tarefas
             * @param {task} task tarefa para ser deletada
             */
            function deleteTask(task) {
                console.log("TASK", task);

                var r = confirm("Are you sure?");

                if (r) {
                    console.log("DELETED");
                    ClassificationService.delete({
                        id: task.id
                    }, function (result) {
                        console.log("RESULTADO", result);
                        // obtenção das tarefas já armazenadas
                        $scope.paginate($scope.page, $scope.pageSize);
                    });
                }
            }

            init();
        }
    ]);