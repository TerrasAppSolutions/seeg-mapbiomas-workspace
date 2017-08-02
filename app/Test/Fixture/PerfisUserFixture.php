<?php
/**
 * PerfisUserFixture
 *
 */
class PerfisUserFixture extends CakeTestFixture {

/**
 * Table name
 *
 * @var string
 */
	public $table = 'perfis_users';

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'perfil_id' => array('type' => 'integer', 'null' => true),
		'user_id' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'ativo' => array('type' => 'boolean', 'null' => true),
		'indexes' => array(
			
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
			'user_id' => 1,
			'created' => '2014-04-10 15:44:03',
			'modified' => '2014-04-10 15:44:03',
			'ativo' => 1
		),
	);

}
