<!doctype html>
<html>
    <head>
        <?php echo $this->Html->charset(); ?>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <title>
            MapBiomas Workspace
        </title>
        <?php echo $this->fetch('meta'); ?>
        <meta name="description" content=""/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <!-- Libs -->
        <link rel="stylesheet" href="../../bower_components/jquery-ui/themes/smoothness/jquery-ui.css"/>
        <link rel="stylesheet" href="../../bower_components/bootstrap/dist/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="../../bower_components/font-awesome/css/font-awesome.min.css"/>
        <link rel="stylesheet" href="../../bower_components/leaflet-dist/leaflet.css" />
        <link rel="stylesheet" href="../../bower_components/leaflet-draw/dist/leaflet.draw.css" />
        <link rel="stylesheet" href="../../bower_components/select2/select2.css"/>
        <link rel="stylesheet" href="../../bower_components/select2-bootstrap-css/select2-bootstrap.min.css"/>
        <!-- Plugins -->
        <link rel="stylesheet" href="../../bower_components/jstree/dist/themes/default/style.min.css"/>
        <link rel="stylesheet" href="../../bower_components/pikaday/css/pikaday.css"/>
        <link rel="stylesheet" href="../../lib/wgis/wgis.css" />
        <link rel="stylesheet" href="../../lib/wgis/wgis.css" />
        <link rel="stylesheet" href="../../css/control.layers.minimap.css" />
        <link rel="stylesheet" href="../../css/iconLayers.css" />
        <!-- adminlte -->
        <link rel="stylesheet" href="../../bower_components/admin-lte/dist/css/AdminLTE.min.css"/>        
        <link rel="stylesheet" href="../../bower_components/admin-lte/dist/css/skins/_all-skins.min.css"/>
        <!-- import to bower -->
        <link rel="stylesheet" href="../../css/Control.Opacity.css" />
        <!-- app -->        
        <link rel="stylesheet" href="../../css/style.css"/>
    </head>   
    <body ng-app="MapBiomasApp" class="hold-transition skin-black-light sidebar-mini fill">
        <div class="wrapper">
            <header class="main-header navbar-fixed-top">
                <nav class="navbar" role="navigation">
                    <a class="pull-left" href="#">
                        <img height="55" src="../../img/logo/<?php echo $appConfig['IMG']['logo_file'];?>" alt="MapBiomas Workspace"/>
                    </a>
                    <a class="navbar-brand pull-right" href="#">
                        <img height="30" src="../../img/powered_by_terras.png" alt="Terras"/>
                    </a>
                    <a class="navbar-brand pull-right" href="#">
                        <img height="30" src="../../img/GoogleEarthEngine_v1.png" alt="Google Earth Engine"/>
                    </a>
                </nav>
            </header>            
            <div class="content-wrapper">
                <div class="row" style="height:100%">
                    <div class="col-md-4 sidebar">
                            <input value="1" type="checkbox" checked class="coverage_class" />
                            <span style="background-color:#129912;">&nbsp&nbsp&nbsp</span> 1. Floresta
                            <br/>

                            <input value="2" type="checkbox" class="coverage_class" />
                            <span style="background-color:#1F4423;">&nbsp&nbsp&nbsp</span> 1.1. Formações Florestais Naturais
                            <br/>

                            <input value="3" type="checkbox" class="coverage_class" />
                            <span style="background-color:#006400;">&nbsp&nbsp&nbsp</span> 1.1.1. Floresta Densa
                            <br/>

                            <input value="4" type="checkbox" class="coverage_class" />
                            <span style="background-color:#00FF00;">&nbsp&nbsp&nbsp</span> 1.1.2. Floresta Aberta
                            <br/>

                            <input value="5" type="checkbox" class="coverage_class" />
                            <span style="background-color:#687537;">&nbsp&nbsp&nbsp</span> 1.1.3. Mangue
                            <br/>

                            <input value="6" type="checkbox" class="coverage_class" />
                            <span style="background-color:#76A5AF;">&nbsp&nbsp&nbsp</span> 1.1.4. Floresta Alagada
                            <br/>

                            <input value="7" type="checkbox" class="coverage_class" />
                            <span style="background-color:#29EEE4;">&nbsp&nbsp&nbsp</span> 1.1.5. Floresta Degradada
                            <br/>

                            <input value="8" type="checkbox" class="coverage_class" />
                            <span style="background-color:#77A605;">&nbsp&nbsp&nbsp</span> 1.1.6. Floresta Secundária
                            <br/>

                            <input value="9" type="checkbox" class="coverage_class" />
                            <span style="background-color:#935132;">&nbsp&nbsp&nbsp</span> 1.2. Silvicultura
                            <br/>

                            <input value="10" type="checkbox" checked class="coverage_class" />
                            <span style="background-color:#FF9966;">&nbsp&nbsp&nbsp</span> 2. Formações Naturais não Florestais
                            <br/>

                            <input value="11" type="checkbox" class="coverage_class" />
                            <span style="background-color:#45C2A5;">&nbsp&nbsp&nbsp</span> 2.1. Áreas Úmidas Naturais não Flore
                            <br/>

                            <input value="12" type="checkbox" class="coverage_class" />
                            <span style="background-color:#B8AF4F;">&nbsp&nbsp&nbsp</span> 2.2. Vegetação Campestre (Campos)
                            <br/>

                            <input value="13" type="checkbox" class="coverage_class" />
                            <span style="background-color:#F1C232;">&nbsp&nbsp&nbsp</span> 2.3. Outras formações não Florestais
                            <br/>

                            <input value="14" type="checkbox" checked class="coverage_class" />
                            <span style="background-color:#FFFFB2;">&nbsp&nbsp&nbsp</span> 3. Uso Agropecuário
                            <br/>

                            <input value="15" type="checkbox" class="coverage_class" />
                            <span style="background-color:#FFD966;">&nbsp&nbsp&nbsp</span> 3.1. Pastagem
                            <br/>

                            <input value="16" type="checkbox" class="coverage_class" />
                            <span style="background-color:#F6B26B;">&nbsp&nbsp&nbsp</span> 3.1.1. Pastagem em Campos Naturais (
                            <br/>

                            <input value="17" type="checkbox" class="coverage_class" />
                            <span style="background-color:#A0D0DE;">&nbsp&nbsp&nbsp</span> 3.1.2. Outras Pastagens
                            <br/>

                            <input value="18" type="checkbox" class="coverage_class" />
                            <span style="background-color:#E974ED;">&nbsp&nbsp&nbsp</span> 3.2. Agricultura
                            <br/>

                            <input value="19" type="checkbox" class="coverage_class" />
                            <span style="background-color:#D5A6BD;">&nbsp&nbsp&nbsp</span> 3.2.1. Culturas Anuais
                            <br/>

                            <input value="20" type="checkbox" class="coverage_class" />
                            <span style="background-color:#C27BA0;">&nbsp&nbsp&nbsp</span> 3.2.2. Culturas Semi-Perene (Cana de
                            <br/>

                            <input value="28" type="checkbox" class="coverage_class" />
                            <span style="background-color:#CE3D3D;">&nbsp&nbsp&nbsp</span> 3.2.3. Mosaico de
                            <br/>

                            <input value="21" type="checkbox" class="coverage_class" />
                            <span style="background-color:#FFEFC3;">&nbsp&nbsp&nbsp</span> 3.3 Agricultura ou Pastagem (biomas)
                            <br/>

                            <input value="22" type="checkbox" checked class="coverage_class" />
                            <span style="background-color:#EA9999;">&nbsp&nbsp&nbsp</span> 4.Áreas não vegetadas
                            <br/>

                            <input value="23" type="checkbox" class="coverage_class" />
                            <span style="background-color:#DD7E6B;">&nbsp&nbsp&nbsp</span> 4.1. Praias e dunas
                            <br/>

                            <input value="24" type="checkbox" class="coverage_class" />
                            <span style="background-color:#B7B7B7;">&nbsp&nbsp&nbsp</span> 4.2. Infraestrutura Urbana
                            <br/>

                            <input value="25" type="checkbox" class="coverage_class" />
                            <span style="background-color:#FF99FF;">&nbsp&nbsp&nbsp</span> 4.3. Outras áreas não vegetadas
                            <br/>

                            <input value="26" type="checkbox" checked class="coverage_class" />
                            <span style="background-color:#0000FF;">&nbsp&nbsp&nbsp</span> 5. Corpos Dágua
                            <br/>

                            <input value="27" type="checkbox" checked class="coverage_class" />
                            <span style="background-color:#D5D5E5 ;">&nbsp&nbsp&nbsp</span> 6. Não observado
                            <br/>
                    </div>
                    <div class="col-md-8" style="height:100%">
                        <div id="map" style="width:100%;height:100%"></div>
                    </div>
                </div>
            </div>            
        </div>
        <!-- Libs -->
        <script src="../../bower_components/jquery/dist/jquery.min.js">
        </script>
        <script src="../../bower_components/jquery-ui/ui/minified/jquery-ui.min.js">
        </script>
        <script src="../../bower_components/bootstrap/dist/js/bootstrap.min.js">
        </script>
        <script src="../../bower_components/underscore/underscore-min.js">
        </script>
        <script src="../../bower_components/leaflet-dist/leaflet.js">
        </script> 

        <script>
            $(function() {
                console.log('dsdf');
                var coverage;
                var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
                var osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
                var osm = L.tileLayer(osmUrl, {
                    maxZoom: 18,
                    attribution: osmAttrib
                });

                var map = L.map('map').setView([-14, -52], 4).addLayer(osm);

                $(".coverage_class").change(function() {
                    addCoverage();
                });

                function addCoverage() {

                    var classesIds = [];

                    $(".coverage_class:checked").each(function(i, el) {
                    classesIds.push($(el).val());
                    });

                    if (coverage) {
                    map.removeLayer(coverage);
                    }

                    coverage = L.tileLayer.wms("http://seeg-mapbiomas.terras.agr.br/cgi-bin/mapserv", {
                    layers: 'coverage',
                    map: "wms-c2/classification/coverage.map",
                    year: 2015,
                    territory_id: 10,
                    classification_ids: classesIds,
                    format: 'image/png',
                    transparent: true,
                    attribution: "MapBiomas Workspace"
                    });

                    map.addLayer(coverage);

                }

                addCoverage();

            });

        </script>

    </body>
</html>
