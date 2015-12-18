<?php
App::uses('Estado', 'Model');

/**
 * Estado Test Case
 *
 */
class EstadoTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.estado',
		'app.pais',
		'app.endereco',
		'app.pessoa',
		'app.municipio',
		'app.pessoa_fisica',
		'app.propriedade'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Estado = ClassRegistry::init('Estado');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Estado);

		parent::tearDown();
	}

}
