<?php
App::uses('Pessoa', 'Model');

/**
 * Pessoa Test Case
 *
 */
class PessoaTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.pessoa',
		'app.email',
		'app.endereco',
		'app.municipio',
		'app.estado',
		'app.pais',
		'app.pessoa_fisica',
		'app.propriedade',
		'app.microregiao',
		'app.car',
		'app.cars_propriedade',
		'app.car_shape',
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
		$this->Pessoa = ClassRegistry::init('Pessoa');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Pessoa);

		parent::tearDown();
	}

}
