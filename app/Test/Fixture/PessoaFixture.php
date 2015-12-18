<?php
/**
 * PessoaFixture
 *
 */
class PessoaFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'tipo' => array('type' => 'string', 'null' => true, 'length' => 1),
		'owner' => array('type' => 'integer', 'null' => true),
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
			'created' => '2014-04-11 17:12:34',
			'modified' => '2014-04-11 17:12:34',
			'tipo' => 'Lorem ipsum dolor sit ame',
			'owner' => 1
		),
	);

}
