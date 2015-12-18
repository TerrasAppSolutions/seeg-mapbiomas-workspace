<?php
/**
 * PerfisUsuarioFixture
 *
 */
class PerfisUsuarioFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'perfil_id' => array('type' => 'integer', 'null' => true),
		'usuario_id' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'ativo' => array('type' => 'boolean', 'null' => true),
		'indexes' => array(
			'perfis_usuarios_perfil_id' => array('unique' => false, 'column' => 'perfil_id'),
			'perfis_usuarios_usuario_id' => array('unique' => false, 'column' => 'usuario_id')
		),
		'tableParameters' => array()
	);

/**
 * Records
 *
 * @var array
 */
	public $records = array(
		array(
			'id' => 1,
			'perfil_id' => 1,
			'usuario_id' => 1,
			'created' => '2014-04-11 17:10:57',
			'modified' => '2014-04-11 17:10:57',
			'ativo' => 1
		),
	);

}
