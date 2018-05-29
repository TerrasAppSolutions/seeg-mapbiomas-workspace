<?php
/**
 * PessoaFisicaFixture
 *
 */
class PessoaFisicaFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'pessoa_id' => array('type' => 'integer', 'null' => false),
		'cpf' => array('type' => 'string', 'null' => true, 'length' => 64),
		'data_nascimento' => array('type' => 'date', 'null' => true),
		'nome' => array('type' => 'string', 'null' => true),
		'municipio_id' => array('type' => 'integer', 'null' => true),
		'estado_id' => array('type' => 'integer', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id'),
			'pessoa_fisica_pessoa_id' => array('unique' => false, 'column' => 'pessoa_id')
		),
		'tableParameters' => array()
	);

/**
 * Records
 *
 * @var array
 */
	public $records = array(
		array(
			'id' => 1,
			'pessoa_id' => 1,
			'cpf' => 'Lorem ipsum dolor sit amet',
			'data_nascimento' => '2014-04-11',
			'nome' => 'Lorem ipsum dolor sit amet',
			'municipio_id' => 1,
			'estado_id' => 1
		),
	);

}
