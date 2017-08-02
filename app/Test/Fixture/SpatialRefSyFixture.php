<?php
/**
 * SpatialRefSyFixture
 *
 */
class SpatialRefSyFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'srid' => array('type' => 'integer', 'null' => false),
		'auth_name' => array('type' => 'string', 'null' => true, 'length' => 256),
		'auth_srid' => array('type' => 'integer', 'null' => true),
		'srtext' => array('type' => 'string', 'null' => true, 'length' => 2048),
		'proj4text' => array('type' => 'string', 'null' => true, 'length' => 2048),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'srid')
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
			'srid' => 1,
			'auth_name' => 'Lorem ipsum dolor sit amet',
			'auth_srid' => 1,
			'srtext' => 'Lorem ipsum dolor sit amet',
			'proj4text' => 'Lorem ipsum dolor sit amet'
		),
	);

}
