<?php
/**
 * PessoasPessoaJuridicaFixture
 *
 */
class PessoasPessoaJuridicaFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'pessoa_id' => array('type' => 'integer', 'null' => true),
		'pessoa_juridica_id' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'cargo_id' => array('type' => 'integer', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id'),
			'pessoas_pessoa_juridica_cargo_id' => array('unique' => false, 'column' => 'cargo_id'),
			'pessoas_pessoa_juridica_pessoa_id' => array('unique' => false, 'column' => 'pessoa_id'),
			'pessoas_pessoa_juridica_pessoa_juridica_id' => array('unique' => false, 'column' => 'pessoa_juridica_id')
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
			'pessoa_juridica_id' => 1,
			'created' => '2014-04-11 17:13:06',
			'modified' => '2014-04-11 17:13:06',
			'cargo_id' => 1
		),
	);

}
