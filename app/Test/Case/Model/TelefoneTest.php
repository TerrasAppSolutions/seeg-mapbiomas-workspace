<?php
App::uses('Telefone', 'Model');

/**
 * Telefone Test Case
 *
 */
class TelefoneTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.telefone',
		'app.pessoa',
		'app.email',
		'app.endereco',
		'app.municipio',
		'app.estado',
		'app.pais',
		'app.pessoa_fisica',
		'app.propriedade',
		'app.car',
		'app.cars_propriedade',
		'app.car_shape',
		'app.usuario',
		'app.propriedades_usuario',
		'app.microregiao',
		'app.pessoa_juridica',
		'app.pessoas_pessoa_juridica'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Telefone = ClassRegistry::init('Telefone');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Telefone);

		parent::tearDown();
	}

}
