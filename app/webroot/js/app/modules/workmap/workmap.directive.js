/*
 * Modulo Workmap
 */
angular.module('MapBiomas.workmap', []);

angular.module('MapBiomas.workmap')
    .directive('workmap', ['$compile', 'WorkmapAPI', 'WorkspaceLayers', 'MapCartasAPI', 'WorkmapDraw',
        function($compile, WorkmapAPI, WorkspaceLayers, MapCartasAPI, WorkmapDraw) {
            return {
                restrict: 'A',
                scope: {
                    imagensProcessadas: "=imagensProcessadas",
                    classificacao: "=classificacao",
                    cartaEventClick: "=cartaEventClick",
                    saveClasseArea: "=saveClasseArea",
                    dialogClasseAreasListar: "=dialogClasseAreasListar"
                },
                link: function($scope, element, attrs) {

                    element.attr('id', 'workmap');

                    /*
                     * Inicia Componentes
                     */

                    // inicia mapa                    
                    var $wgisWorkmap = $(element).wgis({
                        osm: false,
                        google: false,
                        switchLayer: true,
                        height: '100%',
                        lmap: {
                            center: [-14.264383087562635, -59.0625],
                            zoom: 5,
                            minZoom: 5,
                            maxZoom: 15,
                            touchZoom: true,
                            scrollWheelZoom: true,
                            doubleClickZoom: true,
                            boxZoom: true,
                            zoomControl: true
                        }
                    });

                    // adiciona camadas padroes no mapa
                    WorkspaceLayers.imgsref($wgisWorkmap);

                    // instancia do mapa 
                    var workmap = $wgisWorkmap._wgis.lmap;

                    // injeta instancia do mapa no controle do componente
                    WorkmapAPI.setMap(workmap);

                    // adiciona camada google
                    var googleTerrain = new L.Google('SATELLITE');
                    workmap.addLayer(googleTerrain);

                    // camada de cartas                     
                    var cartasLayers = L.geoJson(cartas, {
                        style: {
                            "color": "#78b569",
                            "weight": 0.5,
                            "opacity": 0.1,
                            "fillOpacity": 0,
                        }
                    });

                    workmap.addLayer(cartasLayers);

                    workmap.fitBounds(cartasLayers.getBounds());

                    // injeta camada de cartas
                    WorkmapAPI.setCartasLayer(cartasLayers);

                    var cartasByCodigo = _.indexBy(cartas.features, function(f) {
                        return f.properties.name;
                    });

                    // componente de desenho de poligonos de classe
                    // WorkmapDraw.init(workmap, $scope);
                    // WorkmapDraw.show();

                    /*
                     * Configura Eventos
                     */
                    // evento de dbclick na camada de cartas
                    cartasLayers.on('dblclick', function(e) {
                        var carta = e.layer.feature.properties.name;
                        WorkmapAPI.selectCarta(carta);
                    });

                    // configura açoes do evento de click no botão direito do mouse
                    // na camada de cartas
                    cartasLayers.on('contextmenu', function(e) {

                        var carta = e.layer.feature.properties.name;

                        var popup = L.popup()
                            .setLatLng(e.latlng)
                            .setContent('<div popup-worklayer="popupparams" style=width:220px></div>');

                        $scope.popupparams = {
                            carta: carta,
                            popup: popup
                        };

                        workmap.on('popupopen', function(e) {
                            WorkmapAPI.setPopupOpened(e.popup);
                            var $popupcontent = $(e.popup._contentNode);
                            $compile($popupcontent)($scope);
                            $scope.$apply();
                        });

                        popup.openOn(workmap);
                    });

                    // dispara ações após seleção de uma carta
                    WorkmapAPI.onSelectedCarta = function(carta) {
                        // Workmap
                        WorkmapAPI.closePopups();

                        //Mapcartas
                        MapCartasAPI.selectCarta(carta);

                        // recupera parametros classificação atual para a carta selecionda
                        var classificationParams = WorkmapAPI.getCartaClassification(carta);


                        // Scope
                        $scope.classificacao(classificationParams);

                        $scope.cartaEventClick(carta);

                        $scope.$apply();
                    };

                    // Dispara ações quando novos parametros de classificação são inseridos
                    // no mapa via scope
                    $scope.$watch('imagensProcessadas',
                        function(params) {
                            if (params) {
                                WorkmapAPI.buildWorkLayer(params);
                            }
                        });
                }
            };
        }
    ])
    .directive('popupWorklayer', ['$injector',
        function($injector) {
            var template = '<table class="table table-striped">' +
                '<thead>' +
                '<tr><th class="bg-light-blue text-center" colspan="4">{{params.carta}}</th></tr>' +
                '</thead>' +
                '<tbody ng-show="worklayer">' +
                '<tr><td colspan="2"><strong>{{\'BIOMA\' | translate }}</strong></td><td colspan="2">{{classification.Classificacao.bioma}}</td></tr>' +
                '<tr><td colspan="2"><strong>{{\'ANO\' | translate }}</strong></td><td colspan="2">{{classification.Classificacao.year}}</td></tr>' +
                '<tr><td colspan="2"><strong>{{\'DATAINICIAL\' | translate }}</strong></td><td colspan="2">{{classification.Classificacao.t0}}</td></tr>' +
                '<tr><td colspan="2"><strong>{{\'DATAFINAL\' | translate }}</strong></td><td colspan="2">{{classification.Classificacao.t1}}</td></tr>' +
                '<tr>' +
                '<td><strong>GVS (v1)</strong></td><td>{{classification.Classificacao.dtv.dtv1}}</td>' +
                '<td><strong>GVS (v2)</strong></td><td>{{classification.Classificacao.dtv.dtv2}}</td>' +
                '</tr>' +
                '<tr>' +
                '<td><strong>NDFI (v3)</strong></td><td>{{classification.Classificacao.dtv.dtv3}}</td>' +
                '<td><strong>NDFI (v4)</strong></td><td>{{classification.Classificacao.dtv.dtv4}}</td>' +
                '</tr>' +
                '<tr><td colspan="4" class="text-center">' +
                '<button ng-click="removeFromMapWorklayer()" type="button" class="btn btn-block btn-flat btn-sm btn-warning"><span ng-bind="\'CPARAMREMOVMAP\' | translate"></span</button>' +
                '</td></tr>' +
                '</tbody>' +
                '</table>';
            return {
                restrict: 'A',
                template: template,
                scope: {
                    params: "=popupWorklayer"
                },
                controller: function($scope) {

                    var WorkmapAPI = $injector.get('WorkmapAPI');

                    var worklayers = WorkmapAPI.getWorkLayers();

                    var carta = $scope.params.carta;

                    var popup = $scope.params.popup;

                    var init = function() {
                        if (worklayers[carta]) {
                            $scope.worklayer = worklayers[carta];
                            $scope.classification = worklayers[carta].getClassificationParams();
                        }
                    };

                    $scope.removeFromMapWorklayer = function() {
                        $scope.worklayer.removeFromMap();
                        delete worklayers[carta];
                        $scope.worklayer = null;
                        setTimeout(function() {
                            WorkmapAPI.getMap().closePopup(popup);
                        }, 3000);
                    };

                    init();
                },
                link: function($scope, element, attrs) {},
            };
        }
    ])
    .directive('popupClasseAreaDraw', ['$filter', 'WorkmapAPI', 'DtreeClasses', 'CacheApp',
        function($filter, WorkmapAPI, DtreeClasses, CacheApp) {
            var template = '<table class="table table-striped">' +
                '<thead>' +
                '<tr><th class="bg-light-blue text-center">{{\'CLASSEAREA\' | translate }}</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>' +
                '<form name="formClasseArea">' +
                '<div class="form-group">' +
                '<label>Class</label>' +

                '<select class="form-control" ng-model="classeArea.classe_id" ng-options="classe.id as (classe.cod + classe.classe) for (id,classe) in areaClasses" required></select>' +

                '</div>' +
                '<div class="form-group">' +
                '<label>Year</label>' +
                '<select ng-model="classeArea.year" ng-options="ano for ano in selectAnos" class="form-control" required>' +
                '<option value="">{{\'SELECIONEANO\' | translate}}</option>' +
                '</select>' +
                '</div>' +
                '<div class="form-group">' +
                '<label>{{\'BIOMA\' | translate}}</label>' +
                '<select ng-model="classeArea.bioma_id" ng-options="bioma.id as bioma.nome for bioma in selectBiomas" class="form-control" required>' +
                '<option value="">{{\'BIOMA\' | translate}}</option>' +
                '</select>' +
                '</div>' +
                '<div class="form-group">' +
                '<label>{{\'AREAOBJETIVO\' | translate}}</label>' +
                '<select ng-model="classeArea.type_id" ng-options="type.id as type.type for type in selectPolygonTypes" class="form-control" required>' +
                '<option value="">{{\'SELECIONEAREAOBJETIVO\' | translate}}</option>' +
                '</select>' +
                '</div>' +
                '<div class="form-group">' +
                '<button ng-click="saveClasseAreaLayer()" ng-disabled="!formClasseArea.$valid" class="btn btn-xs btn-success" style="width:48%" type="button">Save</button>' +
                '&nbsp&nbsp' +
                '<button ng-click="cancelClasseAreaLayer()" class="btn btn-xs btn-warning" style="width:48%"type="button">Cancel</button>' +
                '</div>' +
                '</form>' +
                '</td></tr>' +
                '</tbody>' +
                '</table>';
            return {
                restrict: 'A',
                template: template,
                scope: {
                    params: "=popupClasseAreaDraw"
                },
                /**
                 * controler do popup de areas de classes desenhadas.
                 * Esta directive é compilada pelo factory WorkmapDraw usando o scope
                 * da directive workmap.
                 * @param  {Angular.scope} $scope com objeto params definido em WorkmapDraw
                 */
                controller: function($scope) {

                    var layer;

                    var popup;

                    var style = {
                        "color": "#fff",
                        "weight": 2,
                        "fillOpacity": 0.9,
                        "fillColor": "#ff6666"
                    };

                    var init = function(params) {

                        layer = params.layer;

                        popup = params.popup;

                        $scope.areaClasses = {};

                        $scope.selectAnos = [];

                        // valores iniciais dos anos
                        for (var i = 1985; i < 2016; i++) {
                            $scope.selectAnos.push(i.toString());
                        }

                        // classes
                        $scope.areaClasses = DtreeClasses.getClasses();


                        $scope.selectBiomas = [{
                            id: 1,
                            nome: $filter('translate')('AMAZONIA')
                        }, {
                            id: 2,
                            nome: $filter('translate')('MATAATLANTICA')
                        }, {
                            id: 3,
                            nome: $filter('translate')('PANTANAL')
                        }, {
                            id: 4,
                            nome: $filter('translate')('CERRADO')
                        }, {
                            id: 5,
                            nome: $filter('translate')('CAATINGA')
                        }, {
                            id: 6,
                            nome: $filter('translate')('PAMPA')
                        }, {
                            id: 7,
                            nome: $filter('translate')('ZONACOSTEIRA')
                        }];

                        $scope.selectPolygonTypes = [{
                            id: 1,
                            type: "Training"
                        }, {
                            id: 2,
                            type: "Test"
                        }, {
                            id: 3,
                            type: "Validation"
                        }];

                        if (CacheApp.get("popupClasseAreaDraw.form")) {
                            $scope.classeArea = CacheApp.get("popupClasseAreaDraw.form");
                            $scope.areaClasses = CacheApp.get("popupClasseAreaDraw.areaClasses");
                            setStyle($scope.classeArea.classe_id);
                        }

                    };

                    $scope.saveClasseAreaLayer = function() {

                        var classificationParams = WorkmapAPI.getClassificationParams();

                        if (!classificationParams.Classificacao) {
                            return;
                        }

                        layer.classeArea.year = $scope.classeArea.year;
                        layer.classeArea.classe_id = $scope.classeArea.classe_id;
                        layer.classeArea.bioma_id = $scope.classeArea.bioma_id;
                        layer.classeArea.type_id = $scope.classeArea.type_id;
                        layer.classeArea.classificacao_id = classificationParams.Classificacao.id;
                        layer.classeArea.carta = classificationParams.Classificacao.carta;

                        $scope.params.saveClasseAreaLayer(layer);

                        CacheApp.put("popupClasseAreaDraw.form", $scope.classeArea);
                        CacheApp.put("popupClasseAreaDraw.areaClasses", $scope.areaClasses);
                    };

                    $scope.cancelClasseAreaLayer = function() {
                        $scope.params.cancelClasseAreaLayer(layer);
                    };

                    var setStyle = function(classeId) {
                        style["fillColor"] = _.findWhere(WorkmapAreaClasses, {
                            id: classeId
                        }).color;
                        layer.classeArea.classe_id = classeId;

                        if (layer.setStyle) {
                            layer.setStyle(style);
                        } else {
                            layer.setIcon(new L.icon({
                                iconUrl: 'img/icons/markers/marker_class_' + classeId + '.png',
                                //shadowUrl: 'bower_components/leaflet-dist/images/marker-shadow.png',                                        
                            }));
                        }

                    };

                    $scope.$watch('params', function(params) {
                        if (params) {
                            init(params);
                        }
                    });

                },
                link: function($scope, element, attrs) {},
            };
        }
    ])
    .directive('mapcartas', ['MapCartasAPI', 'WorkmapAPI', 'MapCartaAPI', 'AppConfig',
        function(MapCartasAPI, WorkmapAPI, MapCartaAPI, AppConfig) {
            return {
                restrict: 'A',
                scope: {
                    options: "=options",
                    imageData: "=imageData",
                    imagensProcessadas: "=imagensProcessadas",
                    cartaEventClick: "=cartaEventClick",
                    classificacao: "=classificacao"
                },
                link: function($scope, element, attrs) {
                    var mapcartas;
                    var cartasLayers;
                    var biomasLayer;

                    $scope.imageData = {};

                    var init = function() {

                        // id do elemento
                        element.attr('id', 'map-cartas');

                        // inicia o mapa
                        mapcartas = L.map('map-cartas', {
                            center: [-14.264383087562635, -59.0625],
                        });

                        // injeta instancia do mapa no controle de mapcartas
                        MapCartasAPI.setMap(mapcartas);

                        // adiciona camada OpenStreetMaps
                        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                        var osmAttrib = 'Map data &copy; OpenStreetMap contributors';
                        var osm = new L.TileLayer(osmUrl, {
                            minZoom: 0,
                            maxZoom: 18,
                            attribution: osmAttrib
                        });

                        mapcartas.addLayer(osm);

                        // adiciona camada wms de biomas
                        var mapfilepath = AppConfig.MAPSERVER.mapfilepath;
                        var mapfilehost = AppConfig.MAPSERVER.mapfilehost;
                        var biomasLayer = L.tileLayer.wms(mapfilehost, {
                            layers: 'bioma',
                            map: mapfilepath + "/territories/bioma.map",
                            format: 'image/png',
                            transparent: true
                        });
                        mapcartas.addLayer(biomasLayer);

                        // adiciona camada de cartas
                        cartasLayers = L.geoJson(cartas, {
                            style: {
                                "color": "#666666",
                                "weight": 0.5,
                                "opacity": 0.9,
                                "fillOpacity": 0.2,
                                "fillColor": "#ff6666"
                            }
                        });

                        MapCartasAPI.setCartasLayer(cartasLayers);

                        mapcartas.addLayer(cartasLayers);

                        cartasLayers.on('click', function(e) {
                            var carta = e.layer.feature.properties.name;
                            WorkmapAPI.selectCarta(carta);
                        });

                        mapcartas.fitBounds(cartasLayers.getBounds());
                        mapcartas.setZoom(4);

                    };

                    init();
                }
            };
        }
    ])
    .directive('mapcarta', ['MapCartaAPI', 'WorkmapAPI',
        function(MapCartaAPI, WorkmapAPI) {
            return {
                restrict: 'A',
                scope: {
                    mapcartaCtrl: '=ctrl'
                },
                link: function($scope, element, attrs) {

                    element.attr('id', 'map-carta');

                    // inicia o mapa                    
                    var mapcarta = L.map('map-carta', {
                        center: [-14.264383087562635, -59.0625],
                        zoom: 7,
                        dragging: false,
                        touchZoom: false,
                        scrollWheelZoom: false,
                        doubleClickZoom: false,
                        boxZoom: false,
                        zoomControl: false,
                    });

                    // adiciona camada google
                    var googleTerrain = new L.Google('SATELLITE');

                    mapcarta.addLayer(googleTerrain);

                    MapCartaAPI.setMap(mapcarta);

                    setTimeout(function() {
                        var height = element.parent().height().toString() + "px";
                        element.css('height', height);
                        mapcarta.invalidateSize()
                    }, 500);
                }
            };
        }
    ])
    .directive('mapcartaslist', ['$injector', '$compile',
        function($injector, $compile) {
            return {
                restrict: 'A',
                scope: {
                    mapcartaslist: "=mapcartaslist",
                    buscarCarta: "=buscarCarta"
                },
                controller: ['$scope',
                    function($scope) {

                        var AppConfig = $injector.get('AppConfig');

                        var CartaGroupMapTable = $injector.get('CartaGroupMapTable');

                        var $wgismap;

                        var lmap;

                        var cartasLayers;

                        var cartasLayersToClick;

                        var assetService = new MapbiomasAssetService();

                        var geeMosaicLayer;

                        var geeClassifLayer;
                        
                        var geeClassFtLayer;

                        $scope.cartasByCodigo;

                        $scope.cartaSelecionada;

                        $scope.styles = {
                            default: {
                                "color": "#666666",
                                "weight": 0.5,
                                "opacity": 0.9,
                                "fillOpacity": 0.2,
                                "fillColor": "#ff6666"
                            },
                            exist: {
                                "color": "#616ce2",
                                "weight": 0.5,
                                "opacity": 0.9,
                                "fillOpacity": 0.5,
                                "fillColor": '#616ce2'
                            },
                            invisible: {
                                "color": "#000",
                                "weight": 0.5,
                                "opacity": 0.0,
                                "fillOpacity": 0.0,
                                "fillColor": '#000'
                            }
                        };

                        $scope.init = function(element) {

                            $wgismap = $(element).wgis({
                                osm: false,
                                google: false,
                                switchLayer: false,
                                lmap: {
                                    center: [-14.264383087562635, -59.0625],
                                    zoom: 4,
                                    minZoom: 4,
                                    maxZoom: 15,
                                    touchZoom: true,
                                    scrollWheelZoom: true,
                                    doubleClickZoom: true,
                                    boxZoom: true,
                                    zoomControl: true
                                }
                            });

                            lmap = $wgismap._wgis.lmap;

                            var mapfilepath = AppConfig.MAPSERVER.mapfilepath;
                            var mapfilehost = AppConfig.MAPSERVER.mapfilehost;

                            // camada biomas                                
                            var biomasLayer = L.tileLayer.wms(mapfilehost, {
                                layers: 'bioma',
                                map: mapfilepath + "/territories/bioma.map",
                                format: 'image/png',
                                transparent: true
                            });

                            // camada OpenStreetMaps                
                            var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                minZoom: 0,
                                maxZoom: 18,
                                attribution: 'Map data &copy; OpenStreetMap contributors'
                            });

                            // camada de cartas
                            cartasLayers = L.geoJson(cartas, {
                                style: $scope.styles.default
                            });

                            lmap.fitBounds(cartasLayers.getBounds());

                            // camada de cartas
                            cartasLayersToClick = L.geoJson(cartas, {
                                style: $scope.styles.invisible
                            });

                            // Camadas de Assets                           

                            geeMosaicLayer = new L.TileLayer.GeeScript(function(callback) {
                                var assetTileUrl = assetService
                                    .getMosaicByParamsGroup($scope.mapcartaslist);
                                callback(assetTileUrl);
                            });

                            geeClassifLayer = new L.TileLayer.GeeScript(function(callback) {
                                var assetTileUrl = assetService
                                    .getClassifByParamsGroup($scope.mapcartaslist);
                                callback(assetTileUrl);
                            });
                           
                            geeClassFtLayer = new L.TileLayer.GeeScript(function(callback) {
                                var assetTileUrl = assetService
                                    .getClassFtLayerByParamsGroup($scope.mapcartaslist);
                                callback(assetTileUrl);
                            });
                            
                            geeIntegrationLayer = new L.TileLayer.GeeScript(function(callback) {
                                var assetTileUrl = assetService
                                    .getIntegrationLayerByParamsGroup($scope.mapcartaslist);
                                callback(assetTileUrl);
                            });

                            var layersControl = L.control.layers({}, {
                                "Charts": cartasLayers,
                                "Mosaic": geeMosaicLayer,
                                "Classification": geeClassifLayer,
                                "Temporal Filter": geeClassFtLayer,
                                "Integrarion": geeIntegrationLayer,
                            });


                            cartasLayersToClick.on('click', function(e) {

                                var cartaCodigo = e.layer.feature.properties.name;

                                $scope.cartaSelecionada = cartaCodigo;

                                if ($scope.cartasByCodigo[cartaCodigo]) {

                                    var popupContentJson = $scope.cartasByCodigo[cartaCodigo];

                                    var $popupcontent = $(new CartaGroupMapTable(popupContentJson).getHtml());
                                    e.layer.bindPopup($popupcontent[0]);
                                    
                                }else{                                    
                                    var $popupcontent = $(new CartaGroupMapTable({carta_codigo : cartaCodigo}).getHtml());
                                    e.layer.bindPopup($popupcontent[0]);                                    
                                }

                                e.layer.openPopup();
                                $compile($popupcontent[0])($scope);
                                $scope.$apply();
                            });

                            lmap.addLayer(osm);
                            lmap.addLayer(biomasLayer);
                            lmap.addLayer(cartasLayers);
                            lmap.addLayer(cartasLayersToClick);
                            lmap.addControl(layersControl);
                        };

                        var setCartasList = function(cartaslist) {

                            var cartaslist = _.map(cartaslist, function(value) {
                                return value.Classificacao;
                            });

                            $scope.cartasByCodigo = _.indexBy(cartaslist, 'carta_codigo');

                            cartasLayers.setStyle($scope.styles.default);

                            setTimeout(function() {
                                cartasLayers.eachLayer(function(layer) {
                                    var cartaCodigo = layer.feature.properties.name;
                                    if ($scope.cartasByCodigo[cartaCodigo]) {
                                        layer.setStyle($scope.styles.exist);
                                    }
                                });
                            }, 1000);
                        };

                        $scope.$watch('mapcartaslist', function(newValue) {
                            if (newValue) {
                                setCartasList(newValue);
                                if (lmap.hasLayer(geeMosaicLayer)) {
                                    geeMosaicLayer.reprocess();
                                }
                                if (lmap.hasLayer(geeClassifLayer)) {
                                    geeClassifLayer.reprocess();
                                }
                                
                                if (lmap.hasLayer(geeClassFtLayer)) {
                                    geeClassFtLayer.reprocess();
                                }
                                
                                if (lmap.hasLayer(geeIntegrationLayer)) {
                                    geeIntegrationLayer.reprocess();
                                }
                            }
                        });
                    }
                ],
                link: function($scope, element, attrs) {
                    $scope.init(element);
                }
            };
        }
    ])
    .directive('mapcartasexportlist', ['$injector',
        function($injector) {
            return {
                restrict: 'A',
                scope: {
                    mapcartasexportlist: "=mapcartasexportlist"
                },
                controller: ['$scope',
                    function($scope) {

                        $scope.cartasByCodigo;

                        $scope.styles = {
                            default: {
                                "color": "#666666",
                                "weight": 0.5,
                                "opacity": 0.9,
                                "fillOpacity": 0.2,
                                "fillColor": "#ff6666"
                            },
                            exist: {
                                "color": "#0E1CD6",
                                "weight": 0.5,
                                "opacity": 0.9,
                                "fillOpacity": 0.5,
                                "fillColor": '#0E1CD6'
                            }
                        };

                        $scope.$watch('mapcartasexportlist', function(newValue) {
                            if (newValue) {
                                setCartasList(newValue);
                            }
                        });

                        var setCartasList = function(cartaslist) {

                            var cartaslist = _.map(cartaslist, function(value) {
                                return value.ClassificacaoTarefa;
                            });

                            $scope.cartasByCodigo = _.indexBy(cartaslist, 'carta_codigo');

                            $scope.cartasLayers.setStyle($scope.styles.default);

                            $scope.cartasLayers.eachLayer(function(layer) {
                                var cartaCodigo = layer.feature.properties.name;
                                if ($scope.cartasByCodigo[cartaCodigo]) {
                                    layer.setStyle($scope.styles.exist);
                                }
                            });
                        };

                    }
                ],
                link: function($scope, element, attrs) {

                    var AppConfig = $injector.get('AppConfig');

                    var CartaTarefaGroupMapTable = $injector.get('CartaTarefaGroupMapTable');

                    var $wgismap = $(element).wgis({
                        osm: false,
                        google: false,
                        switchLayer: false,
                        lmap: {
                            center: [-14.264383087562635, -59.0625],
                            zoom: 4,
                            minZoom: 4,
                            maxZoom: 15,
                            touchZoom: true,
                            scrollWheelZoom: true,
                            doubleClickZoom: true,
                            boxZoom: true,
                            zoomControl: true
                        }
                    });

                    var lmap = $wgismap._wgis.lmap;

                    var mapfilepath = AppConfig.MAPSERVER.mapfilepath;
                    var mapfilehost = AppConfig.MAPSERVER.mapfilehost;

                    // camada biomas                                
                    var biomasLayer = L.tileLayer.wms(mapfilehost, {
                        layers: 'bioma',
                        map: mapfilepath + "/territories/bioma.map",
                        format: 'image/png',
                        transparent: true
                    });

                    // camada OpenStreetMaps                
                    var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        minZoom: 0,
                        maxZoom: 18,
                        attribution: 'Map data &copy; OpenStreetMap contributors'
                    });

                    // camada de cartas
                    var cartasLayers = L.geoJson(cartas, {
                        style: $scope.styles.default
                    });

                    lmap.fitBounds(cartasLayers.getBounds());

                    cartasLayers.on('click', function(e) {
                        var cartaCodigo = e.layer.feature.properties.name;
                        if ($scope.cartasByCodigo[cartaCodigo]) {
                            var popupContentJson = $scope.cartasByCodigo[cartaCodigo];
                            e.layer.bindPopup(new CartaTarefaGroupMapTable(popupContentJson).getHtml());
                            e.layer.openPopup();
                        }
                    });

                    $scope.cartasLayers = cartasLayers;

                    lmap.addLayer(osm);
                    lmap.addLayer(biomasLayer);
                    lmap.addLayer(cartasLayers);
                }
            };
        }
    ])
    .directive('classificacaoTarefaStatus', ['$injector',
        function($injector) {

            var template =
                '<small ng-show="taskFase[0]" class="label" style="background-color:#C5C56D">' +
                '   <i ng-show="taskFase[0].status == 0" class="fa fa-clock-o"></i>' +
                '   <i ng-show="taskFase[0].status == 1" class="fa fa-gears"></i>' +
                '   <i ng-show="taskFase[0].status == 2  || taskFase[0].status == 5" class="fa fa-check"></i>' +
                '   <i ng-show="taskFase[0].status == 3" class="fa fa-flash"></i>' +
                '   mosaic' +
                '</small>&nbsp' +
                '<small ng-show="taskFase[1]" class="label" style="background-color:#E18837">' +
                '   <i ng-show="taskFase[1].status == 0 || taskFase[1].status == 5" class="fa fa-clock-o"></i>' +
                '   <i ng-show="taskFase[1].status == 1" class="fa fa-gears"></i>' +
                '   <i ng-show="taskFase[1].status == 2 || taskFase[1].status == 5" class="fa fa-check"></i>' +
                '   <i ng-show="taskFase[1].status == 3" class="fa fa-flash"></i>' +
                '   classification' +
                '</small>&nbsp<br/>' +
                '<small ng-show="taskFase[2]" class="label" style="background-color:#9FA0A1">' +
                '   <i ng-show="taskFase[2].status == 0 || taskFase[2].status == 5" class="fa fa-clock-o"></i>' +
                '   <i ng-show="taskFase[2].status == 1" class="fa fa-gears"></i>' +
                '   <i ng-show="taskFase[2].status == 2 || taskFase[2].status == 5" class="fa fa-check"></i>' +
                '   <i ng-show="taskFase[2].status == 3" class="fa fa-flash"></i>' +
                '   t.filter' +
                '</small>&nbsp' +
                '<small ng-show="taskFase[3]" class="label" style="background-color:#77B893">' +
                '   <i ng-show="taskFase[3].status == 0 || taskFase[3].status == 5" class="fa fa-clock-o"></i>' +
                '   <i ng-show="taskFase[3].status == 1" class="fa fa-gears"></i>' +
                '   <i ng-show="taskFase[3].status == 2 || taskFase[3].status == 5" class="fa fa-check"></i>' +
                '   <i ng-show="taskFase[3].status == 3" class="fa fa-flash"></i>' +
                '   integration' +
                '</small>';

            return {
                restrict: 'A',
                template: template,
                scope: {
                    tarefas: "=classificacaoTarefaStatus"
                },
                controller: ['$scope',
                    function($scope) {

                        $scope.taskFase = {};

                        $scope.$watch('tarefas', function(tarefas) {
                            if (!tarefas) {
                                return;
                            }
                            tarefas.forEach(function(tarefa) {
                                $scope.taskFase[tarefa.fase] = tarefa;
                            });
                        });
                    }
                ],
                link: function($scope, element, attrs) {}
            };
        }
    ])
    // refatorar para directive
    .factory('CartaGroupMapTable', [

        function() {
            var CartaGroupMapTable = function(json) {
                var table = '<table class="table table-striped"><tbody>' ;                
                table += json.carta_codigo ? '<tr><th class="bg-gray text-center" colspan="2">{{carta_codigo}}</th></tr>':'';
                table += json.biomas ? '<tr><td><strong>Bioma</strong></td><td>{{biomas}}</td></tr>':'';
                table += json.years ? '<tr><td><strong>Years</strong></td><td>{{years}}</td></tr>':'';
                table += json.count ? '<tr><td><strong>Total</strong></td><td>{{count}}</td></tr>':'';
                table += '<tr><td colspan="2" class="text-center"><a href="javascript:;" ng-click="buscarCarta(cartaSelecionada)">Find chart parameters</a></td></tr>' ;
                table += '</tbody></table>';

                $.each(json, function(key, value) {
                    table = table.replace('{{' + key + '}}', value);
                });

                this.tableHtml = table;
            };

            CartaGroupMapTable.prototype.getHtml = function() {
                return this.tableHtml;
            };

            return CartaGroupMapTable;
        }
    ])
    // refatorar para directive
    .factory('CartaTarefaGroupMapTable', [

        function() {
            var CartaGroupMapTable = function(json) {
                var table = '<table class="table table-striped"><tbody>' +
                    '<tr><th class="bg-gray text-center" colspan="2">{{carta_codigo}}</th></tr>' +
                    '<tr><td><strong>Biomas</strong></td><td>{{biomas}}</td></tr>' +
                    '<tr><td><strong>Years</strong></td><td>{{years}}</td></tr>' +
                    '<tr><td><strong>Total</strong></td><td>{{count}}</td></tr>' +
                    '</tbody></table>';
                $.each(json, function(key, value) {
                    table = table.replace('{{' + key + '}}', value);
                });

                this.tableHtml = table;
            };

            CartaGroupMapTable.prototype.getHtml = function() {
                return this.tableHtml;
            };

            return CartaGroupMapTable;
        }
    ])
    .directive('graficoCartaProcessado', ['$injector',
        function($injector) {
            return {
                restrict: 'A',
                template: '<canvas width="400" height="400"></canvas>',
                scope: {
                    paramsGroup: "=graficoCartaProcessado"
                },
                controller: ['$scope', function($scope) {}],
                link: function($scope, element, attrs) {

                    var ctx = element.find('canvas');

                    var horizontalBarChartData = {
                        labels: ["Amazon", "Atlantic Forest", "Pantanal", "Cerrado", "Caatinga", "Pampa"],
                        datasets: [{
                            label: 'Total',
                            backgroundColor: 'rgb(117, 199, 224)',
                            borderColor: 'rgb(117, 199, 224)',
                            borderWidth: 1,
                            data: [
                                4995, // Amazon
                                2090, // Atlantic Forest
                                567, // Pantanal
                                2941, // Cerrado
                                1236, // Caatinga                   
                                664 // Pampa
                            ]
                        }, {
                            label: 'Mosaic',
                            backgroundColor: 'rgb(197, 197, 109)',
                            borderColor: 'rgb(197, 197, 109)',
                            borderWidth: 1,
                            data: [
                                3995, // Amazon
                                1090, // Atlantic Forest
                                367, // Pantanal
                                2141, // Cerrado
                                136, // Caatinga                   
                                164 // Pampa
                            ]
                        }, {
                            label: 'Classification',
                            backgroundColor: 'rgb(225, 136, 55)',
                            borderColor: 'rgb(225, 136, 55)',
                            borderWidth: 1,
                            data: [
                                2195, // Amazon
                                1010, // Atlantic Forest
                                167, // Pantanal
                                1941, // Cerrado
                                96, // Caatinga                   
                                94 // Pampa
                            ]
                        }, {
                            label: 'Temporal Filter',
                            backgroundColor: 'rgb(159, 160, 161)',
                            borderColor: 'rgb(159, 160, 161)',
                            borderWidth: 1,
                            data: [
                                1195, // Amazon
                                910, // Atlantic Forest
                                100, // Pantanal
                                1341, // Cerrado
                                90, // Caatinga                   
                                80 // Pampa
                            ]
                        }, {
                            label: 'Integration',
                            backgroundColor: 'rgb(119, 184, 147)',
                            borderColor: 'rgb(119, 184, 147)',
                            borderWidth: 1,
                            data: [
                                1095, // Amazon
                                810, // Atlantic Forest
                                90, // Pantanal
                                1141, // Cerrado
                                80, // Caatinga                   
                                50 // Pampa
                            ]
                        }]
                    };

                    var myHorizontalBar = new Chart(ctx, {
                        type: 'horizontalBar',
                        data: horizontalBarChartData,
                        options: {
                            elements: {
                                rectangle: {
                                    borderWidth: 2,
                                }
                            },
                            responsive: true,
                            legend: {
                                position: 'right',
                            },
                            title: {
                                display: true,
                                text: 'Chart.js Horizontal Bar Chart'
                            }
                        }
                    });
                }
            };
        }
    ]);