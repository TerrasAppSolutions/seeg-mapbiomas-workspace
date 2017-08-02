<?php
/**
 * CarsPropriedadeFixture
 *
 */
class CarsPropriedadeFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'car_id' => array('type' => 'integer', 'null' => true),
		'propriedade_id' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id'),
			'cars_propriedades_car_id' => array('unique' => false, 'column' => 'car_id'),
			'cars_propriedades_propriedade_id' => array('unique' => false, 'column' => 'propriedade_id')
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
			'propriedade_id' => 1,
			'created' => '2014-04-11 17:06:39',
			'modified' => '2014-04-11 17:06:39'
		),
	);

}
