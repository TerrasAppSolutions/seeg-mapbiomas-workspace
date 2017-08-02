<?php
/**
 * UsuarioFixture
 *
 */
class UsuarioFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'pessoa_id' => array('type' => 'integer', 'null' => false),
		'username' => array('type' => 'string', 'null' => false, 'length' => 64),
		'password' => array('type' => 'string', 'null' => true, 'length' => 64),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'tipo' => array('type' => 'string', 'null' => true),
		'ativo' => array('type' => 'boolean', 'null' => true),
		'nome' => array('type' => 'string', 'null' => true, 'length' => 200),
		'email' => array('type' => 'string', 'null' => true, 'length' => 100),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id'),
			'unique_user_username' => array('unique' => true, 'column' => 'username')
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
			'username' => 'Lorem ipsum dolor sit amet',
			'password' => 'Lorem ipsum dolor sit amet',
			'created' => '2014-04-11 17:15:48',
			'modified' => '2014-04-11 17:15:48',
			'tipo' => 'Lorem ipsum dolor sit amet',
			'ativo' => 1,
			'nome' => 'Lorem ipsum dolor sit amet',
			'email' => 'Lorem ipsum dolor sit amet'
		),
	);

}
