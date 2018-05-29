<?php
/**
 * GeometryColummFixture
 *
 */
class GeometryColummFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'f_table_catalog' => array('type' => 'string', 'null' => false, 'length' => 256),
		'f_table_schema' => array('type' => 'string', 'null' => false, 'length' => 256),
		'f_table_name' => array('type' => 'string', 'null' => false, 'length' => 256),
		'f_geometry_column' => array('type' => 'string', 'null' => false, 'length' => 256),
		'coord_dimension' => array('type' => 'integer', 'null' => false),
		'srid' => array('type' => 'integer', 'null' => false),
		'type' => array('type' => 'string', 'null' => false, 'length' => 30),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => array('f_table_catalog', 'f_table_schema', 'f_table_name', 'f_geometry_column'))
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
			'f_table_catalog' => 'Lorem ipsum dolor sit amet',
			'f_table_schema' => 'Lorem ipsum dolor sit amet',
			'f_table_name' => 'Lorem ipsum dolor sit amet',
			'f_geometry_column' => 'Lorem ipsum dolor sit amet',
			'coord_dimension' => 1,
			'srid' => 1,
			'type' => 'Lorem ipsum dolor sit amet'
		),
	);

}
