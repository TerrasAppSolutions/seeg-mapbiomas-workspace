/**
 * Mosaic Contructor for Random Forest
 * Work with mosaic.html
 */

'use strict';
angular.module('MapBiomas.controllers')
    .controller('MosaicController', ['$injector', '$scope',
        function ($injector, $scope) {
            var vm = this;

            // dependências 
            var Notify = $injector.get('Notify');
            var $uibModal = $injector.get('$uibModal');
            var MosaicCartaProjectService = $injector.get('MosaicCartaProjectService');
            var MosaicCartaService = $injector.get('MosaicCartaService');
            var CartaBiomaService = $injector.get('CartaBiomaService');
            var BandCustomService = $injector.get('BandCustomService');
            var FeatureSpaceService = $injector.get('FeatureSpaceService');

            /**
             * Scope variables
             */
            $scope.pageSize = 20;
            $scope.page = 1;
            $scope.totalPages = 0;

            // todos os mosaicos armazenados
            vm.mosaicsData = [];
            vm.cartas = cartas.features;

            // dados de mosaico
            vm.mosaico = {};
            vm.collection = 0;
            vm.filters = {};
            vm.mosaicProjects = [];
            vm.mosaicProject = {};
            vm.mosaicProjectChoosed = {};
            vm.mosaicTasks = [];
            vm.period = {
                primary: {
                    initialYear: '',
                    finalYear: '',
                    initialMonth: '',
                    finalMonth: '',
                    initialDay: '',
                    finalDay: ''
                },
                secondary: {
                    initialYear: '',
                    finalYear: '',
                    initialMonth: '',
                    finalMonth: '',
                    initialDay: '',
                    finalDay: ''
                }
            };
            vm.cartaBioma = [];
            vm.applyForAllCharts = false;

            // functions
            // vm.saveMosaic = saveMosaic;
            // vm.editMosaic = editMosaic;
            vm.createProject = createProject;
            vm.createTasks = createTasks;
            vm.chooseMosaicProject = chooseMosaicProject;
            vm.changeStatusTask = changeStatusTask;
            vm.deleteProject = deleteProject;
            vm.cloneProject = cloneProject;
            vm.editProject = editProject;
            vm.cancelEditProject = cancelEditProject;
            vm.deleteTask = deleteTask;

            // global variables
            // var season = {};
            var treeBands = [];
            var $picker = $('#datepicker1, #datepicker2, #datepicker3, #datepicker4');
            var allBands = [];

            // defining years
            vm.years = _.range(1985, 2018);
            vm.days = _.range(1, 32).toString().split(',');
            vm.months = [{
                    "monthName": "January",
                    "order": 1
                },
                {
                    "monthName": "February",
                    "order": 2
                },
                {
                    "monthName": "March",
                    "order": 3
                },
                {
                    "monthName": "April",
                    "order": 4
                },
                {
                    "monthName": "May",
                    "order": 5
                },
                {
                    "monthName": "June",
                    "order": 6
                },
                {
                    "monthName": "July",
                    "order": 7
                },
                {
                    "monthName": "August",
                    "order": 8
                },
                {
                    "monthName": "September",
                    "order": 9
                },
                {
                    "monthName": "October",
                    "order": 10
                },
                {
                    "monthName": "November",
                    "order": 11
                },
                {
                    "monthName": "December",
                    "order": 12
                }
            ];            

            // charts to process          
            $scope.cartas = cartas.features;

            function init() {

                // Initialization

                $picker.datepicker({
                    startDate: new Date('01/01/1985'),
                    minDate: new Date('01/01/1985'),
                    maxDate: new Date('12/31/2017'),
                    onSelect: function (fd, d, picker) {

                        var month = d.getMonth() + 1;
                        var year = d.getFullYear();
                        var period = $(picker['el']).attr("data-period").split('-');

                        vm.period[period[1]][period[0] + 'Month'] = String(month);
                        vm.period[period[1]][period[0] + 'Year'] = String(year);
                    }
                });
                // Access instance of plugin
                $picker.data('datepicker');

                // get stored mosaics
                MosaicCartaProjectService.query({
                    options: {
                        conditions: {},
                        order: "created ASC",
                        // group: "Mosaic.chart"
                    }
                }, function (result) {
                    for (var i = 0; i < result.length; i++) {
                        var element = result[i];
                        result[i].MosaicCartaProject.parameters = JSON.parse(element.MosaicCartaProject.parameters);
                        vm.mosaicProjects.push(result[i]);
                    }

                });

                CartaBiomaService.query(function (cartaBioma) {
                    // console.log("cartaBioma", cartaBioma);
                    vm.cartaBioma = cartaBioma;
                    var data = [];
                    for (var i = 0; i < cartaBioma.length; i++) {
                        var carta = cartaBioma[i];

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

                FeatureSpaceService.query(function (result) {
                    // global variables
                    allBands = angular.copy(result);

                    treeBands = BandCustomService.generateTree(result);

                    BandCustomService.createJsTreeTable(treeBands);
                });


            }

            /**
             * 
             * @param {mosaicProject} mosaicProject atributos da criação de projeto
             * @param {control} control variável de controle: criação, edição e clone
             */
            function createProject(mosaicProject, control) {

                if (!mosaicProject.parameters) {
                    mosaicProject.parameters = {};
                }

                // prevent: clone
                if(!control) {
                    // add bands to parameters
                    mosaicProject.parameters.bands = BandCustomService.getBands();

                    // add period
                    mosaicProject.parameters.period = vm.period;
                    mosaicProject.parameters.collection = vm.collection;
                }

                mosaicProject.parameters = JSON.stringify(mosaicProject.parameters);

                MosaicCartaProjectService.save(mosaicProject, function (result) {
                    // console.log("RESULT", result);
                    Notify.success("Project successfuly created!");

                    result.MosaicCartaProject.parameters = JSON.parse(result.MosaicCartaProject.parameters);

                    vm.mosaicProjects.push(result);

                    // já seleciona o projeto
                    vm.mosaicChoosed = result.MosaicCartaProject;

                    // captura as tarefas criadas
                    vm.chooseMosaicProject(vm.mosaicChoosed);

                    // apaga as informações de projeto
                    vm.mosaicProject = {};
                    vm.period = {
                        primary: {
                            initialYear: '',
                            finalYear: '',
                            initialMonth: '',
                            finalMonth: '',
                            initialDay: '',
                            finalDay: ''
                        },
                        secondary: {
                            initialYear: '',
                            finalYear: '',
                            initialMonth: '',
                            finalMonth: '',
                            initialDay: '',
                            finalDay: ''
                        }
                    };
                    BandCustomService.resetSeason();
                    $('.period-date-id').val("");
                    vm.collection = 0;
                    BandCustomService.createJsTreeTable(treeBands);
                });
            }

            /**
             * função de criação de tarefas
             * @param {project} project project to create tasks
             */
            function createTasks(project) {
                // seleção de cartas
                var selections = $("#chart-multiple").select2('data');

                var mosaicCharts = [];
                var parameters = project.parameters;
                // var parameters = JSON.parse(project.parameters);
                var rangeYear = _.range(Number(parameters.period.primary.initialYear), Number(parameters.period.primary.finalYear) + 1);

                var cartas = [];

                // caso aplique ou não para todas as cartas
                if (!vm.applyForAllCharts) {
                    cartas = selections;
                } else {
                    cartas = vm.cartaBioma;
                }

                // loop por carta
                for (var i = 0; i < cartas.length; i++) {
                    var element = cartas[i];

                    // caso o elemento tenha vindo da seleção
                    if (!element.Carta) {
                        element.codigo = element.text;
                        element.Carta = element;
                    }

                    // loop por ano
                    for (var j in rangeYear) {
                        // console.log("J", rangeYear[j]);
                        mosaicCharts.push({
                            carta: element.Carta.codigo,
                            carta_id: element.Carta.id,
                            project_id: project.id,
                            year: rangeYear[j],
                            biome_id: project.biome_id,
                            sensor: project.sensor,
                            active: true
                        });
                    }
                }

                MosaicCartaService.saveLot(mosaicCharts, function (result) {

                    // for (var i = 0; i < result.length; i++) {
                    //     var element = result[i];
                    //     result[i].MosaicCartaProject.parameters = JSON.parse(element.MosaicCartaProject.parameters);
                    //     vm.mosaicTasks.push(result[i]);
                    // }

                    chooseMosaicProject();


                    Notify.success("Tasks successfuly created!");

                    // apagar campos de input
                    $("#chart-multiple").select2("val", "");
                })
            }

            /**
             * função a ser trabalhada na paginação
             * @param {project} project project to paginate
             */
            function chooseMosaicProject(project) {
                // reiniciando paginação
                $scope.pageSize = 20;
                $scope.page = 1;
                $scope.totalPages = 0;
                // obtenção das tarefas já armazenadas
                $scope.paginate($scope.page, $scope.pageSize);
            }

            /**
             * tarefa para alteração de status
             * @param {task} task task to change
             */
            function changeStatusTask(task) {
                task.MosaicCarta.active = !task.MosaicCarta.active;

                MosaicCartaService.save(task, function (result) {
                    console.log("RESULTADO", result);
                });
            }

            /**
             * construtor de condições de pesquisa
             * @param {formFilterConditions} formFilterConditions conditions to filter
             */
            var factoryListConditions = function (formFilterConditions) {
                var conditions = {};

                var data_inicial, data_final;

                conditions['project_id'] = vm.mosaicChoosed.id;

                if (data_inicial > data_final) {
                    Notify.error('Starting date is greater than the end date', $('#formFilter-data_inicial'));
                    return false;
                }

                return conditions;
            };

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

                MosaicCartaService.paginate({
                    page: page,
                    limit: limit,
                    options: {
                        conditions: paginateConditions,
                        // order: "TemporalFilter.created DESC",
                    }
                }, function (result) {
                    vm.mosaicTasks = result.data;
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

            /**
             * Deletar projeto de mosaico
             * @param {project} project project of the mosaic
             */
            function deleteProject(project) {
                console.log("Projeto", project);

                var r = confirm("Are you sure?");

                if (r) {
                    console.log("DELETED");
                    MosaicCartaProjectService.delete({
                        id: project.id
                    }, function (result) {
                        console.log("RESULTADO", result);

                        // remove elemento da lista de projetos
                        var index = _.findIndex(vm.mosaicProjects, project);
                        
                        // remove dados de projeto
                        delete vm.mosaicChoosed;

                        vm.mosaicProjects.splice(index, 1);
                    });
                }
            }

            /**
             * clone de projeto
             * @param {project} project projeto a ser clonado
             */
            function cloneProject(project) {
                var clonedProject = angular.copy(project);
                delete clonedProject.id;
                clonedProject.project_name = clonedProject.project_name + ' cloned';
                createProject(clonedProject, true);
            }

            function editProject(project) {
                
                vm.mosaicProject = angular.copy(project);

                // collection
                vm.collection = angular.copy(project.parameters.collection);

                // period
                $('#datepicker1').data('datepicker').selectDate(new Date(project.parameters.period.primary.initialMonth + '/01/' + project.parameters.period.primary.initialYear));
                $('#datepicker2').data('datepicker').selectDate(new Date(project.parameters.period.primary.finalMonth + '/01/' + project.parameters.period.primary.finalYear));
                $('#datepicker3').data('datepicker').selectDate(new Date(project.parameters.period.secondary.initialMonth + '/01/' + project.parameters.period.secondary.initialYear));
                $('#datepicker4').data('datepicker').selectDate(new Date(project.parameters.period.secondary.finalMonth + '/01/' + project.parameters.period.secondary.finalYear));

                vm.period = project.parameters.period;

                var features = project.parameters.bands;
                var featuresDictionary = BandCustomService.translateToObjectReference(features);
                var mapBands = BandCustomService.generateTree(allBands, featuresDictionary);

                BandCustomService.createJsTreeTable(mapBands);
            }

            /**
             * Cancelamento de edição de projeto
             */
            function cancelEditProject() {
                // apaga as informações de projeto
                vm.mosaicProject = {};
                vm.period = {
                    primary: {
                        initialYear: '',
                        finalYear: '',
                        initialMonth: '',
                        finalMonth: '',
                        initialDay: '',
                        finalDay: ''
                    },
                    secondary: {
                        initialYear: '',
                        finalYear: '',
                        initialMonth: '',
                        finalMonth: '',
                        initialDay: '',
                        finalDay: ''
                    }
                };
                BandCustomService.resetSeason();
                $('.period-date-id').val("");
                vm.collection = 0;
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
                    MosaicCartaService.delete({
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