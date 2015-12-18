<?php
App::uses('PessoaJuridica', 'Model');

/**
 * PessoaJuridica Test Case
 *
 */
class PessoaJuridicaTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.pessoa_juridica',
		'app.pessoa',
		'app.pessoas_pessoa_juridica'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->PessoaJuridica = ClassRegistry::init('PessoaJuridica');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->PessoaJuridica);

		parent::tearDown();
	}

}
