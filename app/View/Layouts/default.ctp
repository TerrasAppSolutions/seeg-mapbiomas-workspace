<!doctype html>
<html>
    <head>
        <?php echo $this->Html->charset(); ?>

        <meta charset="utf-8">

        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

        <title>
            MapBiomas Workmap :: <?php echo $title_for_layout;?>
        </title>

        <?php echo $this->fetch('meta');?>

        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="bower_components/bootstrap-material-design/dist/css/material.css">
        <link rel="stylesheet" href="bower_components/jquery-ui/themes/smoothness/jquery-ui.css">
        <link rel="stylesheet" href="bower_components/angular-material/angular-material.css">
        <link rel="stylesheet" href="bower_components/leaflet-dist/leaflet.css" />
        <link rel="stylesheet" href="bower_components/jstree/dist/themes/default/style.min.css"/>
        <link rel="stylesheet" href="bower_components/pikaday/css/pikaday.css"/>
        <link rel="stylesheet" href="css/bootstrap.vertical-tabs.css">
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="css/control.layers.minimap.css" />
        <link rel="stylesheet" href="css/Control.Opacity.css" />
        <link rel="stylesheet" href="css/iconLayers.css" />
        <link rel="stylesheet" href="lib/wgis/wgis.css" />
        <link rel="stylesheet" href="css/main.css">
    </head>
    <body ng-app="MapBiomasApp">
        <?php //echo $this->fetch('content'); ?>
        <div ui-view></div>
        <footer>
        </footer>
        <!-- Libs -->
        <script src="bower_components/jquery/dist/jquery.min.js"></script>
        <script src="bower_components/jquery-ui/ui/minified/jquery-ui.min.js"></script>
        <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="bower_components/bootstrap-material-design/dist/js/material.js"></script>
        <script src="bower_components/underscore/underscore-min.js"></script>
        <script src="bower_components/leaflet-dist/leaflet.js"></script>
        <script src="bower_components/leaflet-draw/dist/leaflet.draw.js"></script>
        <script src="bower_components/leaflet-plugins/layer/tile/Google.js"></script>
        <script src="bower_components/turf/turf.min.js"></script>
        <script src="bower_components/jstree/dist/jstree.min.js"></script>
        <script src="bower_components/pouchdb/dist/pouchdb.min.js"></script>
        <script src="bower_components/moment/min/moment.min.js"></script>
        <script src="bower_components/pikaday/pikaday.js"></script>
        <script src="js/iconLayers.js"></script>
        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=true"></script>
        <!-- Plugins -->
        <script src="lib/wgis/wgis.js"></script>
        <script src="js/L.Control.Layers.Minimap.js"></script>
        <script src="js/Control.Opacity.js"></script>
        <script src="js/Control.OpacityLayer.js"></script>
        <script src="js/Control.ProgressLayers.js"></script>
        <script src="js/loadimage.js"></script>
        <script src="js/DTreeLayer.js"></script>
        <script src="js/L.Control.Layers.InspectPixel.js"></script>
        <!-- Angularjs -->
        <script src="bower_components/angular/angular.min.js"></script>
        <script src="bower_components/angular-route/angular-route.min.js"></script>
        <script src="bower_components/angular-resource/angular-resource.min.js"></script>
        <script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
        <script src="bower_components/angular-animate/angular-animate.min.js"></script>
        <script src="bower_components/angular-aria/angular-aria.min.js"></script>
        <script src="bower_components/angular-i18n/angular-locale_pt-br.js"></script>
        <script src="bower_components/angular-material/angular-material.js"></script>
        <script src="bower_components/angular-translate/angular-translate.js"></script>
        <script src="bower_components/pikaday-angular/pikaday-angular.js"></script>
        <!-- Angularjs modules -->
        <script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
        <script src="bower_components/angular-ui-slider/src/slider.js"></script>
        <!-- Angularjs App modules -->
        <script src="js/app/app_modules.js"></script>
        <script src="js/app/modules/wgis.js"></script>
        <!-- Angularjs App -->
        <script src="js/app/app.js"></script>
        <!-- Angularjs App controllers -->
        <script src="js/app/controllers/mapbiomas.js"></script>
        <!-- Angularjs App services -->
        <script src="js/app/services/classificacao.js"></script>
        <script src="js/app/services/cartaresultado.js"></script>
        <script src="js/app/services/geeImages.js"></script>
        <!-- Angularjs App directives -->
        <script src="js/app/directives.js"></script>
        <!-- Angularjs App filters -->
        <script src="js/app/filters.js"></script>
        <!-- Angularjs App utils -->
        <script src="js/app/utils.js"></script>
        <!-- Storage -->
        <script type="text/javascript" src="js/storage/biomas.geojson"></script>
        <script type="text/javascript" src="js/storage/ibge_250000.geojson"></script>
        <script type="text/javascript" src="js/storage/langs.json"></script>

        <script>
            var appvars = "<?php echo base64_encode(json_encode(array('appAuth' => $authUser, 'appConfig' => $appConfig))); ?>";
        </script>
    </body>
</html>
