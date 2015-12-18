<?php
/**
 * TelefoneFixture
 *
 */
class TelefoneFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'pessoa_id' => array('type' => 'integer', 'null' => false),
		'telefone' => array('type' => 'string', 'null' => false, 'length' => 64),
		'tipo' => array('type' => 'string', 'null' => true, 'length' => 64),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'indexes' => array(
			'telefone_pessoa_id' => array('unique' => false, 'column' => 'pessoa_id')
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
			'pessoa_id' => 1,
			'telefone' => 'Lorem ipsum dolor sit amet',
			'tipo' => 'Lorem ipsum dolor sit amet',
			'created' => '2014-04-11 17:15:16',
			'modified' => '2014-04-11 17:15:16'
		),
	);

}
