<?php
App::uses('Propriedade', 'Model');

/**
 * Propriedade Test Case
 *
 */
class PropriedadeTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.propriedade',
		'app.municipio',
		'app.estado',
		'app.pais',
		'app.endereco',
		'app.pessoa',
		'app.email',
		'app.pessoa_fisica',
		'app.pessoa_juridica',
		'app.pessoas_pessoa_juridica',
		'app.telefone',
		'app.usuario',
		'app.microregiao',
		'app.car',
		'app.cars_propriedade',
		'app.car_shape',
		'app.propriedades_usuario'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Propriedade = ClassRegistry::init('Propriedade');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Propriedade);

		parent::tearDown();
	}

}
