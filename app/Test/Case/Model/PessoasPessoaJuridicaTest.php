<?php
App::uses('PessoasPessoaJuridica', 'Model');

/**
 * PessoasPessoaJuridica Test Case
 *
 */
class PessoasPessoaJuridicaTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.pessoas_pessoa_juridica',
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
		'app.telefone',
		'app.usuario',
		'app.cargo',
		'app.tipo'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->PessoasPessoaJuridica = ClassRegistry::init('PessoasPessoaJuridica');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->PessoasPessoaJuridica);

		parent::tearDown();
	}

}
