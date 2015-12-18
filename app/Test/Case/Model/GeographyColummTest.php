<?php
App::uses('GeographyColumm', 'Model');

/**
 * GeographyColumm Test Case
 *
 */
class GeographyColummTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.geography_columm'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->GeographyColumm = ClassRegistry::init('GeographyColumm');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->GeographyColumm);

		parent::tearDown();
	}

}
