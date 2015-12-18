<?php
App::uses('PerfisUser', 'Model');

/**
 * PerfisUser Test Case
 *
 */
class PerfisUserTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.perfis_user',
		'app.perfil',
		'app.user'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->PerfisUser = ClassRegistry::init('PerfisUser');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->PerfisUser);

		parent::tearDown();
	}

}
