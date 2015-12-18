<?php
/**
 * PropriedadesUsuarioFixture
 *
 */
class PropriedadesUsuarioFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'usuario1_id' => array('type' => 'integer', 'null' => true),
		'usuario2_id' => array('type' => 'integer', 'null' => true),
		'propriedade_id' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'indexes' => array(
			'propriedades_usuarios_propriedade_id' => array('unique' => false, 'column' => 'propriedade_id'),
			'propriedades_usuarios_usuario1_id' => array('unique' => false, 'column' => 'usuario1_id'),
			'propriedades_usuarios_usuario2_id' => array('unique' => false, 'column' => 'usuario2_id')
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
			'usuario1_id' => 1,
			'usuario2_id' => 1,
			'propriedade_id' => 1,
			'created' => '2014-04-11 17:14:10',
			'modified' => '2014-04-11 17:14:10'
		),
	);

}
