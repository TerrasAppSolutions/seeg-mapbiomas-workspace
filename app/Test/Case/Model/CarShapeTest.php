<?php
App::uses('CarShape', 'Model');

/**
 * CarShape Test Case
 *
 */
class CarShapeTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.car_shape',
		'app.car'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->CarShape = ClassRegistry::init('CarShape');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->CarShape);

		parent::tearDown();
	}

}
