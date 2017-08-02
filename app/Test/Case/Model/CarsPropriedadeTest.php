<?php
App::uses('CarsPropriedade', 'Model');

/**
 * CarsPropriedade Test Case
 *
 */
class CarsPropriedadeTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.cars_propriedade',
		'app.car',
		'app.municipio',
		'app.propriedade',
		'app.car_shape'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->CarsPropriedade = ClassRegistry::init('CarsPropriedade');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->CarsPropriedade);

		parent::tearDown();
	}

}
