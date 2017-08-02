<?php
App::uses('SpatialRefSy', 'Model');

/**
 * SpatialRefSy Test Case
 *
 */
class SpatialRefSyTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.spatial_ref_sy'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->SpatialRefSy = ClassRegistry::init('SpatialRefSy');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->SpatialRefSy);

		parent::tearDown();
	}

}
