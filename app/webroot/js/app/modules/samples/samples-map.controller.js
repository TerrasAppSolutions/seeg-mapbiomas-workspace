/** 
 * @namespace MapBiomas.samples.SamplesMapController
 * @description Controller de listagem usuarios
 */
(function () {
    'use strict';

    angular
        .module('MapBiomas.samples')
        .controller('SamplesMapController', SamplesMapController);

    SamplesMapController.$inject = ['$rootScope', '$injector'];

    function SamplesMapController($rootScope, $injector) {

        var vm = this;

        /*
         * Injects
         */

        var SamplesMapLayers = $injector.get('SamplesMapLayers');

        var SamplesMapDrawCtrl = $injector.get('SamplesMapDrawCtrl');

        var Notify = $injector.get('Notify');


        /** 
         * Atributos privados
         */


        /**
         * Controles de desenho do mapa
         * @private
         * @type {MapBiomas.samples.SamplesMapLayers}
         */
        var layers;

        /**
         * Controles de desenho do mapa
         * @private
         * @type {MapBiomas.samples.SamplesMapDrawCtrl}
         */
        var drawControl;

        /**
         * API pública do controller para a view
         */

        /**
         * Objeto de configuração de paginação
         * usado na directiva de links de paginação paginação
         * @type {Object}
         */
        vm.paginate = {
            limit: 10,
            total: null,
            page: null,
            //paginate: usuariosPaginate
        };

        /**
         * Mapa do compomente
         * @type {L.Map}
         */
        vm.map = null;

        /**
         * Objeto de dados de amostra
         *          
         * @type {Object}
         */
        vm.sampleData = {
            Amostra: {}
        };


        /**
         * Controller init        
         * 
         * @type {Function}
         */
        vm.init = init;

        /*
         * Events components
         */

        $rootScope.$on('sampleMap:viewSample', function (e, sample) {
            viewSample(sample);
        });

        $rootScope.$on('sampleMap:editSample', function (e, sample) {
            editSample(sample);
        });


        /**
         * Inicia controller de listagem de usuario          
         */
        function init(map) {

            vm.map = map;

            layers = new SamplesMapLayers(map);
            layers.init();

            drawControl = new SamplesMapDrawCtrl(map);
            drawControl.init();

            initEvents();
        }


        /**
         * Inicia eventos do componente
         */
        function initEvents() {
            drawControl.onDrawn(function (polygon, points) {
                vm.sampleData.Amostra.polygon = polygon.toGeoJSON();
                vm.sampleData.Amostra.points = points.toGeoJSON();
                saveSample(vm.sampleData);
            });
        }

        /**
         * Visualizar amotra         
         * @param  {Object} sample objeto de dados da amostra
         */
        function viewSample(sample) {
            drawControl.hide();
            console.log('sampleMap:viewSample', sample);
        }

        /**
         * Editar amotra
         * @param  {Object} sample objeto de dados da amostra
         */
        function editSample(sample) {
            drawControl.show();
            console.log('sampleMap:editSample', sample);
        }

        /**
         * Salva amotra
         * @param  {Object} sample objeto de dados da amostra
         */
        function saveSample(sample) {
            $rootScope.$emit('sampleMap:saveSample', sample);
        }

    };
})();