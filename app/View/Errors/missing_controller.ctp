
<h2>Página não encontrada</h2>
<?php
	$this->layout = "html";
	$this->response->type("html");	

if (Configure::read('debug') > 0): ?>
<?php	
$pluginDot = empty($plugin) ? null : $plugin . '.';
?>
<h2><?php echo __d('cake_dev', 'Missing Controller'); ?></h2>
<p class="error">
	<strong><?php echo __d('cake_dev', 'Error'); ?>: </strong>
	<?php echo __d('cake_dev', '%s could not be found.', '<em>' . h($pluginDot . $class) . '</em>'); ?>
</p>
<p class="error">
	<strong><?php echo __d('cake_dev', 'Error'); ?>: </strong>
	<?php echo __d('cake_dev', 'Create the class %s below in file: %s', '<em>' . h($class) . '</em>', (empty($plugin) ? APP_DIR . DS : CakePlugin::path($plugin)) . 'Controller' . DS . h($class) . '.php'); ?>
</p>
<pre>
&lt;?php
class <?php echo h($class . ' extends ' . $plugin); ?>AppController {

}
</pre>
<p class="notice">
	<strong><?php echo __d('cake_dev', 'Notice'); ?>: </strong>
	<?php echo __d('cake_dev', 'If you want to customize this error message, create %s', APP_DIR . DS . 'View' . DS . 'Errors' . DS . 'missing_controller.ctp'); ?>
</p>

<?php echo $this->element('exception_stack_trace'); ?>

<?php
endif;
?>
</p>
