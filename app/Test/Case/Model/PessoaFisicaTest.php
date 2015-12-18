<?php
App::uses('PessoaFisica', 'Model');

/**
 * PessoaFisica Test Case
 *
 */
class PessoaFisicaTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.pessoa_fisica',
		'app.pessoa',
		'app.municipio',
		'app.estado',
		'app.pais',
		'app.endereco',
		'app.propriedade',
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
		$this->PessoaFisica = ClassRegistry::init('PessoaFisica');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->PessoaFisica);

		parent::tearDown();
	}

}
