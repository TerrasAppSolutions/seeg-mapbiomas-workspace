<?php
/**
 * MunicipioFixture
 *
 */
class MunicipioFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'nome' => array('type' => 'string', 'null' => true, 'length' => 1),
		'estado_id' => array('type' => 'integer', 'null' => true),
		'microregiao_id' => array('type' => 'integer', 'null' => true),
		'ano_implantacao' => array('type' => 'datetime', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id'),
			'municipios_estado_id' => array('unique' => false, 'column' => 'estado_id')
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
			'nome' => 'Lorem ipsum dolor sit ame',
			'estado_id' => 1,
			'microregiao_id' => 1,
			'ano_implantacao' => '2014-04-11 17:09:52'
		),
	);

}
