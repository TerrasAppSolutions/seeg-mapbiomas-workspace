/** 
 * @namespace MapBiomas.samples.SamplesIndexController
 * @description Controller de listagem amostras
 */
(function () {
    'use strict';

    angular
        .module('MapBiomas.samples')
        .controller('SamplesIndexController', SamplesIndexController);

    SamplesIndexController.$inject = ['$rootScope', '$injector', '$timeout'];

    function SamplesIndexController($rootScope, $injector, $timeout) {

        var vm = this;

        /*
         * Injects
         */
        var AmostraDataService = $injector.get('AmostraDataService');
        var Mload = $injector.get('Mload');
        var Notify = $injector.get('Notify');
        var $uibModal = $injector.get('$uibModal');

        /**
         * Objeto de configuração de paginação
         * usado na directiva de links de paginação paginação
         * @type {Object}
         */
        vm.paginate = {
            limit: 5,
            total: null,
            page: null,
            paginate: amostrasPaginate
        };

        /**
         * Parametro de pesquisa de amostras 
         * @type {String}
         */
        vm.amostraSearchParam;

        /**
         * Função de pesquisa de amostra fisica
         * @type {Function}
         */
        vm.amostraSearchChange = amostraSearchChange;


        /**
         * Timeout para evitar muitas requisições a cada mudança de amostraSearchParam
         * @type {Angular.service.$timeout}
         */
        var amostraSearchTimeout;


        /**
         * Visualiza amostra no mapa
         * @type {Function}
         */
        vm.viewSample = viewSample;

        /**
         * Edita amostra no mapa
         * @type {Function}
         */
        vm.editSample = editSample;

        /**
         * Anos
         * @type {array}
         */
        vm.years = [];

        /*
         * Events components
         */

        $rootScope.$on('sampleMap:saveSample', function (e, sample) {
            saveSample(sample);
        });


        /*
         * Controller init
         */

        init();

        /**
         * Inicia controller de listagem de amostras         
         */
        function init() {

            amostrasPaginate(1, vm.paginate.limit);

            // valores iniciais dos anos
            for (var i = 2016; i >= 1985; i--) {
                vm.years.push(i.toString());
            }
        }

        /**
         * Paginação de amostra 
         * @param  {int} page  pagina a ser visualizada
         * @param  {int} limit limite de registros por pagina         
         */
        function amostrasPaginate(page, limit) {

            var amostraQueryParams = {
                order: 'Amostra.created DESC',
                conditions: {}
            };

            AmostraDataService.paginate({
                page: page,
                limit: limit,
                options: amostraQueryParams
            }, function (result) {

                vm.amostras = result.data;
                vm.paginate.page = result.page;
                vm.paginate.total = result.totalPages;

                if (result.data.length == 0) {
                    //AppNotify.warning('Não foram encontrados registros para sua pesquisa');
                }

            }, function (err) {
                //AppNotify.error('Não foi possível encontrar dados de amostras físicas');
            });
        };

        /**
         * Visualiza amostra no mapa
         */
        function viewSample(sample) {
            $rootScope.$emit('sampleMap:viewSample', sample);
        }

        /**
         * Edita amostra no mapa
         */
        function editSample(sample) {
            $rootScope.$emit('sampleMap:editSample', sample);
        }

        /**
         * Salva amotra
         * @param  {Object} sample objeto de dados da amostra
         */
        function saveSample(sample) {
            setTimeout(function(){
                sampleFormModal(sample);
            },2000);            
            /* AmostraDataService.save(sample, function (resp) {
                Notify.info($filter('translate')('EXPORTTASKSALVO'));
                amostrasPaginate(vm.paginate.page, vm.paginate.limit);
            }); */
        }

        /**
         * Função de pesquisa de amostra              
         */
        function amostraSearchChange() {
            if (amostraSearchTimeout) {
                $timeout.cancel(amostraSearchTimeout);
                amostraSearchTimeout = null;
            }
            amostraSearchTimeout = $timeout(function () {
                amostrasPaginate(1, vm.paginate.limit);
            }, 500);
        }

        /**
         * Show sample form modal
         */
        function sampleFormModal(sample) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'js/app/modules/samples/samples-form-modal.html',
                //controller: 'ClassificacoesListarModalController',
                size: 'md',
                resolve: {
                    //params: function () {
                    //    return {
                    //        processarResultado: scopeCtrl.processarResultado,
                    //        cartaSelecionda: cartaSelecionda
                    //    };
                    //}
                }
            });
        }

    };

})();