<?php
/**
 * CargoFixture
 *
 */
class CargoFixture extends CakeTestFixture {

/**
 * Table name
 *
 * @var string
 */
	public $table = 'cargo';

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'tipo_id' => array('type' => 'integer', 'null' => false),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'ativo' => array('type' => 'boolean', 'null' => true),
		'nome' => array('type' => 'string', 'null' => true, 'length' => 200),
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
			'tipo_id' => 1,
			'created' => '2014-04-11 17:03:40',
			'modified' => '2014-04-11 17:03:40',
			'ativo' => 1,
			'nome' => 'Lorem ipsum dolor sit amet'
		),
	);

}
