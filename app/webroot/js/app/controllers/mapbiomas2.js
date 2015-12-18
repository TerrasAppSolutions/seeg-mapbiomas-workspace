'use strict';
angular.module('MapBiomas.controllers')
    .controller('MapBiomasController', ['$rootScope', '$scope', '$routeParams', '$location', '$http', '$injector',
        function ($rootScope, $scope, $routeParams, $location, $http, $injector) {

            console.log("mapbiomas controller");

            //Import style example
            //console.log(StylesGeoJSON.APRT);

            var StylesGeoJSON = $injector.get('StylesGeoJSON');
            console.log(StylesGeoJSON.APRT);

            $scope.gridName = "";

            var workmap = L.map('workmap', {
                center: [-14.264383087562635, -59.0625],
                zoom: 13,
                touchZoom: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                zoomControl: false,
            });
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib = 'Map data &copy; OpenStreetMap contributors';
            var osm = new L.TileLayer(osmUrl, {
                minZoom: 0,
                maxZoom: 18,
                attribution: osmAttrib
            });
            var googleTerrain = new L.Google('SATELLITE');
            workmap.addLayer(googleTerrain);
            var last_marker;
            var last_carta_selected;
            var carta_style = {
                "color": "#ffff00",
                "weight": 1.0,
                "opacity": 1,
                "fillOpacity": 0.0,
            };

            function onEachFeatureCarta(feature, layer) {
                // does this feature have a property named popupContent?
                layer.on('click', function (e) {
                    if (layer == e.target) {
                        console.log(e);
                        workmap.setView(e.latlng, 13);
                        var lat = e.latlng.lat;
                        var lng = e.latlng.lng;
                        console.log(lat + ", " + lng);
                        var rectangle = [
                            [lat - 0.050, lng + 0.075],
                            [lat + 0.050, lng + 0.075],
                            [lat + 0.050, lng - 0.075],
                            [lat - 0.050, lng - 0.075]
                        ];
                        var marker = L.polygon(rectangle, {
                            "color": "#e82525",
                            "weight": 1.0,
                            "fill": false,
                            "opacity": 1,
                            "fillOpacity": 0.0
                        });
                        map_carta.addLayer(marker);
                        if (last_marker) {
                            map_carta.removeLayer(last_marker);
                        }
                        last_marker = marker;
                    }
                });
            }
            var last_carta_workmap;
            var last_carta_map_carta;

            var map_carta = L.map('map-carta', {
                center: [-9.535748998133627, -56.26750946044922],
                zoom: 9,
                dragging: false,
                touchZoom: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                zoomControl: false,
            });
            var googleTerrain = new L.Google('SATELLITE');
            map_carta.addLayer(googleTerrain);
            var biomas_style = {
                "color": "#006600",
                "weight": 1.0,
                "opacity": 0.6,
                "fillOpacity": 0.0
            };
            L.geoJson(biomas, {
                style: biomas_style
            }).addTo(map_carta);
            L.geoJson(biomas, {
                style: biomas_style
            }).addTo(workmap);
            var cartas_style = {
                "color": "#666666",
                "weight": 0.5,
                "opacity": 0.9,
                "fillOpacity": 0.2,
                "fillColor": "#ff6666"
            }; //"#5b9ecd"

            var originatorEv;
            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };


            var carta_results = [];

            var carta_results = {};
            $scope.loadResultados = false;
            function getCartaParametros() {
              if($scope.gridName !== ""){
                $scope.loadResultados = true;
                $scope.resultados = [];
                $scope.anos = [];
                var url_base = "http://127.0.0.1:8000/gee/cartas_parametros/";

                if(window.location.host !== "" && window.location.host !== "192.168.1.35:8080"){
                  url_base = "http://"+window.location.host+"/gee/cartas_parametros/";
                }

                $http.post(url_base, {"carta": $scope.gridName}).then(function (respData) {
                                carta_results = respData.data;
                                var resultados = [];
                                var anos = [];
                                for(var key in carta_results){
                                  resultados.push({ year: carta_results[key].year, periodo: " de "+carta_results[key].t0+" á "+carta_results[key].t1 , wanted: false , data: carta_results[key]});
                                  anos.push(parseInt(carta_results[key].year));
                                }

                                $scope.resultados = resultados;
                                $scope.anos = anos;
                                $scope.year = "";
                                $scope.loadResultados = false;
                            });
              }
              // body...
            }

            $scope.toolTipGrid = false;
            function onEachFeatureCartas(feature, layer) {
                // does this feature have a property named popupContent?
                if (feature.properties && feature.properties.name) {
                    //layer.bindPopup(feature.properties.name);
                    layer.on('click', function (e) {
                        if (layer == e.target) {
                            $scope.gridName = feature.properties.name;
                            $scope.toolTipGrid = true;
                            layer.setStyle({
                                "color": "red",
                                "weight": 1,
                                "opacity": 0.9,
                                "fillOpacity": 0.2,
                                "fillColor": "#ff6666"
                            });
                            if(last_carta_selected){
                              last_carta_selected.setStyle({
                                  "color": "#666666",
                                  "weight": 0.4,
                                  "opacity": 0.8,
                                  "fillOpacity": 0.2,
                                  "fillColor": "#ff6666"
                              });
                            }
                            last_carta_selected = layer;
                            workmap.setView(e.latlng, 13);
                            console.log(feature);
                            var layer_carta = L.geoJson(feature, {
                                style: carta_style,
                                onEachFeature: onEachFeatureCarta
                            });
                            map_carta.addLayer(layer_carta);
                            map_carta.fitBounds(layer_carta.getBounds());
                            var layer_carta1 = L.geoJson(feature, {
                                style: carta_style,
                                onEachFeature: onEachFeatureCarta
                            });
                            workmap.addLayer(layer_carta1);
                            if (last_carta_map_carta) {
                                map_carta.removeLayer(last_carta_map_carta);
                            }
                            if (last_carta_workmap) {
                                workmap.removeLayer(last_carta_workmap);
                            }
                            last_carta_map_carta = layer_carta;
                            last_carta_workmap = layer_carta1;
                            getCartaParametros();
                        }
                    });
                }
            }
            var cartas_layers = L.geoJson(cartas, {
                style: cartas_style,
                onEachFeature: onEachFeatureCartas
            });
            var ndfi_layer = L.tileLayer("https://earthengine.googleapis.com/map/4382032908e3fad32e12f4fdeb4a85eb/{z}/{x}/{y}?token=6712f03788a91f6891526968163a1b65", {});
            var ref_layer = L.tileLayer("https://earthengine.googleapis.com/map/3a39fe7becd033c4af3a6e983c615817/{z}/{x}/{y}?token=76ebc00815f874705b8d50ad02ae5c87", {});

            var map_cartas_options = {
                                      center: [-14.264383087562635, -59.0625],
                                      zoom: 4,
                                      minZoom: 3,
                                      maxZoom: 8,
                                    };

            var biomas_cartas = L.geoJson(biomas, {
                                        style: biomas_style
                                    });

            var map_cartas = {};
            $scope.onloadCartas = function(){
              map_cartas = L.map('map-cartas', map_cartas_options);
              map_cartas.addLayer(osm);

              map_cartas.addLayer(biomas_cartas);
              map_cartas.addLayer(cartas_layers);

            };

            var canvasMapId = "";
            var canvasToken = "";

          var dTreeLayer = dTreeLayer || {
            init: function(){
               this.layer = L.tileLayer.dtree();
            },
            render: function(layers, v1, v2, v3, v4){
              this.layer.v1 = v1;
              this.layer.v2 = v2;
              this.layer.v3 = v3;
              this.layer.v4 = v4;
              this.mapIds = {};
              this.tokens = {};

              for(var key in layers){
                 if(key === 'classification'){
                   this.mapIds[key] = layers[key].mapid;
                   this.tokens[key] = layers[key].token;
                 }
                 if(["rawndfi", "gvs", "gv"].indexOf(key) >= 0){
                   console.log(key);
                   this.mapIds[key] = layers[key].mapid;
                   this.tokens[key] = layers[key].token;
                 }
              }

              this.layer.mapIds = this.mapIds
              this.layer.tokens = this.tokens

              console.log(this.mapIds);
              console.log(this.tokens);
            },
            setFilter: function(vv1, vv2, vv3, vv4){
              this.layer.v1 = vv1;
              this.layer.v2 = vv2;
              this.layer.v3 = vv3;
              this.layer.v4 = vv4;
              this.layer.filter_tiles_canvas();
            },
            addTo: function(map){
              console.log(this.extra_layers);
              map.addLayer(this.layer);
            }
          };
          dTreeLayer.init();

          var canvasTiles = L.tileLayer.canvas({"updateWhenIdle": true});

          $scope.minDataInicial = new Date(1984,0,1);
          $scope.maxDataInicial = new Date();
          $scope.minDataFinal = new Date(1984,0,1);
          $scope.maxDataFinal = new Date();


          $scope.v1 = 0;
          $scope.v2 = 0;
          $scope.v3 = 0;
          $scope.v4 = 0;

          var iconLayersControl = new L.Control.IconLayers(
              [
                  {
                      title: 'RGB', // use any string
                      layer: ref_layer, // any ILayer
                      icon: 'img/rgbIcon.png' // 80x80 icon
                  },
                  {
                      title: 'NDFI',
                      layer: ndfi_layer,
                      icon: 'img/ndfiIcon.png'
                  },
                  {
                      title: 'Satélite',
                      layer: new L.Google('SATELLITE'),
                      icon: 'img/satelliteIcon.png'
                  }
              ], {
                  position: 'bottomright',
                  maxLayersInRow: 5
              }
          );

          workmap.addControl(iconLayersControl);
          workmap.addLayer(canvasTiles);

          iconLayersControl.on('activelayerchange', function(e) {
                workmap.removeLayer(canvasTiles);
                workmap.addLayer(canvasTiles);
          });

          var opacitySlider = new L.Control.opacitySlider();
          opacitySlider.setOpacityLayer(canvasTiles);
          workmap.addControl(opacitySlider);

          $scope.v1 = 70;
          $scope.v2 = 45;
          $scope.v3 = 180;
          $scope.v4 = 190;


          $scope.$watch('v1',
              function(newValue, oldValue) {
                  console.log(newValue);
                  console.log(oldValue);
                  if(newValue != oldValue){
                    dTreeLayer.setFilter(parseInt(newValue), parseInt($scope.v1), parseInt($scope.v2), parseInt($scope.v4));
                 }
              });

          $scope.$watch('v2',
              function(newValue, oldValue) {
                  if(newValue != oldValue)
                   dTreeLayer.setFilter(parseInt($scope.v1), parseInt(newValue), parseInt($scope.v2), parseInt($scope.v4));
              });

          $scope.$watch('v3',
              function(newValue, oldValue) {
                  if(newValue != oldValue)
                  dTreeLayer.setFilter(parseInt($scope.v1), parseInt($scope.v2), parseInt(newValue), parseInt($scope.v4));
              });

          $scope.$watch('v4',
              function(newValue, oldValue) {
                  if(newValue != oldValue)
                  dTreeLayer.setFilter(parseInt($scope.v1), parseInt($scope.v2), parseInt($scope.v3), parseInt(newValue));
              });

          var dataInicial;
          var dataFinal;

          $scope.$watch('year',
              function(newValue, oldValue) {
                  if(newValue != oldValue){
                    dataInicial = new Date(parseInt(newValue),5,1);
                    dataFinal = new Date(parseInt(newValue),9,31);
                    $scope.minDataInicial = dataInicial;
                    $scope.maxDataInicial = dataFinal;
                    $scope.minDataFinal = dataInicial;
                    $scope.maxDataFinal = dataFinal;
                    $scope.dataInicial = dataInicial;
                    $scope.dataFinal = dataFinal;
                  }
              });

                $scope.loadShow = false;

                $scope.processar = function(){
                  $scope.loadShow = true;
                  $scope.loadResultados = true;
                  var postData = {
                        "year": $scope.year,
                        "gridName": $scope.gridName,
                        "t0" : moment(dataInicial).format("YYYY-MM-DD"),
                        "t1": moment(dataFinal).format("YYYY-MM-DD"),
                        "cc": $scope.cloud_cover,
                        "dtv_v1": $scope.v1,
                        "dtv_v2": $scope.v2,
                        "dtv_v3": $scope.v3,
                        "dtv_v4": $scope.v4,
                        "sensor": $scope.sensor,
                        "tag_on": 1,
                        "tag_ndfi": 1,
                        "tag_sma": 1,
                        "tag_ref": 1,
                        "tag_dt": 1,
                        "save": 1,
                        "color": "#0B6138",
                        "bioma": "AMAZONIA",
                        "region": "",
                    };
                    console.log(moment(dataInicial).format("YYYY-MM-DD"));
                    console.log(moment(dataFinal).format("YYYY-MM-DD"));
                    console.log(postData);
                    var url_base = "http://127.0.0.1:8000/gee/imagens/classificacao/";

                    if(window.location.host !== "" && window.location.host !== "192.168.1.35:8080"){
                      url_base = "http://"+window.location.host+"/gee/imagens/classificacao/";
                    }

                    $http.post("http://seeg-mapbiomas.terras.agr.br:8000/gee/imagens/classificacao/", postData).then(function (respData) {
                                    var data = respData.data;
                                    console.log(data);
                                    ndfi_layer.setUrl(data.ndfi.url);
                                    ref_layer.setUrl(data.reflectance.url);
                                    dTreeLayer.render(data, parseInt($scope.v1), parseInt($scope.v2), parseInt($scope.v3), parseInt($scope.v4));
                                    workmap.addLayer(dTreeLayer.layer);
                                    $scope.loadShow = false;
                                    $scope.loadResultados = false;

                                });


                };

                $scope.processarResultado = function(data, $event){
                  $scope.year = data.year;
                  dataInicial = moment(data.t0).format("YYYY-MM-DD");
                  dataFinal = moment(data.t1).format("YYYY-MM-DD");
                  $scope.dataInicial = dataInicial;
                  $scope.dataFinal = dataFinal;
                  $scope.cloud_cover = data.cc;
                  $scope.v1 = data.v1;
                  $scope.v2 = data.v2;
                  $scope.v3 = data.v3;
                  $scope.v4 = data.v4;
                  $scope.sensor = data.sensor;

                  $scope.processar();
                };

                var originatorEv;
                $scope.openMenu = function($mdOpenMenu, ev) {
                    originatorEv = ev;
                    $mdOpenMenu(ev);
                };


        }
    ]);
