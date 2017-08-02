<?php
App::uses('PropriedadesUsuario', 'Model');

/**
 * PropriedadesUsuario Test Case
 *
 */
class PropriedadesUsuarioTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.propriedades_usuario',
		'app.usuario1',
		'app.usuario2',
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
		'app.car_shape'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->PropriedadesUsuario = ClassRegistry::init('PropriedadesUsuario');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->PropriedadesUsuario);

		parent::tearDown();
	}

}
