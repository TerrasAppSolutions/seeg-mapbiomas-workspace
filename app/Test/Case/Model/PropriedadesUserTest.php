<?php
App::uses('PropriedadesUser', 'Model');

/**
 * PropriedadesUser Test Case
 *
 */
class PropriedadesUserTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.propriedades_user',
		'app.user1',
		'app.user2',
		'app.propriedade',
		'app.municipio',
		'app.estado',
		'app.microregiao',
		'app.car',
		'app.cars_propriedade',
		'app.car_shape',
		'app.endereco',
		'app.pessoa',
		'app.email',
		'app.pessoa_fisica',
		'app.pessoa_juridica',
		'app.pessoas_pessoa_juridica',
		'app.telefone',
		'app.usuario'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->PropriedadesUser = ClassRegistry::init('PropriedadesUser');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->PropriedadesUser);

		parent::tearDown();
	}

}
