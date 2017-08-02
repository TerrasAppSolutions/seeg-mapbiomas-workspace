<?php
App::uses('GeometryColumm', 'Model');

/**
 * GeometryColumm Test Case
 *
 */
class GeometryColummTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.geometry_columm'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->GeometryColumm = ClassRegistry::init('GeometryColumm');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->GeometryColumm);

		parent::tearDown();
	}

}
