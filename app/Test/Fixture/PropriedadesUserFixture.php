<?php
/**
 * PropriedadesUserFixture
 *
 */
class PropriedadesUserFixture extends CakeTestFixture {

/**
 * Table name
 *
 * @var string
 */
	public $table = 'propriedades_users';

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'user_id_1' => array('type' => 'integer', 'null' => true),
		'user_id_2' => array('type' => 'integer', 'null' => true),
		'propriedade_id' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
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
			'user_id_1' => 1,
			'user_id_2' => 1,
			'propriedade_id' => 1,
			'created' => '2014-04-10 15:47:40',
			'modified' => '2014-04-10 15:47:40'
		),
	);

}
