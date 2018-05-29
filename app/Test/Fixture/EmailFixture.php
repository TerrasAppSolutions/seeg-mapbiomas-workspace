<?php
/**
 * EmailFixture
 *
 */
class EmailFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'pessoa_id' => array('type' => 'integer', 'null' => false),
		'email' => array('type' => 'string', 'null' => false),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'confirmado' => array('type' => 'boolean', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id'),
			'unique_email_email' => array('unique' => true, 'column' => array('email', 'pessoa_id')),
			'emails_pessoa_id' => array('unique' => false, 'column' => 'pessoa_id')
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
			'email' => 'Lorem ipsum dolor sit amet',
			'created' => '2014-04-11 17:07:11',
			'modified' => '2014-04-11 17:07:11',
			'confirmado' => 1
		),
	);

}
