<?php
App::uses('PerfisUsuario', 'Model');

/**
 * PerfisUsuario Test Case
 *
 */
class PerfisUsuarioTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.perfis_usuario',
		'app.perfil',
		'app.usuario'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->PerfisUsuario = ClassRegistry::init('PerfisUsuario');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->PerfisUsuario);

		parent::tearDown();
	}

}
