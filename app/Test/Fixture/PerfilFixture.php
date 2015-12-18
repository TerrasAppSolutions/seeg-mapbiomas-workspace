<?php
/**
 * PerfilFixture
 *
 */
class PerfilFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'perfil' => array('type' => 'string', 'null' => false, 'length' => 64),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'tipo' => array('type' => 'string', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
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
			'perfil' => 'Lorem ipsum dolor sit amet',
			'created' => '2014-04-11 17:10:24',
			'modified' => '2014-04-11 17:10:24',
			'tipo' => 'Lorem ipsum dolor sit amet'
		),
	);

}
