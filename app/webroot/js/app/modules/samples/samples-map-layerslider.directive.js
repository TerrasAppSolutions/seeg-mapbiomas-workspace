
/**
 * @namespace app.map.MapLayerRangeSlider
 * @description Controle de slider de camada visualizada no mapa
 * 
 * <map-layer-range-slider map="vm.map"></map-layer-range-slider>
 * $rootScope.$emit("mapLayerRangeSlider:addGroupLayer", vm.dataLayer.layer);
 */
(function () {
    'use strict';

    angular
        .module('app.map')
        .directive('mapLayerRangeSlider', MapLayerRangeSlider);

    MapLayerRangeSlider.$inject = [];

    function MapLayerRangeSlider() {

        var directive = {
            restrict: 'EA',
            scope: {
                map: '='
            },
            template: MapLayerRangeSliderTemplate,
            controller: MapLayerRangeSliderController,
            link: MapLayerRangeSliderLink,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function MapLayerRangeSliderController($rootScope, $scope) {

            var vm = this;

            /**
             * Retorna as opções de Slider
             * @type {function}
             */
            vm.getSliderOptions = getSliderOptions;

            /**
             * Valor inicial do slider
             * @type {int}
             */
            vm.sliderOpts = getSliderOptions();

            /**
             * Valor inicial do slider
             * @type {int}
             */
            vm.sliderValue;

            /**
             * Transição em andamento
             * @type {int}
             * 0 = stoped; 1 = loading; 2 = playing;
             */
            vm.playingStatus = 0;

            /**
             * Inicia transição
             * @type {function}
             */
            vm.startTransition = startTransition;

            /**
             * Para transição
             * @type {function}
             */
            vm.stopTransition = stopTransition;

            /**
             * Camada L.GroupLayer para transição
             * @type {L.GroupLayer}
             */
            vm.groupLayer;

            /**
             * Range de camadas
             * @type {array}
             */
            var rangeLayers;

            // index da camada e valor atual
            var aIndexRange = 0;

            // range 
            var rangeValues = [];

            // Interval 
            var playingTransition;

            // Contador de carreganmento
            var loadingCount = 0;

            /**
             * Indica Camada L.GroupLayer para transição
             * @return {L.GroupLayer} grupo de camada para transição
             */
            function setGroupLayer(groupLayer) {

                // Inicia configuração com rande do angular-slider
                vm.sliderOpts = getSliderOptions(2003, 2015);
                rangeValues = _.range(2003, 2016);

                // Inicia com playing status "stoped"
                vm.playingStatus = 0;

                // Inicia valores atuais de indice 0
                aIndexRange = 0;
                vm.sliderValue = rangeValues[aIndexRange];

                // Camada GroupLayer de transições
                vm.groupLayer = groupLayer;

                // força atualização de valores de scope
                setTimeout(function () {
                    $scope.$apply();
                }, 200);

                // Inicia componetes de transição
                initTranstion();
            }

            /**
             * Adiciona Camada L.GroupLayer para transição
             * @return {L.GroupLayer} grupo de camada para transição
             */
            function removeGroupLayer() {
                vm.groupLayer = null;
                stopTransition();
            }

            /**
             * Retorna as opções de configuração do slider
             * @return {object} opções de slider
             */
            function getSliderOptions(r0, r1) {
                var opts = {
                    floor: r0 ? r0 : 2000,
                    ceil: r1 ? r1 : 2015,
                    showTicksValues: true,
                    onChange: function (id, value) {
                        setLayerByRangeValue(value);
                    }
                };
                return opts;
            }

            /**
             * Inicia componentes de transição
             */
            function initTranstion() {

                // range de camadas 
                rangeLayers = vm.groupLayer.getLayers();

                // remove todas camadas para nao carregar 
                // todas imediatamente
                vm.groupLayer.clearLayers();

                // adiciona eventos de carregamento
                addLayerEvents();

                // adiciona somente a primeira camada
                rangeLayers[0].setOpacity(1);
                vm.groupLayer.addLayer(rangeLayers[0]);
            }


            /**
             * Inicia transição
             */
            function startTransition() {

                // Valor atual
                vm.sliderValue = rangeValues[aIndexRange];

                loadingCount = 0;

                // Status de Carregando camadas
                vm.playingStatus = 1;

                // Adiciona camadas e eventos de carregamento
                rangeLayers.forEach(function (layer, index) {

                    vm.groupLayer.removeLayer(layer);

                    // atualiza opacidade para camadas não visualizadas
                    if (index != aIndexRange) {
                        layer.setOpacity(0);
                    }
                    // adiciona camadas para inicia carregamento                    
                    vm.groupLayer.addLayer(layer);
                });
            };

            /**
             * Para transição
             */
            function stopTransition() {
                vm.playingStatus = 0;
                clearInterval(playingTransition);
                playingTransition = null;
            }

            /**
             * Adiciona eventos de carregamento
             */
            function addLayerEvents() {
                // Adiciona camadas e eventos de carregamento
                rangeLayers.forEach(function (layer, index) {
                    // atualiza evento de loadind
                    layer.off('loading');
                    layer.on('loading', function (e) {
                        loadingCount++;
                    });
                    // atualiza evento de load completo
                    layer.off('load');
                    layer.on('load', function (e) {
                        loadingCount--;
                        //console.log('loadingCount', loadingCount, rangeLayers.length);
                        if (loadingCount <= 0 && vm.playingStatus == 1) {
                            factoryPlayingTransition();
                            $scope.$apply();
                        }
                    });
                });
            }

            /**
             * Seleciona camada para visualizar pelo valor do range
             */
            function setLayerByRangeValue(value) {

                aIndexRange = rangeValues.indexOf(value);

                // esconde todas as camadas
                rangeLayers.forEach(function (layer, index) {
                    // exibir ate a camada atual
                    if (index <= aIndexRange) {
                        layer.setOpacity(1);
                    } else {
                        layer.setOpacity(0);
                    }
                    // adiciona e visualiza camada de interesse
                    if (!vm.groupLayer.hasLayer(layer)) {
                        vm.groupLayer.addLayer(layer);
                    }
                });


            }

            /**
             * Fabrica intervalos do transição (playing)
             */
            function factoryPlayingTransition() {

                vm.playingStatus = 2;

                if (playingTransition) {
                    stopTransition();
                }

                playingTransition = setInterval(function () {

                    vm.sliderValue = rangeValues[aIndexRange];

                    $scope.$apply();

                    rangeLayers[aIndexRange].setOpacity(1);

                    rangeLayers.forEach(function (layer, index) {
                        // exibir ate a camada atual
                        if (index <= aIndexRange) {
                            layer.setOpacity(1);
                        } else {
                            layer.setOpacity(0);
                        }
                    });

                    if (rangeLayers[(aIndexRange - 1)]) {
                        //rangeLayers[(aIndexRange - 1)].setOpacity(0);
                    }

                    aIndexRange++;

                    if (!rangeLayers[aIndexRange]) {
                        //stopTransition();
                        aIndexRange = 0;
                        $scope.$apply();
                    }

                }, 500);
            }

            /*
             * Emit Events components
             */
            $rootScope.$on('mapLayerRangeSlider:addGroupLayer', function (e, groupLayer) {
                setGroupLayer(groupLayer);
            });

            $rootScope.$on('mapLayerRangeSlider:removeGroupLayer', function (e, groupLayer) {
                removeGroupLayer()
            });

        }

        function MapLayerRangeSliderLink($scope, element, attrs) {}
    }

    var MapLayerRangeSliderTemplate =
        '<div class="map-layer-range-slider" ng-if="vm.groupLayer"> ' +
        '<button ng-click="vm.startTransition()" ng-show="vm.playingStatus == 0" class="bt-time">' +
        '<i class="fa fa-play" aria-hidden="true"></i>' +
        '</button> ' +
        '<button ng-click="vm.stopTransition()" ng-show="vm.playingStatus == 1" class="bt-time">' +
        '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' +
        '</button> ' +
        '<button ng-click="vm.stopTransition()" ng-show="vm.playingStatus == 2" class="bt-time">' +
        '<i class="fa fa-pause" aria-hidden="true"></i>' +
        '</button> ' +
        '<rzslider rz-slider-model="vm.sliderValue" ' +
        'rz-slider-options="vm.sliderOpts">' +
        '</rzslider> ' +
        '</div>';

    //MapLayerRangeSliderTemplate = "";
})();