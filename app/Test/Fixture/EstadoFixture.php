<?php
/**
 * EstadoFixture
 *
 */
class EstadoFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'length' => 11, 'key' => 'primary'),
		'pais_id' => array('type' => 'integer', 'null' => false),
		'nome' => array('type' => 'string', 'null' => true, 'length' => 64),
		'regiao' => array('type' => 'string', 'null' => true, 'length' => 64),
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
			'pais_id' => 1,
			'nome' => 'Lorem ipsum dolor sit amet',
			'regiao' => 'Lorem ipsum dolor sit amet'
		),
	);

}
