<?php
/**
 * CarShapeFixture
 *
 */
class CarShapeFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'car_id' => array('type' => 'integer', 'null' => true),
		'tipo' => array('type' => 'string', 'null' => true, 'length' => 64),
		'srid' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'the_geom' => array('type' => 'text', 'null' => true),
		'area_calculada_m2' => array('type' => 'float', 'null' => true),
		'validado' => array('type' => 'boolean', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id'),
			'car_shapes_car_id' => array('unique' => false, 'column' => 'car_id')
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
			'car_id' => 1,
			'tipo' => 'Lorem ipsum dolor sit amet',
			'srid' => 1,
			'created' => '2014-04-11 17:03:08',
			'modified' => '2014-04-11 17:03:08',
			'the_geom' => 'Lorem ipsum dolor sit amet, aliquet feugiat. Convallis morbi fringilla gravida, phasellus feugiat dapibus velit nunc, pulvinar eget sollicitudin venenatis cum nullam, vivamus ut a sed, mollitia lectus. Nulla vestibulum massa neque ut et, id hendrerit sit, feugiat in taciti enim proin nibh, tempor dignissim, rhoncus duis vestibulum nunc mattis convallis.',
			'area_calculada_m2' => 1,
			'validado' => 1
		),
	);

}
