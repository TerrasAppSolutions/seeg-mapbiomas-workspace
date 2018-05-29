<!doctype html>
<html>
    <head>
        <?php echo $this->Html->charset(); ?>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <title>
            MapBiomas Workspace :: <?php echo $title_for_layout; ?>
        </title>
        <?php echo $this->fetch('meta'); ?>
        <meta name="description" content=""/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <!-- Libs -->
        <link rel="stylesheet" href="bower_components/jquery-ui/themes/smoothness/jquery-ui.css"/>
        <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css"/>
        <link rel="stylesheet" href="bower_components/leaflet-dist/leaflet.css" />
        <link rel="stylesheet" href="bower_components/leaflet-draw/dist/leaflet.draw.css" />
        <link rel="stylesheet" href="bower_components/select2/select2.css"/>
        <link rel="stylesheet" href="bower_components/select2-bootstrap-css/select2-bootstrap.min.css"/>
        <!-- Plugins -->
        <link rel="stylesheet" href="bower_components/jstree/dist/themes/default/style.min.css"/>
        <link rel="stylesheet" href="bower_components/pikaday/css/pikaday.css"/>
        <link rel="stylesheet" href="bower_components/Leaflet.EasyButton/src/easy-button.css"/>
        <link rel="stylesheet" href="bower_components/leaflet-search/src/leaflet-search.css"/>
        <link rel="stylesheet" href="lib/wgis/wgis.css" />
        <link rel="stylesheet" href="lib/wgis/wgis.css" />
        <link rel="stylesheet" href="css/control.layers.minimap.css" />
        <link rel="stylesheet" href="css/iconLayers.css" />
        <!-- adminlte -->
        <link rel="stylesheet" href="bower_components/admin-lte/dist/css/AdminLTE.min.css"/>        
        <link rel="stylesheet" href="bower_components/admin-lte/dist/css/skins/_all-skins.min.css"/>
        <!-- import to bower -->
        <link rel="stylesheet" href="css/Control.Opacity.css" />
        <!-- app -->        
        <link rel="stylesheet" href="css/style.css"/>
    </head>   
    <body ng-app="MapBiomasApp" class="hold-transition skin-black-light sidebar-mini fill">
        <div class="wrapper">
            <header class="main-header navbar-fixed-top">
                <nav class="navbar" role="navigation">
                    <a class="pull-left" href="#">
                        <img height="55" src="img/logo/<?php echo $appConfig['IMG']['logo_file'];?>" alt="MapBiomas Workspace"/>
                    </a>
                    <a class="navbar-brand pull-right" href="#">
                        <img height="30" src="img/powered_by_terras.png" alt="Terras"/>
                    </a>
                    <a class="navbar-brand pull-right" href="#">
                        <img height="30" src="img/GoogleEarthEngine_v1.png" alt="Google Earth Engine"/>
                    </a>
                </nav>
            </header>
            <aside main-sidebar></aside>
            <div ui-view class="content-wrapper">
            </div>
            <?php echo $this->fetch('content');?>
        </div>
        <!-- Libs -->
        <script src="bower_components/jquery/dist/jquery.min.js">
        </script>
        <script src="bower_components/jquery-ui/ui/minified/jquery-ui.min.js">
        </script>
        <script src="bower_components/bootstrap/dist/js/bootstrap.min.js">
        </script>
        <script src="bower_components/underscore/underscore-min.js">
        </script>
        <script src="bower_components/leaflet-dist/leaflet.js">
        </script>
        <script src="bower_components/turf.min/index.js">
        </script>
        <script src="bower_components/pouchdb/dist/pouchdb.min.js">
        </script>
        <script src="bower_components/moment/min/moment.min.js">
        </script>
        <script src="bower_components/select2/select2.min.js">
        </script>
        <!-- <script src="bower_components/admin-lte/plugins/chartjs/Chart.min.js">
        </script> -->  
        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=true">
        </script>
        <script src="bower_components/chartjs/Chart.min.js">
        </script>
        <!-- Plugins -->
        <script src="bower_components/leaflet-plugins/layer/tile/Google.js">
        </script>
        <script src="bower_components/leaflet-draw/dist/leaflet.draw.js">
        </script>
        <script src="bower_components/jstree/dist/jstree.min.js">
        </script>
        <script src="bower_components/bootbox.js/bootbox.js">
        </script>
        <script src="bower_components/notifyjs/dist/notify.js">
        </script>
        <script src="bower_components/pikaday/pikaday.js">
        </script>
        <script src="lib/wgis/wgis.js">
        </script>
        <script src="lib/utils/iconLayers.js">
        </script>
        <script src="lib/utils/L.Control.Layers.Minimap.js">
        </script>
        <script src="lib/utils/Control.Opacity.js">
        </script>
        <script src="lib/utils/L.Control.OpacityLayer.js">
        </script>
        <script src="lib/utils/L.Classification.js">
        </script>
        <script src="lib/utils/L.TileLayer.GeeScript.js">
        </script>
        <script src="lib/utils/L.Control.LayerProgressBar.js">
        </script>
        <script src="lib/utils/L.Control.Layers.InspectPixel.js">
        </script>
        <script src="lib/leaflet.shapefile/catiline.js">             
        </script>
        <script src="lib/leaflet.shapefile/leaflet.shpfile.js">            
        </script>
        <!-- google ee api -->
        <script src="lib/ee/ee_api_js.js">            
        </script>
        <script src="lib/geeimageprocessing/geeimageprocessing.js">            
        </script>
        <script src="lib/geeimageprocessing/mapbiomasservice.js">            
        </script>
        <!-- Angularjs -->
        <script src="bower_components/angular/angular.min.js">
        </script>
        <script src="bower_components/angular-route/angular-route.min.js">
        </script>
        <script src="bower_components/angular-resource/angular-resource.min.js">
        </script>
        <script src="bower_components/angular-sanitize/angular-sanitize.min.js">
        </script>
        <script src="bower_components/angular-animate/angular-animate.min.js">
        </script>
        <script src="bower_components/angular-aria/angular-aria.min.js">
        </script>
        <script src="bower_components/angular-i18n/angular-locale_pt-br.js">
        </script>
        <script src="bower_components/angular-translate/angular-translate.js">
        </script>
        <!-- Angularjs plugins -->
        <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js">
        </script>
        <script src="bower_components/angular-ui-slider/src/slider.js">
        </script>
        <script src="bower_components/angular-ui-router/release/angular-ui-router.min.js">
        </script>
        <script src="bower_components/pikaday-angular/pikaday-angular.js">
        </script>
        <script src="bower_components/angular-ui-select2/src/select2.js">
        </script>
        <script src="bower_components/Leaflet.EasyButton/src/easy-button.js">
        </script>
        <script src="bower_components/leaflet-search/src/leaflet-search.js">
        </script>
        <!-- Angularjs App modules -->
        <script src="js/app/app.modules.js">
        </script>
        <script src="js/app/modules/wgis/wgis.js">
        </script>
        <script src="js/app/modules/workmap/workmap.directive.js">
        </script>
        <script src="js/app/modules/workmap/workmap.api.js">
        </script>
        <script src="js/app/modules/workmap/layers/<?php echo $appConfig['REFERENCELAYER']['modulejs'];?>">
        </script>
        <script src="js/app/modules/workmap/workmap.draw.js">
        </script>         
        <script src="js/app/modules/dtree/dtree.directive.js">
        </script>
        <script src="js/app/modules/dtree/dtree.decisiontree.js">
        </script>
        <script src="js/app/modules/dtree/dtreemap.api.js">
        </script>
        <script src="js/app/modules/legenda/<?php echo $appConfig['DTREELEGEND']['modulejs'];?>">
        </script>

        <!-- Angularjs App -->
        <script src="js/app/app.js">
        </script>        
        <!-- Angularjs App controllers -->
        <script src="js/app/controllers/mapbiomas.js">
        </script>
        <script src="js/app/controllers/classificacoes.js">
        </script>
        <script src="js/app/controllers/classificacao_tarefas.js">
        </script>
        <script src="js/app/controllers/classe_areas.js">
        </script>
        <script src="js/app/controllers/dtree.js">
        </script>
        <script src="js/app/controllers/temporalFilter.js">
        </script>
        <!-- Angularjs App services -->
        <script src="js/app/services/amostra.js">
        </script>
        <script src="js/app/services/classificacao.js">
        </script>
        <script src="js/app/services/classearea.js">
        </script>
        <script src="js/app/services/decisiontree.js">
        </script>
        <script src="js/app/services/exportacao_tarefa.js">
        </script>
        <script src="js/app/services/cartaresultado.js">
        </script>
        <script src="js/app/services/geeImages.js">
        </script>
        <script src="js/app/services/geeimages.js">
        </script>
        <script src="js/app/services/geeProcessData.service.js">
        </script>
        <script src="js/app/services/leaflet-custom.service.js">
        </script>
        <script src="js/app/services/amostra.js">
        </script>
        <script src="js/app/services/cartaRegiaoInfo.js">
        </script>
        <script src="js/app/services/temporalFilter.js">
        </script>
        <script src="js/app/services/temporalFilterProject.js">
        </script>
        <script src="js/app/services/classes.js">
        </script>
        <script src="js/app/services/mapTaskLeaflet.js">
        </script>
        <!-- Angularjs App directives -->
        <script src="js/app/directives.js">
        </script>
        <!-- Angularjs App filters -->
        <script src="js/app/filters.js">
        </script>
        <!-- Angularjs App utils -->
        <script src="js/app/utils.js">
        </script>
        <!-- Angularjs App widgets -->
        <script src="js/app/widgets/widget.altitude.gradient.js">
        </script>


        <!-- Angularjs App Modules (refactoring to feature structure) -->

        <!-- Sample Module -->
        <script src="js/app/modules/samples/samples.module.js">
        </script>
        <script src="js/app/modules/samples/samples.route.js">
        </script>
        <script src="js/app/modules/samples/samples-index.controller.js">
        </script>
        <script src="js/app/modules/samples/samples-map.directive.js">
        </script>
        <script src="js/app/modules/samples/samples-chart.directive.js">
        </script>
        <script src="js/app/modules/samples/samples-map.controller.js">
        </script>
        <script src="js/app/modules/samples/samples-map-layers.js">
        </script>
        <script src="js/app/modules/samples/samples-map-drawctrl.js">
        </script>
        <script src="js/app/modules/samples/samples-map-util.js">
        </script>


        <!-- Storage -->
        <script type="text/javascript" src="js/assets/charts/<?php echo $appConfig['CHARTS']['file_geojson'];?>">
        </script>
        <script type="text/javascript" src="js/assets/langs/<?php echo $appConfig['TRANSLATION']['file_json'];?>">
        </script>
        <script>
            var appvars = "<?php echo base64_encode(json_encode(array('appAuth' =>$authUser, 'appConfig' =>$appConfig))); ?>";
        </script>
        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
            ga('create', '<?php echo $appConfig['GOOGLEANALYTICS']['code'];?>', 'auto');
            ga('send', 'pageview');
        </script>
    </body>
</html>
