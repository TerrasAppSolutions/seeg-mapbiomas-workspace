<?php
App::uses('Usuario', 'Model');

/**
 * Usuario Test Case
 *
 */
class UsuarioTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.usuario',
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
		'app.propriedades_usuario',
		'app.microregiao',
		'app.pessoa_juridica',
		'app.pessoas_pessoa_juridica',
		'app.telefone',
		'app.perfil',
		'app.perfis_usuario'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Usuario = ClassRegistry::init('Usuario');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Usuario);

		parent::tearDown();
	}

}
