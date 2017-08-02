angular.module('MapBiomas.workmap.draw', []);

angular.module('MapBiomas.workmap.draw')
    .factory('WorkmapDraw', ['$compile', '$rootScope', '$filter', '$injector',
        function($compile, $rootScope, $filter, $injector) {

            /**
             * Controle de desenho do WorkMap
             */
            var WorkmapDraw = function() {

                var WorkmapAPI = $injector.get('WorkmapAPI');
                var WorkmapAreaClasses = $injector.get('WorkmapAreaClasses');
                var ClasseAreaService = $injector.get('ClasseAreaService');
                var Mload = $injector.get('Mload');

                var workmap;

                var workmapScope;

                var featureGroupDraw = new L.FeatureGroup();

                var drawControl = new L.Control.Draw({
                    draw: {
                        polyline: false,
                        polygon: false,
                        // polygon: {
                        //     allowIntersection: false,
                        //     showArea: true
                        // },
                        circle: false,
                        rectangle: false,
                        //rectangle: {
                        //    showArea: true
                        //},
                        //marker: false
                        marker: {
                            repeatMode: false
                        }
                    },
                    edit: {
                        featureGroup: featureGroupDraw,
                        edit: false
                    }
                });

                var layersCtrl = L.control.layers({}, {
                    "Samples": L.layerGroup([featureGroupDraw]),
                }, {
                    position: "topleft",
                    collapsed: false
                });

                var layersListCtrl = new(L.Control.extend({
                    options: {
                        position: 'topleft'
                    },
                    compiled: false,
                    onAdd: function(map) {

                        var container = L.DomUtil.create('div', 'leaflet-bar');

                        $container = $(container);

                        $container.html('<a class="leaflet-draw-draw-marker" href="javascript:;" title="List samples"><i class="glyphicon glyphicon-list-alt"></i></a>');

                        $container.click(function() {
                            workmapScope.dialogClasseAreasListar();
                        });

                        return $container[0];
                    }
                }))();

                var drawControlVisible = false;

                var popupOpened;

                // evento durante o desenho
                var drawWhileInterval;

                // limite maximo da area(ha) de um poligono desenhado
                var polygonAreaLimit = 1842895;

                /**
                 * Inicia controle de desenho
                 * @param  {Leaflel.Map} workmap instancia do mapa
                 * @param  {Angular.scope} $scope scope da directiva que inicia o mapa
                 */
                this.init = function(wmap, $scope) {

                    workmapScope = $scope;

                    // set workmap
                    workmap = wmap;

                    // clear layers
                    featureGroupDraw.clearLayers();

                    // set events
                    initWorkMapEvents();
                };

                this.closePopup = function() {
                    workmap.closePopup(popupOpened);
                };

                this.show = function() {
                    showDrawControl();
                };

                this.hide = function() {
                    hideDrawControl();
                };

                /**
                 * seta Leaflet.Map onde sera usado o controle
                 * de desenho e seu eventos
                 * @param {Leaflet.Map} wmap objeto workmap
                 */
                var initWorkMapEvents = function(wmap) {

                    workmap.on('draw:drawstart', function(e) {
                        workmap.addLayer(featureGroupDraw);
                        drawWhileInterval = setInterval(function() {
                            drawWhileEvent(e);
                        }, 1000);
                    });

                    workmap.on('draw:drawstop', function(e) {
                        workmap.addLayer(featureGroupDraw);
                        clearInterval(drawWhileInterval);
                    });

                    workmap.on('draw:created', function(e) {
                        var layer = e.layer;
                        addLayerfeatureGroupDraw(layer);
                    });

                    workmap.on('draw:edited', function(e) {
                        var layers = e.layers;
                        layers.eachLayer(function(layer) {
                            layer = drawLayerValidation(layer);
                            if (layer) {
                                saveClasseAreaLayer(layer);
                            }
                        });
                    });

                    workmap.on('draw:deleted', function(e) {
                        var layers = e.layers;
                        layers.eachLayer(function(layer) {
                            deletarClasseAreaLayer(layer);
                        });
                    });

                    workmap.on('overlayadd', function(e) {
                        listClasseAreas();
                    });

                    /**
                     * dragAndDrop Event
                     */

                    $("#workmap").on("drop", function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        workmap.addLayer(featureGroupDraw);

                        var files = e.originalEvent.dataTransfer.files;

                        var fileReader = new FileReader();

                        fileReader.onloadend = function(evt) {
                            var result = evt.target.result;

                            var dropFileLayer = new L.Shapefile(result, {
                                isArrayBufer: true
                            });

                            dropFileLayer.once("data:loaded", function() {

                                var dropFileGeoJSON = dropFileLayer.toGeoJSON();

                                if (dropFileGeoJSON.type == "FeatureCollection") {
                                    dropFileGeoJSON = dropFileGeoJSON.features[0];
                                }
                                if (dropFileGeoJSON.geometry.type == "MultiPolygon") {
                                    Mload.alert('Feature type error', 'The shapefile must contain only polygon type. Please try again.', "modal-warning");
                                    setTimeout(function() {
                                        Mload.hide();
                                    }, 5000);
                                    return;
                                }

                                var dropFileLayerGeoJSON = L.geoJson(dropFileGeoJSON);

                                angular.forEach(dropFileLayerGeoJSON.getLayers(), function(layer, key) {
                                    addLayerfeatureGroupDraw(layer);
                                });
                            });
                        };

                        fileReader.readAsArrayBuffer(files[0]);
                    });

                    // dragdrop stop propagation
                    $("html").on("dragover", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    $("html").on("dragleave", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    $("html").on("drop", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });

                };

                /**
                 * Exibe o controle de desenho
                 */
                var showDrawControl = function() {
                    if (!drawControlVisible) {
                        workmap.addControl(drawControl);
                        workmap.addControl(layersCtrl);
                        workmap.addControl(layersListCtrl);
                        drawControlVisible = true;
                    }
                };

                /**
                 * Esconde o controle de desenho
                 */
                var hideDrawControl = function() {
                    if (drawControlVisible) {
                        workmap.removeControl(drawControl);
                        workmap.removeControl(layersCtrl);
                        workmap.removeControl(layersListCtrl);
                        workmap.removeLayer(featureGroupDraw);
                        drawControlVisible = false;
                    }
                };

                /**
                 * função evento de click para as camadas
                 * criadas
                 */

                var $popupcontent = $('<div popup-classe-area-draw="popupClasseAreaDraw" style=width:280px></div>');
                var $popupCompiled;

                var showPopupClasses = function(layer) {

                    var popup = L.popup({
                            closeOnClick: false,
                            closeButton: false,
                            keepInView: true
                        })
                        .setLatLng(layer._latlngs ? layer._latlngs[1] : layer._latlng)
                        .setContent($popupcontent[0]);

                    workmapScope.popupClasseAreaDraw = {
                        layer: layer,
                        popup: popup,
                        saveClasseAreaLayer: saveClasseAreaLayer,
                        cancelClasseAreaLayer: cancelClasseAreaLayer
                    };

                    workmap.on('popupopen', function(e) {
                        if (!$popupCompiled) {
                            $popupCompiled = $compile($popupcontent[0])(workmapScope);
                        }
                        workmapScope.$apply();
                    });

                    workmap.on('popupclose', function(e) {
                        return false;
                    });

                    popup.openOn(workmap);

                    popupOpened = popup;
                };


                /**
                 * adiciona camada na camada de desenho
                 * @param  {Leaflet.Layer} layer camada desenha
                 */
                var addLayerfeatureGroupDraw = function(layer) {
                    layer = drawLayerValidation(layer);
                    if (layer) {
                        layer.classeArea = {};
                        featureGroupDraw.addLayer(layer);
                        showPopupClasses(layer);
                    }
                };

                /**
                 * salva camada desenhada
                 * @param  {Leaflet.Layer} layer camada desenha
                 */
                var saveClasseAreaLayer = function(layer) {
                    ClasseAreaService.save(classeAreaFromLayer(layer), function(data) {
                        layer.classeArea = data.ClasseArea;
                        if (popupOpened) {
                            workmap.closePopup(popupOpened);
                            popupOpened = null;
                        }
                    });
                };

                /**
                 * cancela a camada desenhada
                 * @param  {Leaflet.Layer} layer camada desenha
                 */
                var cancelClasseAreaLayer = function(layer) {
                    featureGroupDraw.removeLayer(layer);
                    workmap.closePopup(popupOpened);
                };

                /**
                 * deleta camada desenhada
                 * @param  {Leaflet.Layer} layer camada desenha
                 */
                var deletarClasseAreaLayer = function(layer) {
                    if (!layer.classeArea) {
                        return;
                    }
                    ClasseAreaService.delete({
                        id: layer.classeArea.id
                    }, function(data) {
                        featureGroupDraw.removeLayer(layer);
                    });
                };

                /**
                 * gera um objeto modelo de ClasseArea para ser salvo
                 * @param  {Leaflet.Layer} layer camada desenha
                 */
                var classeAreaFromLayer = function(layer) {
                    var classeArea = {
                        ClasseArea: layer.classeArea
                    };
                    classeArea.ClasseArea.geoJSON = layer.toGeoJSON().geometry;
                    return classeArea;
                };

                /**
                 * consulta o serviço de lista camadas desenhadas e exibe
                 * no mapa
                 */
                var listClasseAreas = function() {

                    var style = {
                        "color": "#fff",
                        "weight": 2,
                        "fillOpacity": 0.9,
                        "fillColor": "#ff6666"
                    };

                    featureGroupDraw.clearLayers();

                    ClasseAreaService.query({}, function(data) {

                        angular.forEach(data, function(classeArea, key) {

                            var geoJsonLayers = L.geoJson(classeArea.ClasseArea.geoJSON);

                            angular.forEach(geoJsonLayers.getLayers(), function(layer, key) {

                                style["fillColor"] = _.findWhere(WorkmapAreaClasses, {
                                    id: classeArea.ClasseArea.classe_id
                                }).color;

                                if (layer.setStyle) {
                                    layer.setStyle(style);
                                } else {
                                    layer.setIcon(new L.icon({
                                        iconUrl: 'img/icons/markers/marker_class_'+classeArea.ClasseArea.classe_id+'.png',                                        
                                        //shadowUrl: 'bower_components/leaflet-dist/images/marker-shadow.png',                                        
                                    }));
                                }

                                layer.classeArea = classeArea.ClasseArea;

                                featureGroupDraw.addLayer(layer);
                            });
                        });
                    });
                };

                /**
                 * aplica regras de validação para as camadas desenhadas
                 * @param  {Leaflet.Layer} drawnLayer camada desenha
                 * @return {Leaflet.Layer} camada transformada pós validação.
                 */
                var drawLayerValidation = function(drawnLayer) {

                    var validLayer;

                    var cartaLayerSelected = WorkmapAPI.getCartaLayerSelected();

                    var classificacaoParams = WorkmapAPI.getClassificationParams();

                    // verifica se ja foi processado e salvo um parametro de classificação
                    if (!classificacaoParams || !classificacaoParams.Classificacao.id) {
                        Mload.alert('Save and process a classification parameter ', 'Save and process a classification parameter before you draw a feature.', "modal-warning");
                        setTimeout(function() {
                            Mload.hide();
                        }, 10000);
                        return;
                    }

                    // verifica se o poligono é um ponto
                    if (drawnLayer._latlng && drawnLayer._latlng.lat) {
                        //var pointGeoJSONBuffer = turf.buffer(drawnLayer.toGeoJSON(), 0.03, "kilometers");
                        //var pointGeoJSON = turf.envelope(pointGeoJSONBuffer);
                        //drawnLayer = L.geoJson(pointGeoJSONBuffer).getLayers()[0];
                    }

                    // verifica se uma carta foi selecionada 
                    if (cartaLayerSelected) {
                        var instersectDrawnGeoJSON = turf.intersect(cartaLayerSelected.toGeoJSON(), drawnLayer.toGeoJSON());
                        var instersectDrawnLayer = L.geoJson(instersectDrawnGeoJSON);
                        validLayer = instersectDrawnLayer.getLayers()[0];
                    }

                    if (validLayer) {
                        // verifica a area limite em ha
                        var polygonArea = turf.area(validLayer.toGeoJSON()) / 10000;
                        if (polygonArea > polygonAreaLimit) {
                            Mload.alert('Area limit exceeded', 'Polygon area limit exceeded (~' + polygonAreaLimit + ' ha). Please try again.', "modal-warning");
                            setTimeout(function() {
                                Mload.hide();
                            }, 5000);

                            validLayer = null;
                        }
                    }

                    return validLayer;
                };


                var drawWhileEvent = function(e) {
                    var $tooltip = $(".leaflet-draw-tooltip-subtext");
                    var haText = $tooltip.html();
                    if (haText) {
                        var haVal = parseInt(haText.replace(" ha", ""));
                        if (haVal > polygonAreaLimit && !$tooltip.hasClass('text-red')) {
                            $tooltip.addClass('text-red');
                        } else if (haVal <= polygonAreaLimit && $tooltip.hasClass('text-red')) {
                            $tooltip.removeClass('text-red');
                        }
                    }
                };
            };

            return new WorkmapDraw();
        }
    ])
    .factory('WorkmapAreaClasses', ['$filter',
        function($filter) {

            var WorkmapAreaClasses = [{
                id: 1,
                classe: $filter('translate')('FLORESTA'),
                color: "#006630",
                parent: 0,
            }, {
                id: 2,
                classe: $filter('translate')('NAOFLORESTA'),
                color: "#000000",
                parent: 1
            }, {
                id: 3,
                classe: $filter('translate')('AGUA'),
                color: "#0000FF",
                parent: 2
            }, {
                id: 4,
                classe: $filter('translate')('FLORESTACONSERVADATERRAFIRME'),
                color: "#15A352",
                parent: 3
            }, {
                id: 5,
                classe: $filter('translate')('FLORESTACONSERVADAVARZEA'),
                color: "#94CC92",
                parent: 2
            }, {
                id: 6,
                classe: $filter('translate')('FLORESTACONSERVADAVARZEA'),
                color: "#94CC92",
                parent: 5
            }, {
                id: 7,
                classe: $filter('translate')('FLORESTACOMSINAISDEDISTURBIO'),
                color: "#D4E3FA",
                parent: 1
            }, {
                id: 8,
                classe: $filter('translate')('FLORESTASOBPLANODEMANEJOFLORESTAL'),
                color: "#707000",
                parent: 7
            }, {
                id: 9,
                classe: $filter('translate')('FLORESTASOBPLANODEMANEJOFLORESTAL'),
                color: "#707000",
                parent: 8
            }, {
                id: 10,
                classe: $filter('translate')('FLORESTADEGRADADAOUEMDEGRADACAO'),
                color: "#FF6766",
                parent: 7
            }, {
                id: 11,
                classe: $filter('translate')('FLORESTADEGRADADAOUEMDEGRADACAO'),
                color: "#FF6766",
                parent: 10
            }, {
                id: 12,
                classe: $filter('translate')('FLORESTAEMREGENERACAO'),
                color: "#FE8FAB",
                parent: 7
            }, {
                id: 13,
                classe: $filter('translate')('REFLORESTAMENTO'),
                color: "#FBB2CC",
                parent: 1
            }, {
                id: 14,
                classe: $filter('translate')('REFLORESTAMENTO'),
                color: "#A15989",
                parent: 13
            }, {
                id: 15,
                classe: $filter('translate')('REFLORESTAMENTO'),
                color: "#A15989",
                parent: 14
            }, {
                id: 16,
                classe: $filter('translate')('NAOFLORESTACOMVEGETACAO'),
                color: "#A57000",
                parent: 0
            }, {
                id: 17,
                classe: $filter('translate')('CAMPO'),
                color: "#E9FFBF",
                parent: 16
            }, {
                id: 18,
                classe: $filter('translate')('CAMPONATIVO'),
                color: "#eaf7d2",
                parent: 17
            }, {
                id: 19,
                classe: $filter('translate')('CAMPONATIVODEGRADADO'),
                color: "#FF6766",
                parent: 18
            }, {
                id: 20,
                classe: $filter('translate')('CAMPONATIVOSECUNDARIO'),
                color: "#BFBF77",
                parent: 18
            }, {
                id: 21,
                classe: $filter('translate')('PASTAGEMPLANTADA'),
                color: "#FFFF00",
                parent: 17
            }, {
                id: 22,
                classe: $filter('translate')('PASTAGEMPLANTADA'),
                color: "#FBB2CC",
                parent: 21
            }, {
                id: 23,
                classe: $filter('translate')('PASTAGEMPLANTADABEMMANEJADA'),
                color: "#E5E504",
                parent: 21
            }, {
                id: 24,
                classe: $filter('translate')('AREAAGRICOLA'),
                color: "#0DA84F",
                parent: 16
            }, {
                id: 25,
                classe: $filter('translate')('CULTURASPERENES'),
                color: "#3C8A5D",
                parent: 24
            }, {
                id: 26,
                classe: $filter('translate')('CULTURASPERENES'),
                color: "#3C8A5D",
                parent: 25
            }, {
                id: 27,
                classe: $filter('translate')('CULTURASTEMPORARIAS'),
                color: "#837B6B",
                parent: 24
            }, {
                id: 28,
                classe: $filter('translate')('CANA'),
                color: "#B07CFE",
                parent: 27
            }, {
                id: 29,
                classe: $filter('translate')('SOJA'),
                color: "#267000",
                parent: 27
            }, {
                id: 30,
                classe: $filter('translate')('ALGODAO'),
                color: "#FE2624",
                parent: 27
            }, {
                id: 31,
                classe: $filter('translate')('MILHO'),
                color: "#FFD401",
                parent: 27
            }, {
                id: 32,
                classe: $filter('translate')('ARROZDESEQUEIRO'),
                color: "#01A7E1",
                parent: 27
            }, {
                id: 33,
                classe: $filter('translate')('ARROZHIRRIGADO'),
                color: "#12B6ED",
                parent: 27
            }, {
                id: 34,
                classe: $filter('translate')('OUTRAS'),
                color: "#08090C",
                parent: 27
            }, {
                id: 35,
                classe: $filter('translate')('AREASUMIDASNATURAIS'),
                color: "#7CB0B1",
                parent: 16
            }, {
                id: 36,
                classe: $filter('translate')('AREASUMIDASNATURAIS'),
                color: "#7CB0B1",
                parent: 35
            }, {
                id: 37,
                classe: $filter('translate')('AREASUMIDASNATURAIS'),
                color: "#7CB0B1",
                parent: 36
            }, {
                id: 38,
                classe: $filter('translate')('CORPOSDAGUA'),
                color: "#3112E2",
                parent: 0
            }, {
                id: 39,
                classe: $filter('translate')('RIOSLAGOSERESERVATORIOS'),
                color: "#366196",
                parent: 38
            }, {
                id: 40,
                classe: $filter('translate')('RIOSLAGOSELAGUNAS'),
                color: "#1E0D89",
                parent: 39
            }, {
                id: 41,
                classe: $filter('translate')('RIOSLAGOSELAGUNAS'),
                color: "#1E0D89",
                parent: 40
            }, {
                id: 42,
                classe: $filter('translate')('RESERVATORIOS'),
                color: "#6955ED",
                parent: 39
            }, {
                id: 43,
                classe: $filter('translate')('RESERVATORIOS'),
                color: "#6955ED",
                parent: 42
            }, {
                id: 44,
                classe: $filter('translate')('NAOFLORESTASEMVEGETACAO'),
                color: "#C9D7A3",
                parent: 0
            }, {
                id: 45,
                classe: $filter('translate')('OUTROS'),
                color: "#060606",
                parent: 44
            }, {
                id: 46,
                classe: $filter('translate')('AREASNAOVEGETADASANTROPICAS'),
                color: "#FBB2CC",
                parent: 45
            }, {
                id: 47,
                classe: $filter('translate')('ASSENTAMENTOHUMANO'),
                color: "#FBB2CC",
                parent: 46
            }, {
                id: 48,
                classe: $filter('translate')('AREASNAOVEGETADASANTROPICAS'),
                color: "#999999",
                parent: 46
            }, {
                id: 49,
                classe: $filter('translate')('AREASNAOVEGETADASNATURAIS'),
                color: "#FBB2CC",
                parent: 45
            }, {
                id: 50,
                classe: $filter('translate')('AREASNAOVEGETADASNATURAIS'),
                color: "#CBC2AC",
                parent: 49
            }, {
                id: 51,
                classe: $filter('translate')('NAOOBSERVADO'),
                color: "#DEA60B",
                parent: 0
            }, {
                id: 52,
                classe: $filter('translate')('NAOOBSERVADO'),
                color: "#DEA60B",
                parent: 51
            }, {
                id: 53,
                classe: $filter('translate')('AREANAOOBSERVADA'),
                color: "#FFCC66",
                parent: 52
            }, {
                id: 54,
                classe: $filter('translate')('AREANAOOBSERVADA'),
                color: "#FFCC66",
                parent: 53
            }, {
                id: 55,
                classe: $filter('translate')('FLORESTACONSERVADA'),
                color: "#00B04A",
                parent: 1
            },{
                id: 56,
                classe: $filter('translate')('FLORESTACONSERVADATERRAFIRME'),
                color: "#15A352",
                parent: 2
            }];

            return WorkmapAreaClasses;
        }
    ])
    .factory('AreaClasseType', [
        function() {
            var types = [{
                id: 1,
                type: "Training"
            }, {
                id: 2,
                type: "Test"
            }, {
                id: 3,
                type: "Validation"
            }];
            return types;
        }
    ]);