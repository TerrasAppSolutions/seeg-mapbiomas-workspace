<!DOCTYPE html>
<html>
    <head>
        <?php echo $this->Html->charset();?>
        <title><?php echo $title_for_layout;?></title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>	
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    </head>
    <body>
        <?php echo $this->fetch('content'); ?>
    </body>
</html>
