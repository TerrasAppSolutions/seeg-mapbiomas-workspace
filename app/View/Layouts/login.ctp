<!DOCTYPE html>
<html class="bg-black">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
        <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE"/>
        <meta name="google-signin-client_id" content="643939449792-4klbvomidq0pskb9oo9ps2rdqdjvnu5t.apps.googleusercontent.com">
        <?php echo $this->Html->charset(); ?>
        <title>
        MapBiomas :: <?php echo $title_for_layout; ?>
        </title>
        <link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="../bower_components/jquery-ui/themes/smoothness/jquery-ui.css">
        <?php
        echo $this->fetch('meta');
        echo $this->Html->meta('icon');
        echo $this->fetch('css') . "\n";
        echo $this->fetch('script') . "\n";
        ?>
    </head>
    <body>
        <nav class="navbar navbar navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <img width="165" height="40" style="position: absolute; top: 1px; right: 89%;" src="../img/mapbiomas_logo.png">
                </div>
            </div>
        </nav>
        <div class="container">
            <?php echo $this->Session->flash(); ?>
            <?php echo $this->fetch('content'); ?>
        </div>
    </body>
    <script src="../bower_components/jquery/dist/jquery.min.js"></script>
    <script src="../bower_components/jquery-ui/ui/minified/jquery-ui.min.js"></script>
    <script src="../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
</html>
