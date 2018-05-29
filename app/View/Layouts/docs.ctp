<!DOCTYPE html>
<html>
    <head>
        <?php echo $this->Html->charset(); ?>
        <title>
            MapBiomas Workspace Doc
        </title>
        <meta charset="utf-8"/>
        <meta content="chrome=1" http-equiv="X-UA-Compatible"/>
        <meta content="width=device-width" name="viewport"/>
        <script src="../bower_components/jquery/dist/jquery.min.js">
        </script>
        <script src="../bower_components/flatdoc/legacy.js">
        </script>
        <script src="../bower_components/flatdoc/flatdoc.js">
        </script>
        <!-- Flatdoc theme -->
        <link href="../bower_components/flatdoc/theme-white/style.css" rel="stylesheet"/>
        <script src="../bower_components/flatdoc/theme-white/script.js">
        </script>
    </head>
	<body role="flatdoc">	
	    <?php echo $this->fetch('content'); ?>        
    </body>	
</html>
