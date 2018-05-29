'use strict';
angular.module('MapBiomasApp', [
    'MapBiomas'
])
    .config(['$routeProvider', '$stateProvider', '$urlRouterProvider', 'pikadayConfigProvider', '$translateProvider',
        function ($routeProvider, $stateProvider, $urlRouterProvider, pikaday, $translateProvider) {

            $stateProvider
                .state("workspace", {
                    url: "/",
                    views: {
                        '': {
                            templateUrl: "js/app/views/workspace/workspace.html",
                        },
                        'workspace-right@workspace': {
                            templateUrl: 'js/app/views/workspace/workspace-right.html',
                        }
                    }
                })
                .state("filters", {
                    url: "/filters",
                    views: {
                        '': {
                            templateUrl: 'js/app/views/filtros/filters.html',
                        }
                    }
                })
                .state("filters.temporal", {
                    url: "/temporal",
                    views: {
                        '': {
                            templateUrl: 'js/app/views/filtros/temporal-filter.html',
                            controller: 'TemporalFilterController as vm'
                        }
                    },
                })
                .state("filters.integration", {
                    url: "/integration",
                    views: {
                        '': {
                            templateUrl: 'js/app/views/filtros/integration-filter.html',
                            // controller: 'IntegrationFilterController as vm'
                        }
                    },
                })
                .state("manager", {
                    url: "/manager",
                    views: {
                        '': {
                            templateUrl: 'js/app/views/manager/manager.html',
                        }
                    }
                })
                .state("manager.task", {
                    url: "/task",
                    views: {
                        '': {
                            templateUrl: 'js/app/views/manager/task-manager.html',
                        }
                    }
                })
                .state("classificacoes-parametros", {
                    url: "/classifications/parameters",
                    views: {
                        '': {
                            templateUrl: 'js/app/views/classificacoes/list.html',
                        }
                    }
                })
                .state("classificacoes-parametros.edit", {
                    url: "^/classifications/parameters/edit/:classificacaoId",
                    views: {
                        'classificationForm@classificacoes-parametros': {
                            templateUrl: 'js/app/views/classificacoes/save_modal.html'
                        }
                    }
                })
                .state("classificacoes-parametros.edit-forcereload", {
                    url: "^/classifications/parameters/edit/:classificacaoId/:forcereload",
                    views: {
                        'classificationForm@classificacoes-parametros': {
                            templateUrl: 'js/app/views/classificacoes/save_modal.html'
                        }
                    }
                })
                .state("classificacoes-parametros-viewmode", {
                    url: "/classifications/parameters/:viewmode",
                    views: {
                        '': {
                            templateUrl: 'js/app/views/classificacoes/list.html',
                        }
                    }
                })
                .state("integracao-tarefas", {
                    url: "/consolidation/tasks",
                    views: {
                        '': {
                            templateUrl: 'js/app/views/classificacoes/tarefas_list.html',
                        }
                    }
                })
                .state("classificacao-tarefas", {
                    url: "/classifications/tasks", // remover, substituido por ""/consolidation/tasks""                                     
                    views: {
                        '': {
                            templateUrl: 'js/app/views/classificacoes/tarefas_list.html',
                        }
                    }
                })
                .state("dtree", {
                    url: "/dtree", // remover, substituido por ""/consolidation/tasks""                                     
                    views: {
                        '': {
                            templateUrl: 'js/app/views/dtree/dtreemap.html',
                        }
                    }
                });

            $urlRouterProvider.otherwise('/');

            pikaday.setConfig({
                format: "DD/MM/YYYY"
                //format: "YYYY-MM-DD"
            });

            angular.forEach(langs, function (lang, key) {
                $translateProvider.translations(key, lang);
            });

            $translateProvider.preferredLanguage('en');
        }
    ])
    .run(['$rootScope', '$injector',
        function ($rootScope, $injector) {
            var AppAuth = $injector.get('AppAuth');
            var AppConfig = $injector.get('AppConfig');

            // refatorar, criar servico gee de autenticação
            var CLIENT_ID = AppConfig['GOOGLECREDENTIALS']['client_id'];
            ee.data.authenticate(CLIENT_ID, function () {
                // auth success
            }, function () {
                // auth error
            }, null, function () {
                ee.data.authenticateViaPopup();
            });
        }
    ]);