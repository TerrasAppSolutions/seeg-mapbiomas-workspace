<?php
App::uses('Municipio', 'Model');

/**
 * Municipio Test Case
 *
 */
class MunicipioTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.municipio',
		'app.estado',
		'app.pais',
		'app.endereco',
		'app.pessoa',
		'app.pessoa_fisica',
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
		$this->Municipio = ClassRegistry::init('Municipio');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Municipio);

		parent::tearDown();
	}

}
